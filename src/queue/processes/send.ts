import appendToAction from "~/db-admin/append-to-action"
import getProfileFromEmail from "~/db-admin/get-profile-from-email"
import { Action, Profile } from "~/db-admin/types"
import { findThread } from "~/google"
import getActionById from "~/db-admin/get-action-by-id"
import getLogById from "~/db-admin/get-log-by-id"
import getPromptById from "~/db-admin/get-prompt-by-id"

import sendMail from "~/send-mail"

export default async function replyEvent(action_id: string){
  let action: Action | null = await getActionById(action_id)
  
  if (!action) {
    throw new Error(`Action ${action_id} not found`)
  }

  const prompt = await getPromptById(action.prompt_id!)

  if (!prompt) {
    throw new Error(`Prompt ${action.prompt_id} not found`)
  }

  let log = await getLogById(action.log_id!)

  if (!log) {
    throw new Error(`Log ${action.log_id} not found`)
  }

  action = await appendToAction(action, {
    status: 'generating'
  })

  action = await appendToAction(action, {
    status: 'sending'
  })

  if (!log.from) {
    throw new Error('No from address found in action')
  }

  const profile: Profile = await getProfileFromEmail(log.from.address)

  if (!profile.google_refresh_token) {
    action = await appendToAction(action, {
      status: 'error',
      errorMessage: 'No google refresh token found for this email'
    })
    return action
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
    return action
  }

  const reply = await sendMail({
    from: `reply@getreply.app`,
    to: log.from.address,
    subject: `re: ${log.subject}`,
    textBody: action.generation,
  })

  action = await appendToAction(action, {
    threadId: thread.id,
    mailId: reply.id,
    status: 'sent',
  })

  log = await appendToAction(log, {
    status: 'sent',
  })

  return action
}