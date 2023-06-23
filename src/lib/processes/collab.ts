import appendToAction from "~/lib/append-to-action"
import { Action } from "~/lib/types"
import sendMail from "~/lib/send-mail"
import appendToLog from "~/lib/append-to-log"
import { createDriveFile } from "~/lib/google"
import fetchAllPieces from "~/lib/fetch-all-pieces-from-action-id"

export default async function reply(action_id: string): Promise<Action>{
  let { action, log, sequence, profile } = await fetchAllPieces(action_id)
  let googleDocText = `
${action.generation as string}


__Preview email thread:__


${log.text as string}
  `

  const { webViewLink } = await createDriveFile({
    text: googleDocText,
    refresh_token: profile.refresh_token!,
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

  let to = [ ...[(log.from as any).address]]
  if (log.to) { to = [...to, ...[((log?.to as any).map((to: any) => to.address).filter((address: string) => !address.endsWith('getreply.app')))]]}
  if (log.cc) { to = [...to, ...[(log?.cc as any).map((to: any) => to.address).filter((address: string) => !address.endsWith('getreply.app'))]] }

  opts.to = to.join(', ')
  await sendMail(opts)

  action = await appendToAction(action, { status: 'sent' })
  log = await appendToLog(log, {status: 'complete' })

  return action    
}
