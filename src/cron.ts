import { callGPT35Api } from "./chat-gpt"
import { createGmailDraftInThread, findThread, makeUnreadInInbox } from "./google"
import supabaseAdminClient, { appendToLog, createLog, getLogsByStatus, getProfileFromEmail } from "./supabase"
import { IncomingEmail, Log, Profile } from "./types"

export const daysBetween = (first: Date, second: Date): number => {
  return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))
}

export const getSequenceName = (log: Log) => {
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
    return null
  }

  return toGetReply.split('@')[0]
}

export const getSequenceFromLog = async (log: Log) => {
  const toGetReply = getSequenceName(log)

  const { error, data: sequences } = await supabaseAdminClient
    .from('sequences')
    .select()
    .eq('name', toGetReply)

  if (error || !sequences || sequences.length === 0) {
    return null
  }

  const sequence = sequences[0]
  return sequence
}

export const generate = async (log: Log): Promise<Log> => {
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

  const sequence = await getSequenceFromLog(log)

  if (!sequence || !sequence.prompt_list || sequence.prompt_list.length === 0) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: `No prompt list on sequence`
    })
    return log
  }

  try {
    const generations = await Promise.all(sequence.prompt_list.map(async (item: any) => {
      const prompt_id = item.prompt_id
      const { error, data: prompts } = await supabaseAdminClient
        .from('prompts')
        .select()
        .eq('id', prompt_id)
        .limit(1)
  
      if (error) {
        throw error
      }
  
      if (!prompts || prompts.length === 0) {
        throw new Error(`Could not find prompt ${prompt_id}`)
      }

      const prompt = prompts[0]
      const fullPrompt = (prompt.prompt! as string).replace('<your-email-here>', log.text!)
      const generation: string = await callGPT35Api(fullPrompt, 3)
  
      return {
        prompt: prompt.prompt,
        generation
      }
    }))

    log = await appendToLog(log, {
      generations: generations.map(({ generation }) => generation),
      prompts: generations.map(({ prompt }) => prompt),
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

  log = await appendToLog(log, {
    status: 'generated'
  })

  return log
}

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

  const sequence = getSequenceFromLog(log)
  
  if (!sequence || !sequence.prompt_list || sequence.prompt_list.length === 0) {
    console.log('Could not find sequence')
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'Could not find sequence'
    })
    return log
  }

  log = await appendToLog(log, {
    status: 'verified'
  })

  return log
}

export const createDraftAndNotify = async (log: Log): Promise<Log> => {
  if (!log.from) {
    throw new Error('No from address found in log')
  }

  const sequence = getSequenceFromLog(log)
  if (!sequence) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'Could not find sequence for this address'
    })
    return log
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

      await makeUnreadInInbox(draft)
      log = await appendToLog(log, {
        threadId: thread.id,
        status: 'ready-in-inbox'
      })
      console.log('ready in inbox, id:', log.id, 'draft id:', draft.id)  
    }
  }

  return log
}

export const processEmail = async (incomingEmail: IncomingEmail): Promise<Log> => {
  let log: Log | null = null
  try {
    log = await createLog(incomingEmail)
    console.log('starting id:', log.id, 'from', (log.from as any).address)
  } catch (err: any) {
    console.error(err)
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
    status: 'pending',
    user_id: profile.id,
    provider,
  })

  return log  
}  

export const handleProcessEmailEvent = async (incomingEmail: IncomingEmail): Promise<Log> => {
  console.log('process: handling process email event')
  const log = await processEmail(incomingEmail)
  console.log('process: processed email', log.id)
  return log
}  

export const handleVerifyEvent = async () => {
  console.log('verify: handling verify event')
  const logs = await getLogsByStatus('pending')
  console.log('verify: found logs', logs.length)
  const processedLogs = await Promise.all(logs.map((log) => verify(log as Log)))
  console.log('verify: processed logs', processedLogs.length)
  return processedLogs
}

export const handleGenerateEvent = async () => {
  console.log('generate: handling generate event')
  const logs = await getLogsByStatus('verified')
  console.log('generate: found logs', logs.length)
  const processedLogs = await Promise.all(logs.map((log) => generate(log as Log)))
  console.log('generate: processed logs', processedLogs.length)
  return processedLogs
}

export const handleCreateDraftEvent = async () => {
  console.log('create-draft: handling create-draft event')
  const logs = await getLogsByStatus('generated')
  console.log('create-draft: found logs', logs.length)
  const processedLogs = await Promise.all(logs.map((log) => createDraftAndNotify(log as Log)))
  console.log('create-draft: processed logs', processedLogs.length)
  return processedLogs
}