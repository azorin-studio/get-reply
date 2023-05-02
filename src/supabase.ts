import { createClient } from '@supabase/supabase-js'
import { IncomingEmail, Log } from '~/types'
import { Database } from './database.types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

export const supabaseAdminClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY!, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export const getProfileFromEmail = async (email: string) => {
  const { data: profiles, error } = await supabaseAdminClient
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

export const createLog = async(incomingEmail: IncomingEmail) => {
  const newLog: Log = {
    ...incomingEmail,
    status: 'pending',
    created_at: (new Date()).toISOString(),
    provider: 'unknown',
    errorMessage: null,
    generations: null,
    draftId: null,
    prompts: null,
    threadId: null,
  }

  const { error, data: newLogs } = await supabaseAdminClient
    .from('logs')
    .insert(newLog as any)
    .select()

  if (error) {
    throw error
  }

  if (!newLogs || newLogs.length === 0) {
    throw new Error('Could not create log')
  }

  return newLogs[0] as Log
}

export const appendToLog = async(log: Log, newTerms: object) => {
  const { error, data: newLogs } = await supabaseAdminClient
    .from('logs')
    .update({ ...newTerms })
    .eq('id', log.id)
    .select()

  if (error) {
    throw error
  }

  return newLogs[0] as Log
}

export default supabaseAdminClient

export const getLogsByStatus = async (status: string) => {
  const { error, data: logs } = await supabaseAdminClient
    .from('logs')
    .select()
    .eq('status', status)

  if (error) {
    throw error
  }

  if (!logs) {
    throw new Error(`No logs with status ${status}`)
  }

  return logs as Log[]
}