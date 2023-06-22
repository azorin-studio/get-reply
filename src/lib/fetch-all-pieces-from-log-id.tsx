import getProfileFromEmail from "~/db-admin/get-profile-from-email"
import getSequenceFromLog from "~/db-admin/get-sequence-by-id"
import { Log, Profile, Sequence } from "~/db-admin/types"
import getLogById from "~/db-admin/get-log-by-id"
import appendToLog from "~/db-admin/append-to-log"
import parseSequenceName from "~/inngest/parse-sequence-name"
import { render } from "@react-email/render"
import SequenceNotFound from "~/components/emails/sequence-not-found"
import sendMail from "./send-mail"

export default async function fetchAllPiecesFromLogId(log_id: string): Promise<{ 
  log: Log,
  profile: Profile,
  sequence: Sequence
}>{
  let log = await getLogById(log_id!)

  if (!log) {
    throw new Error(`Log ${log_id} not found`)
  }

  const profile: Profile = await getProfileFromEmail((log.from as any).address)

  if (!profile.refresh_token) {
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: 'No google refresh token found for this email'
    })

    throw new Error('No google refresh token found for this email')
  }

  const sequence = await getSequenceFromLog(log)

  if (!sequence) {
    const { sequenceName } = parseSequenceName(log)
    const html = render(
      <SequenceNotFound
        sequenceName={sequenceName}
      />, {
        pretty: true,
      })
      
      let to = [ ...[(log.from as any).address]]
      await sendMail({
        from: 'support@getreply.app',
        to: to.join(', '),
        subject: 'GetReply: Sequence not found',
        html,
        messageId: log.messageId,
      })
      throw new Error(`Sequence ${sequenceName} not found`)
  }

  if (!sequence.steps || sequence.steps.length === 0) {
    const { sequenceName } = parseSequenceName(log)
    log = await appendToLog(log, {
      status: 'error',
      errorMessage: `[sequence:${sequenceName}] has no steps`
    })
    throw new Error(`[sequence:${sequenceName}] has no steps`)
  }

  return {
    log,
    profile,
    sequence
  }
}
