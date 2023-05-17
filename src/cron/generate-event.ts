import { callGPT35Api } from "~/chat-gpt"
import appendToLog from "~/db/append-to-log"
import getProfileFromEmail from "~/db/get-profile-from-email"
import getSequenceFromLog from "~/db/get-sequence-by-id"
import supabaseAdminClient from "~/db/server-admin-client"
import { Log, Profile } from "~/db/types"

export default async function generate (log: Log): Promise<Log> {
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

  if (!sequence || !sequence.steps || sequence.steps.length === 0) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: `No prompt list on sequence`
    })
    return log
  }

  try {
    const generations = await Promise.all(sequence.steps.map(async (item: any) => {
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
      const fullPrompt = (prompt.prompt! as string).replace('{email}', log.text!)
      const generation: string = await callGPT35Api(fullPrompt, 3)
  
      return {
        prompt: prompt.prompt,
        generation
      }
    }))

    log = await appendToLog(log, {
      generations: generations.map(({ generation }) => generation),
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
