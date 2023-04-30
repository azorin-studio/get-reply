import { callGPT35Api } from "./chat-gpt"
import { getProfileFromEmail, createLog, appendToLog } from "~/supabase"
import { createGmailDraftInThread, findThread, makeUnreadInInbox } from "~/providers/google"
import { IncomingEmail, Log, Profile } from "~/types"
import supabaseAdminClient from "~/supabase"

export const processEmail = async (incomingEmail: IncomingEmail) => {
  const profile: Profile = await getProfileFromEmail(incomingEmail.from.address)

  if (!profile) {
    throw new Error('No profile found')
  }

  let log: Log | null = null
  try {
    log = await createLog(incomingEmail, profile)
    console.log('starting id:', log.id, 'from', (log.from as any).address)
  } catch (err: any) {
    console.error(err)
    throw err
  }

  if (!incomingEmail.text) {
    log = await appendToLog(log, {
      status: 'generated',
      errorMesaage: 'No text found in incoming email'
    })
    return log
  }

  let allToEmails: any[] = []
  if (incomingEmail.to) {
    allToEmails = [...allToEmails, ...incomingEmail.to.map((to) => to.address)]
  }
  if (incomingEmail.cc) {
    allToEmails = [...allToEmails, ...incomingEmail.cc.map((to) => to.address)]
  }
  if (incomingEmail.bcc) {
    allToEmails = [...allToEmails, ...incomingEmail.bcc.map((to) => to.address)]
  }

  const toGetReply = allToEmails.find((email) => email.endsWith('getreply.app'))

  if (!toGetReply) {
    if (!incomingEmail.text) {
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
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'Could not find sequence'
    })
    return log
  }

  const sequence = sequences[0]

  if (!sequence || !sequence.prompt_list || sequence.prompt_list.length === 0) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'Could not find sequence'
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
      const fullPrompt = (prompt.prompt! as string).replace('<your-email-here>', incomingEmail.text!)
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
