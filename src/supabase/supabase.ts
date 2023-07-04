import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { Database } from './database.types'
import { Log, Action, IncomingEmail, Profile, Prompt, Status } from "~/supabase/types"

export const supabaseAdminClient: SupabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_KEY!, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function appendToAction (client: SupabaseClient, action: Action, newTerms: object): Promise<Action> {
  const { error, data: newActions } = await client
    .from('actions')
    .update({ ...newTerms })
    .eq('id', action.id)
    .select('*, prompt:prompts(*), log:logs(*), profile:profile_id (*)')

  if (error) {
    throw error
  }

  return newActions[0] as Action
}

export async function appendToLog (client: SupabaseClient, log: Log, newTerms: object): Promise<Log> {
  const { error, data: newLogs } = await client
    .from('logs')
    .update({ ...newTerms })
    .eq('id', log.id)
    .select()

  if (error) {
    throw error
  }

  return (newLogs[0] as any) as Log
}


export async function cancelLogAndActionByLogId(client: SupabaseClient, id: string) {
  await client
    .from('logs')
    .update({ status: 'cancelled' })
    .eq('id', id)

  const log = await getLogById(client, id)
  if (!log) throw new Error(`No log found with id ${id}`)

  const actions = await getActionsByLogId(client, id)
  if (!actions) throw new Error(`No actions found with log id ${id}`)

  await Promise.all(
    actions.map(async (action) => 
      client
        .from('actions')
        .update({ status: 'cancelled' })
        .eq('id', action.id)
    )
  )
}

export async function createLog (client: SupabaseClient, incomingEmail: IncomingEmail) {
  if (!incomingEmail.messageId) throw new Error('No messageId')
  const { data: existingLogs, error: existingLogsError } = await client
    .from('logs')
    .select('*')
    .eq('messageId', incomingEmail.messageId)

  if (existingLogsError) throw existingLogsError
  if (existingLogs && existingLogs.length > 0) throw new Error('Log already exists')
  const profile: Profile = await getProfileFromEmail(client, (incomingEmail.from as any).address)
  const { error, data: newLogs } = await client
    .from('logs')
    .insert({
      ...incomingEmail,
      status: 'process-incoming-email' as Status,
      errorMessage: null,
      profile_id: profile.id
    })
    .select()

  if (error) throw error
  if (!newLogs || newLogs.length === 0) throw new Error('Could not create log')
  return newLogs[0] as Log
}


export async function deleteLogById (client: SupabaseClient, id: string): Promise<void> {
  const { error, data: logs } = await client
    .from('logs')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}


export async function getActionsByLogId (client: SupabaseClient, id: string): Promise<Action[]> {
  const { error, data: actions } = await client
    .from('actions')
    .select('*, prompt:prompts(*), log:logs(*), profile:profile_id (*)')
    .eq('log_id', id)

  if (error) {
    throw error
  }

  if (!actions || actions.length === 0) {
    return []
  }

  return actions
}


export async function getActionById (client: SupabaseClient, id: string): Promise<Action | null> {
  const { error, data: actions } = await client
    .from('actions')
    .select('*, prompt:prompts(*), log:logs(*), profile:profile_id (*)')
    .eq('id', id)

  if (error) {
    throw error
  }

  if (!actions || actions.length === 0) {
    return null
  }

  return actions[0] as Action
}


export async function getLogById (client: SupabaseClient, id: string): Promise<Log | null> {
  const { error, data: logs } = await client
    .from('logs')
    .select('*, profile:profile_id (*)')

    .eq('id', id)

  if (error) {
    throw error
  }

  if (!logs || logs.length === 0) {
    return null
  }

  const log = logs[0]
  return log
}


export async function getLogByKey (client: SupabaseClient, key: string, value: string): Promise<Log | null | undefined> {
  const { error, data: logs } = await client
    .from('logs')
    .select('*, profile:profile_id (*)')
    .eq(key, value)

  if (error) {
    throw error
  }

  if (!logs || logs.length === 0) {
    return null
  }

  const log = logs[0]
  return log
}


export async function getLogsByStatus (client: SupabaseClient, status: string) {
  const { error, data: logs } = await client
    .from('logs')
    .select('*, profile:profile_id (*)')
    .eq('status', status)

  if (error) {
    throw error
  }

  if (!logs) {
    throw new Error(`No logs with status ${status}`)
  }

  return logs as Log[]
}


export async function getProfileFromEmail (client: SupabaseClient, email: string) {
  const { data: profiles, error } = await client
    .from('profiles')
    .select("*")
    .eq('email', email)
    .limit(1)

  if(error) {
    throw error
  }

  if (!profiles || profiles.length === 0) {
    throw new Error(`No profile found for email ${email}`)
  }
  
  return profiles[0]
} 


export async function getPromptById (client: SupabaseClient, id: string) {
  const { error, data: prompts } = await client
    .from('prompts')
    .select('*, profile:profile_id (*)')
    .eq('id', id)

  if (error) {
    throw error
  }

  if (!prompts || prompts.length === 0) {
    return null
  }

  const prompt = prompts[0]
  return prompt
}



export async function getPromptByName(client: SupabaseClient, promptName: string, passedSupabase?: any) {
  let supabase = client
  if (passedSupabase) {
    supabase = passedSupabase
  }

  const { error, data: prompts } = await supabase
    .from('prompts')
    .select('*, profile:profile_id (*)')
    .eq('name', promptName)

  if (error) {
    throw error
  }

  if (!prompts || prompts.length === 0) {
    return null
  }

  const prompt = prompts[0]
  return prompt as Prompt
}

export async function getPrompts (client: SupabaseClient) {
  const { data: prompts, error } = await client
    .from('prompts')
    .select('*, profile:profile_id (*)')
    .order('id', { ascending: true })
    .limit(10)

  if (error) throw error
  if (!prompts) return null

  return prompts
}
