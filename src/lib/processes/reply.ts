import appendToAction from "~/lib/append-to-action"
import { Action } from "~/lib/types"
import sendMail from "~/lib/send-mail"
import appendToLog from "~/lib/append-to-log"
import fetchAllPiecesFromActionId from "~/lib/fetch-all-pieces-from-action-id"

export const introText = `Here is your reply from ChatGPT:`

export default async function reply(action_id: string): Promise<Action>{
  let { action, log, sequence } = await fetchAllPiecesFromActionId(action_id)

  let text = `${introText}\n\n${action.generation as string}`

  await sendMail({
    from: `${sequence.name}@getreply.app`,
    to: (log.from as any).address,
    subject: `re: ${log.subject}`,
    textBody: text,
    messageId: log.messageId
  })

  await appendToAction(action, { status: 'sent' })
  await appendToLog(log, {status: 'complete' })

  return action    
}
