import { IncomingEmail, Log } from "~/supabase/types"
import getSequenceByName from "./get-sequence-by-name"
import { render } from "@react-email/render"
import SequenceNotFound from "~/components/emails/sequence-not-found"
import sendMail from "~/lib/send-mail"
import parseSequenceName from "~/lib/parse-sequence-name"
import { SupabaseClient } from "@supabase/supabase-js"

export default async function createLog (client: SupabaseClient, incomingEmail: IncomingEmail, throwOnExisting?: boolean) {
  console.log(`Running process incoming email`)
  const { sequenceName, tags } = parseSequenceName({
    to: incomingEmail.to,
    cc: incomingEmail.cc,
    bcc: incomingEmail.bcc,
    headers: incomingEmail.headers
  })

  console.log(`Incoming email has sequence ${sequenceName} and tags ${tags}`)

  if (!sequenceName) {
    throw new Error('No sequence found')
  }

  if (throwOnExisting) {
    const { data: existingLogs, error: existingLogsError } = await client
      .from('logs')
      .select('*, sequence:sequences(*)')
      .eq('messageId', incomingEmail.messageId)

    if (existingLogsError) {
      throw existingLogsError
    }

    if (existingLogs && existingLogs.length > 0) {
      throw new Error('Log already exists')
    }
  }

  const sequence = await getSequenceByName(client, sequenceName)

  if (!sequence) {
    const html = render(
      <SequenceNotFound
        sequenceName={sequenceName}
      />, 
      { pretty: true }
    )
      
    let from = [ ...[(incomingEmail.from as any).address]]
    await sendMail({
      from: 'support@getreply.app',
      to: from.join(', '),
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
    tags,
    threadId: null,
    action_ids: [],
  }

  const { error, data: newLogs } = await client
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

  return {
    ...newLogs[0],
    sequence,
  } as Log
}