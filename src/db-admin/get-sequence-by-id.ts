import parseSequenceName from "~/inngest/parse-sequence-name"
import supabaseAdminClient from "~/db-admin/server-admin-client"
import { Log } from "~/db-admin/types"

export default async function getSequenceById (log: Log, passedSupabase?: any) {
  const { sequenceName } = parseSequenceName(log)

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
