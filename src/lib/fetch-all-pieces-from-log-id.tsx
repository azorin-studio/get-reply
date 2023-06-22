import getProfileFromEmail from "~/db-admin/get-profile-from-email"
import { Log, Profile, Sequence } from "~/db-admin/types"
import getLogById from "~/db-admin/get-log-by-id"
import appendToLog from "~/db-admin/append-to-log"

export default async function fetchAllPiecesFromLogId(log_id: string): Promise<{ 
  log: Log,
  profile: Profile,
  sequence: Sequence
}>{
  let log = await getLogById(log_id!)

  if (!log) {
    throw new Error(`Log ${log_id} not found`)
  }

  const profile: Profile = await getProfileFromEmail((log.from as any).address)

  if (!profile.refresh_token) {
    log = await appendToLog(log, {
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
