import { SupabaseClient } from '@supabase/supabase-js'
import { Log, Action, IncomingEmail, Profile, Prompt, Status } from "~/supabase/types"

export async function createLog (client: SupabaseClient, incomingEmail: IncomingEmail): Promise<Log | null> {
  if (!incomingEmail.messageId) throw new Error('No messageId')
  if (!incomingEmail.text) throw new Error('No text found in incoming email')
  const { data: existingLogs, error: existingLogsError } = await client
    .from('logs')
    .select('*')
    .eq('messageId', incomingEmail.messageId)
  if (existingLogsError) throw new Error('Existing log check failed with error')
  if (existingLogs && existingLogs.length > 0) return null

  const profile: Profile = await getProfileByKey(client, 'email', (incomingEmail.from as any).address)
  const { error, data: newLogs } = await client
    .from('logs')
    .insert({
      ...incomingEmail,
      status: 'received' as Status,
      errorMessage: null,
      profile_id: profile.id
    })
    .select('*, profile:profile_id (*)')

  if (error) throw error
  if (!newLogs || newLogs.length === 0) throw new Error('Could not create log')
  return newLogs[0] as Log
}

export async function deleteLogById (client: SupabaseClient, id: string): Promise<void> {
  const { error, data } = await client
    .from('logs')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getLogsByKey (client: SupabaseClient, key: string, value: string): Promise<Log[]> {
  const { error, data: logs } = await client
    .from('logs')
    .select('*, profile:profile_id (*)')
    .eq(key, value)

  if (error) throw error
  if (!logs || logs.length === 0) return []
  return logs
}

export async function getLogByKey (client: SupabaseClient, key: string, value: string): Promise<Log | null> {
  const { error, data: logs } = await client
    .from('logs')
    .select('*, profile:profile_id (*)')
    .eq(key, value)
  if (error) throw error
  if (!logs || logs.length === 0) return null
  return logs[0] as Log
}

export async function appendToLog (client: SupabaseClient, log_id: string, newTerms: object): Promise<Log> {
  const { error, data: newLogs } = await client
    .from('logs')
    .update({ ...newTerms })
    .eq('id', log_id)
    .select()

  if (error) throw error
  return (newLogs[0] as any) as Log
}

interface ICreateAction {
  profile_id: string
  log_id: string
  prompt_id: string
  run_date: string
  delay: number
  delay_unit: string
}

export async function createAction (client: SupabaseClient, createActionArgs: ICreateAction): Promise<Action> {
  const { error, data: actions } = await client
    .from('actions')
    .insert({
      status: 'sleeping',
      profile_id: createActionArgs.profile_id,
      log_id: createActionArgs.log_id,
      prompt_id: createActionArgs.prompt_id,
      run_date: createActionArgs.run_date,
      delay: createActionArgs.delay,
      delay_unit: createActionArgs.delay_unit,
    })
    .select('*, prompt:prompts(*), log:logs(*), profile:profile_id (*)')
    .limit(1)

  if (error) throw error
  if (!actions || actions.length === 0) throw new Error('Could not create action')      
  const action = actions[0]
  return action
}

export async function getActionsByKey (client: SupabaseClient, key: string, value: string): Promise<Action[]> {
  const { error, data: actions } = await client
    .from('actions')
    .select('*, prompt:prompts(*), log:logs(*), profile:profile_id (*)')
    .eq(key, value)

  if (error) throw error
  if (!actions || actions.length === 0) return []
  return actions
}

export async function getActionByKey (client: SupabaseClient, key: string, value: string): Promise<Action | null> {
  const { error, data: actions } = await client
    .from('actions')
    .select('*, prompt:prompts(*), log:logs(*), profile:profile_id (*)')
    .eq(key, value)
  if (error) throw error
  if (!actions || actions.length === 0) return null
  return actions[0] as Action
}

export async function appendToAction (client: SupabaseClient, action_id: string, newTerms: object): Promise<Action> {
  const { error, data: newActions } = await client
    .from('actions')
    .update({ ...newTerms })
    .eq('id', action_id)
    .select('*, prompt:prompts(*), log:logs(*), profile:profile_id (*)')

  if (error) throw error
  return newActions[0] as Action
}

export async function cancelLogAndActionByLogId(client: SupabaseClient, id: string): Promise<{ action: Action, log: Log }> {
  await client
    .from('logs')
    .update({ status: 'cancelled' })
    .eq('id', id)

  const log = await getLogByKey(client, 'id', id)
  if (!log) throw new Error(`No log found with id ${id}`)

  const actions = await getActionsByKey(client, 'log_id', id)
  if (!actions) throw new Error(`No actions found with log id ${id}`)

  await Promise.all(
    actions.map(async (action) => 
      client
        .from('actions')
        .update({ status: 'cancelled' })
        .eq('id', action.id)
    )
  )

  return { action: actions[0], log }
}

export async function getProfileByKey (client: SupabaseClient, key: string, value: string): Promise<Profile> {
  const { data: profiles, error } = await client
    .from('profiles')
    .select("*")
    .eq(key, value)
    .limit(1)

  if(error) throw error
  if (!profiles || profiles.length === 0) throw new Error(`No profile found for ${key} ${value}`)
  return profiles[0]
} 

export async function getPromptByKey (client: SupabaseClient, key: string, value: string): Promise<Prompt | null> {
  const { error, data: prompts } = await client
    .from('prompts')
    .select('*, profile:profile_id (*)')
    .eq(key, value)

  if (error) throw error
  if (!prompts || prompts.length === 0) return null
  const prompt = prompts[0]
  return prompt
}
