import supabaseAdminClient from "~/db-admin/server-admin-client"
import { IncomingEmail, Log } from "~/db-admin/types"
import getSequenceByName from "./get-sequence-by-name"
import { render } from "@react-email/render"
import SequenceNotFound from "~/components/emails/sequence-not-found"
import sendMail from "~/lib/send-mail"

export default async function createLog (incomingEmail: IncomingEmail, sequenceName: string, throwOnExisting?: boolean) {

  if (throwOnExisting) {
    const { data: existingLogs, error: existingLogsError } = await supabaseAdminClient
      .from('logs')
      .select()
      .eq('messageId', incomingEmail.messageId)

    if (existingLogsError) {
      throw existingLogsError
    }

    if (existingLogs && existingLogs.length > 0) {
      throw new Error('Log already exists')
    }
  }

  const sequence = await getSequenceByName(sequenceName)

  if (!sequence) {
    const html = render(
      <SequenceNotFound
        sequenceName={sequenceName}
      />, {
        pretty: true,
      })
      
      let to = [ ...[(incomingEmail.from as any).address]]
      await sendMail({
        from: 'support@getreply.app',
        to: to.join(', '),
        subject: `re: ${incomingEmail.subject}`,
        html,
        messageId: incomingEmail.messageId,
      })
      throw new Error(`Sequence ${sequenceName} not found`)
  }

  const newLog: Log = {
    ...incomingEmail,
    status: 'pending',
    provider: 'unknown',
    errorMessage: null,
    sequence_id: sequence.id,
    threadId: null,
    action_ids: [],
  }

  const { error, data: newLogs } = await supabaseAdminClient
    .from('logs')
    .insert(newLog as any)
    .select()

  if (error) {
    console.error(error)
    throw error
  }

  if (!newLogs || newLogs.length === 0) {
    throw new Error('Could not create log')
  }

  return newLogs[0] as Log
}