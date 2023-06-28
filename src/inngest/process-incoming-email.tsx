import createLog from "~/supabase/create-log"
import supabaseAdminClient from "~/supabase/supabase-admin-client"
import { IncomingEmail, Log } from "~/supabase/types"
import { inngest } from "./inngest"
import { render } from "@react-email/render"
import FollowUpConfirmation from "~/components/emails/followup-confirmation"
import sendMail from "~/lib/send-mail"
import getLogByKey from "~/supabase/get-log-by-key"

export const processIncomingEmail = async (incomingEmail: IncomingEmail) => {
  if (!incomingEmail.messageId) {
    throw new Error('No messageId')
  }
  
  const existingLog = await getLogByKey(supabaseAdminClient, 'messageId', incomingEmail.messageId)
  let log: Log | null 
  
  if (existingLog) {
    log = existingLog
    console.log(`Log ${log.id} already exists`)
  } else {
    log = await createLog(supabaseAdminClient, incomingEmail as IncomingEmail)
    console.log(`Log ${log.id} created`)
  }
  
  if (!log || !log.id || !log.sequence) {
    console.log(`Log ${log.id} not created`)
    throw new Error('Log not created')
  }

  await inngest.send({ 
    name: 'queue/create-actions',
    data: { log_id: log.id }
  })
  
  if (!existingLog) {
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
  }  
  return log
}
