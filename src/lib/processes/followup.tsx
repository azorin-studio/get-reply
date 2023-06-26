import appendToAction from "~/lib/append-to-action"
import { Action } from "~/lib/types"
import sendMail from "~/lib/send-mail"
import appendToLog from "~/lib/append-to-log"
import fetchAllPiecesFromActionId from "~/lib/fetch-all-pieces-from-action-id"
import { render } from "@react-email/render"
import FollowUpReminder from "~/components/emails/followup-reminder"


export default async function followup(action_id: string): Promise<Action>{
  let { action, log, sequence, prompt } = await fetchAllPiecesFromActionId(action_id)

  const to=  log.to?.filter(t => !t.address.endsWith('@getreply.app')).map(t => t.address).join(', ')
  const cc = log.cc?.filter(t => !t.address.endsWith('@getreply.app')).map(t => t.address).join(', ')
  const body = action.generation as string
  const promptId= prompt.id as string

  const html = render(
    <FollowUpReminder 
      to={to}
      cc={cc}
      subject={log.subject as string}
      body={body}
      promptId={promptId}
    />
    , { pretty: true })
      
  await sendMail({
    from: `${sequence.name}@getreply.app`,
    to: (log.from as any).address,
    subject: `re: ${log.subject}`,
    html,
    messageId: log.messageId
  })

  action = await appendToAction(action, { status: 'sent' })
  log = await appendToLog(log, {status: 'complete' })

  return action    
}
