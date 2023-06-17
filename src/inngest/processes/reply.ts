import appendToAction from "~/db-admin/append-to-action"
import getProfileFromEmail from "~/db-admin/get-profile-from-email"
import getSequenceFromLog from "~/db-admin/get-sequence-by-id"
import { Action, Profile } from "~/db-admin/types"
import getActionById from "~/db-admin/get-action-by-id"
import getLogById from "~/db-admin/get-log-by-id"
import getPromptById from "~/db-admin/get-prompt-by-id"

import sendMail from "~/send-mail"
import appendToLog from "~/db-admin/append-to-log"

export default async function reply(action_id: string): Promise<Action>{
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

  if (!profile.refresh_token) {
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

  const sequence = await getSequenceFromLog(log)

  if (!sequence) {
    throw new Error('Could not find sequence')
  }
  
  let text = 
`
Follow up reminder from GetReply. If they have not replied yet send a follow up to:

${log.to?.map(t => t.address).join(', ')}
${log.cc ? `\n(cc: ${log.cc?.map(t => t.address).join(', ')})\n` : ''} 
Here an email draft to get you started:

${action.generation as string}`
  
  if (action.type === 'send') {
    text = 
`Here's your reply from ChatGPT:

${action.generation as string}`
  } 

  await sendMail({
    from: `${sequence.name}@getreply.app`,
    to: (log.from as any).address,
    subject: `re: ${log.subject}`,
    textBody: text,
    messageId: log.messageId
  })

  action = await appendToAction(action, { status: 'sent' })
  log = await appendToLog(log, {status: 'complete' })

  return action    
}
