import parseSequenceName from "~/cron/parse-sequence-name"
import supabaseAdminClient from "~/supabase"
import { Log } from "~/types"

export default async function getSequenceFromLog (log: Log) {
  const toGetReply = parseSequenceName(log)

  const { error, data: sequences } = await supabaseAdminClient
    .from('sequences')
    .select()
    .eq('name', toGetReply)

  if (error) {
    throw error
  }

  if (!sequences || sequences.length === 0) {
    return null
  }

  const sequence = sequences[0]
  return sequence
}
