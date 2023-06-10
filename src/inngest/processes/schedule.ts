import appendToAction from "~/db-admin/append-to-action"
import getProfileFromEmail from "~/db-admin/get-profile-from-email"
import getSequenceFromLog from "~/db-admin/get-sequence-by-id"
import { Action, Log, Profile } from "~/db-admin/types"
import { createGmailDraftInThread, findThread, makeUnreadInInbox } from "~/google"
import getActionById from "~/db-admin/get-action-by-id"
import getLogById from "~/db-admin/get-log-by-id"
import getPromptById from "~/db-admin/get-prompt-by-id"

import sendMail from "~/send-mail"
import appendToLog from "~/db-admin/append-to-log"

export default async function schedule(action_id: string): Promise<Action>{
  let action = await getActionById(action_id)
  
  if (!action) {
    throw new Error(`Action ${action_id} not found`)
  }

  if (action.status === 'complete') {
    return action
  }

  let log = await getLogById(action.log_id!)

  if (!log) {
    throw new Error(`Log ${action.log_id} not found`)
  }

  const prompt = await getPromptById(action.prompt_id!)

  if (!prompt) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: `Prompt ${action.prompt_id} not found`
    })
    action = await appendToAction(action, {
      status: 'error',
      errorMessage: `Prompt ${action.prompt_id} not found`
    })

    throw new Error(`Prompt ${action.prompt_id} not found`)
  }

  action = await appendToAction(action, {
    status: 'sending'
  })

  if (!log.from) {
    throw new Error('No from address found in action')
  }

  const profile: Profile = await getProfileFromEmail((log.from as any).address)

  if (!profile.google_refresh_token) {
    action = await appendToAction(action, {
      status: 'error',
      errorMessage: 'No google refresh token found for this email'
    })
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'No google refresh token found for this email'
    })

    throw new Error('No google refresh token found for this email')
  }

  let thread: any = null
  try {
    thread = await findThread(log.subject!, log.to as any[], profile.google_refresh_token)
    if (!thread) {  
      throw new Error('Could not find thread')
    }
  } catch (err: any) {
    action = await appendToAction(action, {
      status: 'error',
      errorMessage: err.message || 'Could not find thread'
    })
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: err.message || 'Could not find thread'
    })
    throw new Error(err.message || 'Could not find thread')
  }

  try {
    if (action.type === 'send') {
      const sequence = await getSequenceFromLog(log)

      if (!sequence) {
        throw new Error('Could not find sequence')
      }

      const reply = await sendMail({
        from: `${sequence.name}@getreply.app`,
        to: (log.from as any).address,
        subject: `re: ${log.subject}`,
        textBody: action.generation as string,
      })
  
      action = await appendToAction(action, {
        threadId: thread.id,
        mailId: reply.id,
        status: 'sent',
      })
  
      log = await appendToLog(log, {
        status: 'complete',
      })
  
      return action
    }
  
    if (action.type === 'draft') {
      // TODO: add check for if email already received a reply

      const draft = await createGmailDraftInThread(
        log.to as any[],
        log.from as any,
        log.subject || '',
        action.generation!,
        thread.id,
        profile.google_refresh_token
      )
  
      if (draft.message!.id) {
        await makeUnreadInInbox(draft.message!.id, profile.google_refresh_token)
      }
  
      action = await appendToAction(action, {
        threadId: thread.id,
        mailId: draft.id,
        status: 'sent',
      })
      
      log = await appendToLog(log, {
        status: 'complete',
      })
  
      return action
    }
  
  } catch (err: any) {
    action = await appendToAction(action, {
      status: 'error',
      errorMessage: err.message || 'Could not send email'
    })
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: err.message || 'Could not send email'
    })
    throw new Error(err.message || 'Could not send email')
  }

  return action
}
