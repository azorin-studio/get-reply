import supabaseAdminClient from "~/db-admin/server-admin-client"

export default async function getSequenceByName (sequenceName: string, passedSupabase?: any) {
  let supabase = supabaseAdminClient
  if (passedSupabase) {
    supabase = passedSupabase
  }

  const { error, data: sequences } = await supabase
    .from('sequences')
    .select()
    .eq('name', sequenceName)

  if (error) {
    throw error
  }

  if (!sequences || sequences.length === 0) {
    return null
  }

  const sequence = sequences[0]
  return sequence
}
