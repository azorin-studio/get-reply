import { createClient } from '@supabase/supabase-js'
import { IncomingEmail, Log, Profile } from '~/types'
import { Database } from './database.types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

const supabaseAdminClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY!, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)


const supabaseClient = createClient<Database>(
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

export const createLog = async(incomingEmail: IncomingEmail, profile: Profile) => {
  const { error, data: newLogs } = await supabaseAdminClient
    .from('logs')
    .insert({
      ...incomingEmail,
      user_id: profile.id,
      status: 'pending',
      created_at: (new Date()).toISOString(),
      error_message: null,
      followUpEmail1: null,
      followUpEmail2: null,
      prompt: null,
      threadId: null,
    } as Log)
    .select()

  if (error) {
    throw error
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

