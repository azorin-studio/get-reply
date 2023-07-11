import { render } from "@react-email/render"

import PromptNotFound from "~/components/emails/prompt-not-found"
import { sendMail } from "~/lib/send-mail"
import { supabaseAdminClient } from "~/supabase/server-client"

import { getLogByKey } from "~/supabase/supabase"

export default async function sendNotFoundEmail (log_id: string, notFoundEmails: string[]) {
  const log = await getLogByKey(supabaseAdminClient, 'id', log_id)
  if (!log) throw new Error(`[action: ${log_id}]: log not found.`)

  const html = render(
    <PromptNotFound
      notFoundEmails={notFoundEmails}
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