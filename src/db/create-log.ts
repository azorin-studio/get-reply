import supabaseAdminClient from "~/db/server-admin-client"
import { IncomingEmail, Log } from "~/db/types"

export default async function createLog (incomingEmail: IncomingEmail) {
  // check if log already exists with message id
  const { data: existingLogs, error: existingLogsError } = await supabaseAdminClient
    .from('logs')
    .select()
    .eq('messageId', incomingEmail.messageId)

  if (existingLogsError) {
    console.error(existingLogsError)
    throw existingLogsError
  }

  if (existingLogs && existingLogs.length > 0) {
    console.log('log already exists:', existingLogs[0].id)
    return existingLogs[0] as Log
  } else {
    console.log('log does not exist creating new')
  }

  // create new log
  const newLog: Log = {
    ...incomingEmail,
    status: 'pending',
    provider: 'unknown',
    errorMessage: null,
    generations: null,
    draftIds: null,
    sequence_id: null,
    threadId: null
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

  console.log(`created [${newLogs.length} new] log(s):`, newLogs[0].id)
  return newLogs[0] as Log
}