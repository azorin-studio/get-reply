import { generateFollowUpEmails } from "~/lib/generate-follow-ups"
import { getProfileFromEmail, createLog, appendToLog } from "~/lib/supabase"
import { createGmailDraftAndNotify } from "~/lib/providers/google"
import { Contact, IncomingEmail, Log, Profile } from "~/types"

export const processEmail = async (incomingEmail: IncomingEmail) => {
  const { from } = incomingEmail
  const profile: Profile = await getProfileFromEmail(from.address)

  if (!profile) {
    throw new Error('No profile found')
  }

  let log: Log = await createLog(incomingEmail, profile)

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

  if (log.headers.length > 0) {
    const threadId = await createGmailDraftAndNotify(
      log.to as any as Contact[], 
      log.from as any as Contact, 
      log.subject, 
      log.followUpEmail1!, 
      profile.google_refresh_token!
    )

    log = await appendToLog(log, {
      threadId,
      status: 'drafted email 1'
    })
  }

  return log
}
