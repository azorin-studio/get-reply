import { render } from "@react-email/render"

import FollowUpConfirmation from "~/components/emails/followup-confirmation"
import parsePromptNamesAndTags from "~/lib/parse-prompt-names-and-tags"
import { sendMail } from "~/lib/send-mail"
import { supabaseAdminClient } from "~/supabase/server-client"

import { getLogByKey } from "~/supabase/supabase"


export default async function sendConfirmationEmail (log_id: string) {
  const log = await getLogByKey(supabaseAdminClient, 'id', log_id)
  if (!log) {
    throw new Error(`[action: ${log_id}]: log not found.`)
  }
 
  const promptsAndTags = parsePromptNamesAndTags({
    to: log.to,
    cc: log.cc,
    bcc: log.bcc,
  })

  const to = promptsAndTags.map(({ promptName, tags }) => {
    return `${promptName}${tags.map(t => `+${t}`).join('')}@getreply.app`
  }).join(', ') 

  const html = render(
    <FollowUpConfirmation
      to={to}
      id={log.id}
    />
    , { pretty: true })

  await sendMail({
    from: `noreply@getreply.app`,
    to: (log.from as any).address,
    subject: `re: ${log.subject}`,
    html,
    messageId: log.messageId
  })
}