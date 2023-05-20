import appendToLog from "~/db/append-to-log"
import createLog from "~/db/create-log"
import getProfileFromEmail from "~/db/get-profile-from-email"
import { IncomingEmail, Log, Profile } from "~/db/types"

export default async function processEmail (incomingEmail: IncomingEmail): Promise<Log> {
  let log: Log | null = null
  try {
    log = await createLog(incomingEmail)
  } catch (err: any) {
    // console.log(incomingEmail)
    // console.error(err)
    throw err
  }

  if (!log.from) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'No from address found in log'
    })
    return log
  }

  const profile: Profile = await getProfileFromEmail(log.from.address)

  if (!profile) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'No profile found for this email'
    })
  }

  let provider = 'google'
  if (profile.google_refresh_token === null) {
    provider = 'getreply'
  }

  log = await appendToLog(log, {
    user_id: profile.id,
    provider,
  })

  return log  
}  