import createLog from "~/supabase/create-log"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import { IncomingEmail, Log } from "~/supabase/types"
import { inngest } from "./inngest"
import { render } from "@react-email/render"
import FollowUpConfirmation from "~/components/emails/followup-confirmation"
import sendMail from "~/lib/send-mail"
import fetchAllPiecesFromLogId from "~/supabase/fetch-all-pieces-from-log-id"

export const processIncomingEmail = async (incomingEmail: IncomingEmail) => {
  const log: Log | null = await createLog(supabaseAdminClient, incomingEmail as IncomingEmail)
  
  if (!log || !log.id || !log.sequence) {
    throw new Error('Log not created')
  }

  await inngest.send({ 
    id: `queue/create-actions-${log.id}`,
    name: 'queue/create-actions',
    data: { log_id: log.id }
  })
  
  // send email with confirmation
  const to = log.to?.filter(t => !t.address.endsWith('@getreply.app')).map(t => t.address).join(', ')
  const html = render(
    <FollowUpConfirmation
      to={to}
      id={log.id}
    />
    , { pretty: true })

  await sendMail({
    from: `${log.sequence.name}@getreply.app`,
    to: (log.from as any).address,
    subject: `re: ${log.subject}`,
    html,
    messageId: log.messageId
  })
  
  return log
}
