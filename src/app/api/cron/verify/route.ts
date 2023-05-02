import { NextResponse } from "next/server"
import supabaseAdminClient, { appendToLog, getProfileFromEmail } from "~/supabase"
import { Log, Profile } from "~/types"

export const verify = async (log: Log): Promise<Log> => {
  // TODO check dmarc and stuff
  if (!log.text) {
    console.log('No text found in incoming email')
    log = await appendToLog(log, {
      status: 'error',
      errorMesaage: 'No text found in incoming email'
    })
    return log
  }

  let allToEmails: any[] = []
  if (log.to) {
    allToEmails = [...allToEmails, ...log.to.map((to) => to.address)]
  }
  if (log.cc) {
    allToEmails = [...allToEmails, ...log.cc.map((to) => to.address)]
  }
  if (log.bcc) {
    allToEmails = [...allToEmails, ...log.bcc.map((to) => to.address)]
  }

  const toGetReply = allToEmails.find((email) => email.endsWith('getreply.app'))

  if (!toGetReply) {
    if (!log.text) {
      console.log('No to: getreply.app address found in incoming email')
      log = await appendToLog(log, {
        status: 'generated',
        errorMesaage: 'No to: getreply.app address found in incoming email'
      })
      return log
    }  
  }

  const { error, data: sequences } = await supabaseAdminClient
    .from('sequences')
    .select()
    .eq('name', toGetReply?.split('@')[0])

  if (error || !sequences || sequences.length === 0) {
    console.log('Could not find sequence for this address')
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'Could not find sequence for this address'
    })
    return log
  }

  const sequence = sequences[0]

  if (!sequence || !sequence.prompt_list || sequence.prompt_list.length === 0) {
    console.log('Could not find sequence')
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'Could not find sequence'
    })
    return log
  }

  console.log('Verified', sequence)
  log = await appendToLog(log, {
    status: 'verified'
  })

  return log
}

export async function GET () {
  const { error, data: logs } = await supabaseAdminClient
    .from('logs')
    .select()
    .eq('status', 'pending')

  if (error) {
    return NextResponse.json({ error })
  }

  if (!logs || logs.length === 0) {
    console.log('No logs to verify')
    return NextResponse.json({ result: `No logs to verify` })
  }

  console.log(`Verifying ${logs.length} logs`)
  const processedLogs = await Promise.all(logs.map((log) => verify(log as Log)))
  return NextResponse.json(processedLogs)
}
