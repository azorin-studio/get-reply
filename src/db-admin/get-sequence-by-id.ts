import parseSequenceName from "~/queue/parse-sequence-name"
import supabaseAdminClient from "./server-admin-client"
import { Log } from "./types"

export default async function getSequenceById (log: Log) {
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
