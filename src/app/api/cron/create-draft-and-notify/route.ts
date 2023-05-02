import { NextResponse } from "next/server"
import { createGmailDraftInThread, findThread, makeUnreadInInbox } from "~/providers/google"
import supabaseAdminClient, { appendToLog, getProfileFromEmail } from "~/supabase"
import { Log, Profile } from "~/types"

export const createDraftAndNotify = async (log: Log): Promise<Log> => {
  if (!log.from) {
    throw new Error('No from address found in log')
  }

  const profile: Profile = await getProfileFromEmail(log.from.address)

  if ((log.headers && log.headers.length > 0) && profile.google_refresh_token) {
    console.log('creating draft, id:', log.id)
    
    const thread = await findThread(log.subject!, log.to as any[], profile.google_refresh_token)

    if (!thread) {
      log = await appendToLog(log, {
        threadId: thread.id,
        status: 'error',
        errorMessage: 'Could not find thread in gmail'
      })
  
      console.log('could not find thread in gmail, id:', log.id)  
    } else {
      const draft = await createGmailDraftInThread(
        log.to as any[],
        log.from as any,
        log.subject || '',
        log.generations![0],
        thread.threadId!,
        profile.google_refresh_token
      )
      log = await appendToLog(log, {
        threadId: thread.id,
        status: 'drafted',
        draftId: draft.id
      })
      console.log('drafted email 1 in gmail, id:', log.id, 'draft id:', draft.id)  

      makeUnreadInInbox(draft)
      log = await appendToLog(log, {
        threadId: thread.id,
        status: 'ready-in-inbox'
      })
      console.log('ready in inbox, id:', log.id, 'draft id:', draft.id)  
    }
  }

  return log
}

export async function GET () {
  const { error, data: logs } = await supabaseAdminClient
    .from('logs')
    .select()
    .eq('status', 'generated')

  if (error) {
    return NextResponse.json({ error })
  }

  if (!logs || logs.length === 0) {
    return NextResponse.json({ result: `No logs to createDraftAndNotify` })
  }

  const processedLogs = await Promise.all(logs.map((log) => createDraftAndNotify(log as Log)))
  return NextResponse.json(processedLogs)
}
