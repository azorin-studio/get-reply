import appendToAction from "~/lib/append-to-action"
import { Action } from "~/lib/types"
import sendMail from "~/lib/send-mail"
import appendToLog from "~/lib/append-to-log"
import fetchAllPiecesFromActionId from "~/lib/fetch-all-pieces-from-action-id"

export const introText = `This is a follow up reminder from GetReply. If they have not replied yet send a follow up to:`

export default async function followup(action_id: string): Promise<Action>{
  let { action, log, sequence } = await fetchAllPiecesFromActionId(action_id)

  const text = `${introText}\n\n${log.to?.map(t => t.address).join(', ')}\n${log.cc ? `(cc: ${log.cc?.map(t => t.address).join(', ')})` : ''}\nHere is an email draft to get you started:\n\n${action.generation as string}`
  
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
