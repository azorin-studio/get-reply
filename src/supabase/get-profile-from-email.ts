import { SupabaseClient } from "@supabase/supabase-js"

export default async function getProfileFromEmail (client: SupabaseClient, email: string) {
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