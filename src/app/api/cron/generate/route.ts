import { NextResponse } from "next/server"
import { callGPT35Api } from "~/chat-gpt"
import supabaseAdminClient, { appendToLog, getProfileFromEmail } from "~/supabase"
import { Log, Profile } from "~/types"

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
      errorMessage: 'Could not find sequence for this address'
    })
    return log
  }

  const sequence = sequences[0]

  if (!sequence || !sequence.prompt_list || sequence.prompt_list.length === 0) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: `No prompt list on sequence: ${sequence.id}`
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

export async function GET () {
  const { error, data: logs } = await supabaseAdminClient
    .from('logs')
    .select()
    .eq('status', 'verified')

  if (error) {
    return NextResponse.json({ error })
  }

  if (!logs || logs.length === 0) {
    return NextResponse.json({ result: `No logs to generate` })
  }

  const processedLogs = await Promise.all(logs.map((log) => generate(log as Log)))
  return NextResponse.json(processedLogs)
}
