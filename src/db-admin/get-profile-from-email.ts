import supabaseAdminClient from "~/db-admin/server-admin-client"

export default async function getProfileFromEmail (email: string) {
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