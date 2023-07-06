import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { Database } from './database.types'
import { Log, Action, IncomingEmail, Profile, Prompt, Status } from "~/supabase/types"

export async function createLog (client: SupabaseClient, incomingEmail: IncomingEmail): Promise<Log | null> {
  if (!incomingEmail.messageId) throw new Error('No messageId')
  const { data: existingLogs, error: existingLogsError } = await client
    .from('logs')
    .select('*')
    .eq('messageId', incomingEmail.messageId)
  if (existingLogsError) throw new Error('Existing log check failed with error')
  if (existingLogs && existingLogs.length > 0) return null

  const profile: Profile = await getProfileByEmail(client, (incomingEmail.from as any).address)

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
  const { error, data } = await client
    .from('logs')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function appendToLog (client: SupabaseClient, log: Log, newTerms: object): Promise<Log> {
  const { error, data: newLogs } = await client
    .from('logs')
    .update({ ...newTerms })
    .eq('id', log.id)
    .select()

  if (error) throw error
  return (newLogs[0] as any) as Log
}

export async function appendToAction (client: SupabaseClient, action: Action, newTerms: object): Promise<Action> {
  const { error, data: newActions } = await client
    .from('actions')
    .update({ ...newTerms })
    .eq('id', action.id)
    .select('*, prompt:prompts(*), log:logs(*), profile:profile_id (*)')

  if (error) throw error
  return newActions[0] as Action
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
  console.log('gak1')
  const { error, data: actions } = await client
    .from('actions')
    .select('*, prompt:prompts(*), log:logs(*), profile:profile_id (*)')
    .eq(key, value)
  console.log('gak2')
  if (error) throw error
  console.log('gak3')
  if (!actions || actions.length === 0) return null
  console.log('gak4')
  return actions[0] as Action
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

export async function getActionsByLogId (client: SupabaseClient, id: string): Promise<Action[]> {
  return getActionsByKey(client, 'log_id', id)
}

export async function getActionById (client: SupabaseClient, id: string): Promise<Action | null> {
  return getActionByKey(client, 'id', id)
}

export async function getLogById (client: SupabaseClient, id: string): Promise<Log | null> {
  return getLogByKey(client, 'id', id)
}

export async function getLogsByStatus (client: SupabaseClient, status: string): Promise<Log[]> {
  return getLogsByKey(client, 'status', status)
}

export async function getProfileByEmail (client: SupabaseClient, email: string): Promise<Profile> {
  const { data: profiles, error } = await client
    .from('profiles')
    .select("*")
    .eq('email', email)
    .limit(1)

  if(error) throw error
  if (!profiles || profiles.length === 0) throw new Error(`No profile found for email ${email}`)
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

export async function getPromptById (client: SupabaseClient, id: string): Promise<Prompt | null> {
  return getPromptByKey(client, 'id', id)
}

export async function getPromptByName (client: SupabaseClient, name: string): Promise<Prompt | null> {
  return getPromptByKey(client, 'name', name)
}

export async function getPrompts (client: SupabaseClient): Promise<Prompt[]> {
  const { data: prompts, error } = await client
    .from('prompts')
    .select('*, profile:profile_id (*)')
    .order('id', { ascending: true })
    .limit(10)

  if (error) throw error
  if (!prompts) return []

  return prompts
}

export async function cancelLogAndActionByLogId(client: SupabaseClient, id: string): Promise<void> {
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

