import { IncomingEmail, Log, Profile } from "~/supabase/types"
import { SupabaseClient } from "@supabase/supabase-js"
import getProfileFromEmail from "./get-profile-from-email"

export default async function createLog (client: SupabaseClient, incomingEmail: IncomingEmail) {
  console.log(`Running create log`)

  if (!incomingEmail.messageId) {
    throw new Error('No messageId')
  }

  const { data: existingLogs, error: existingLogsError } = await client
    .from('logs')
    .select('*')
    .eq('messageId', incomingEmail.messageId)

  if (existingLogsError) {
    throw existingLogsError
  }

  if (existingLogs && existingLogs.length > 0) {
    throw new Error('Log already exists')
  }

  const profile: Profile = await getProfileFromEmail(client, (incomingEmail.from as any).address)
  const { error, data: newLogs } = await client
    .from('logs')
    .insert({
      ...incomingEmail,
      status: 'pending',
      errorMessage: null,
      profile_id: profile.id
    })
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