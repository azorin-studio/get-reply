import supabaseAdminClient from "~/db/server-admin-client"
import { IncomingEmail, Log } from "~/db/types"

export default async function createLog (incomingEmail: IncomingEmail) {
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

  console.log(error, newLogs)
  if (error) {
    console.error(error)
    throw error
  }

  if (!newLogs || newLogs.length === 0) {
    throw new Error('Could not create log')
  }

  return newLogs[0] as Log
}