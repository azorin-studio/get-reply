import getProfileFromEmail from "~/supabase/get-profile-from-email"
import { Log, Profile, Sequence } from "~/supabase/types"
import getLogById from "~/supabase/get-log-by-id"
import appendToLog from "~/supabase/append-to-log"
import { SupabaseClient } from "@supabase/supabase-js"

export default async function fetchAllPiecesFromLogId(client: SupabaseClient, log_id: string): Promise<{ 
  log: Log,
  profile: Profile,
  sequence: Sequence
}>{
  let log = await getLogById(client, log_id!)

  if (!log) {
    throw new Error(`Log ${log_id} not found`)
  }

  const profile: Profile = await getProfileFromEmail(client, (log.from as any).address)

  if (!profile.refresh_token) {
    log = await appendToLog(client, log, {
      status: 'error',
      errorMessage: 'No google refresh token found for this email'
    })

    throw new Error('No google refresh token found for this email')
  }

  return {
    log,
    profile,
    sequence: log.sequence!
  }
}
