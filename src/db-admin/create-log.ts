import supabaseAdminClient from "~/db-admin/server-admin-client"
import { IncomingEmail, Log } from "~/db-admin/types"

export default async function createLog (incomingEmail: IncomingEmail) {
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

  // create new log
  const newLog: Log = {
    ...incomingEmail,
    status: 'pending',
    provider: 'unknown',
    errorMessage: null,
    sequence_id: null,
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