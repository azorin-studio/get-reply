import appendToAction from "~/db-admin/append-to-action"
import getProfileFromEmail from "~/db-admin/get-profile-from-email"
import getSequenceFromLog from "~/db-admin/get-sequence-by-id"
import { Action, Profile } from "~/db-admin/types"
import getActionById from "~/db-admin/get-action-by-id"
import getLogById from "~/db-admin/get-log-by-id"
import getPromptById from "~/db-admin/get-prompt-by-id"

import sendMail from "~/send-mail"
import appendToLog from "~/db-admin/append-to-log"
import { createDriveFile } from "~/google"

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

  const sequence = await getSequenceFromLog(log)

  if (!sequence) {
    throw new Error('Could not find sequence')
  }

  let googleDocText = `
${action.generation as string}


__Preview email thread:__


${log.text as string}
  `

  const { webViewLink } = await createDriveFile({
    text: googleDocText,
    google_refresh_token: profile.google_refresh_token!,
  })

let text = `
We've generated a collaborate email environment for you at:

${webViewLink}
`
  const opts = {
    from: `${sequence.name}@getreply.app`,
    subject: `re: ${log.subject}`,
    textBody: text,
    messageId: log.messageId,
    to: ''
  }

  let to = [
    ...[(log.from as any).address],
  ]
  
  if (log.to) {
    to = [
      ...to,
      ...[((log?.to as any).map((to: any) => to.address).filter((address: string) => !address.endsWith('getreply.app')))]
    ]
  }

  if (log.cc) {
    to = [
      ...to,
      ...[(log?.cc as any).map((to: any) => to.address).filter((address: string) => !address.endsWith('getreply.app'))]
    ]
  }

  opts.to = to.join(', ')
  await sendMail(opts)

  action = await appendToAction(action, { status: 'sent' })
  log = await appendToLog(log, {status: 'complete' })

  return action    
}
