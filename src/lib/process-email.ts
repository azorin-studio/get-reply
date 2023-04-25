import { generateFollowUpEmails } from "~/lib/generate-follow-ups"
import { getProfileFromEmail, createLog, appendToLog } from "~/lib/supabase"
import { createGmailDraftAndNotify } from "~/lib/providers/google"
import { IncomingEmail, Log, Profile } from "~/types"

export const processEmail = async (incomingEmail: IncomingEmail) => {
  const profile: Profile = await getProfileFromEmail(incomingEmail.from.address)

  if (!profile) {
    throw new Error('No profile found')
  }

  let log: Log = await createLog(incomingEmail, profile)
  console.log('starting id:', log.id, 'from', (log.from as any).address)

  const { 
    followUpEmail1, 
    followUpEmail2, 
    prompt 
  } = await generateFollowUpEmails(incomingEmail.text, profile.userConstraints, 3)

  log = await appendToLog(log, {
    followUpEmail1,
    followUpEmail2,
    prompt,
    status: 'generated'
  })
  console.log('generated id:', log.id)

  if (log.headers.length > 0 && profile.google_refresh_token) {
    console.log('creating draft, id:', log.id)
    const threadId = await createGmailDraftAndNotify(
      log.to as any[], 
      log.from as any, 
      log.subject, 
      log.followUpEmail1!, 
      profile.google_refresh_token!
    )

    log = await appendToLog(log, {
      threadId,
      status: 'drafted email 1 in gmail'
    })
    console.log('drafted email 1 in gmail, id:', log.id)
  }

  return log
}
