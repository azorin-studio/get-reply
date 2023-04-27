import { generateFollowUps } from "./chat-gpt"
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

  if (!incomingEmail.text) {
    throw new Error('No text found')
  } 

  try {
    const { 
      followUpEmail1, 
      followUpEmail2, 
      prompt 
    } = await generateFollowUps(incomingEmail.text, profile.user_constraints, 3)

    log = await appendToLog(log, {
      followUpEmail1,
      followUpEmail2,
      prompt,
      status: 'generated'
    })

    console.log('generated id:', log.id)
  } catch (err: any) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'ChatGTP failed to generate follow up emails'
    })
  
    throw err
  }

  if ((log.headers && log.headers.length > 0) && profile.google_refresh_token) {
    console.log('creating draft, id:', log.id)
    const threadId = await createGmailDraftAndNotify(
      log.to as any[], 
      log.from as any, 
      log.subject || '',
      log.followUpEmail1!, 
      profile.google_refresh_token!
    )

    if (threadId) {
      log = await appendToLog(log, {
        threadId,
        status: 'drafted'
      })
  
      console.log('drafted email 1 in gmail, id:', log.id)  
    } else {
      log = await appendToLog(log, {
        threadId,
        status: 'error',
        errorMessage: 'Could not find thread in gmail'
      })
  
      console.log('could not find thread in gmail, id:', log.id)  
    }
  }

  return log
}
