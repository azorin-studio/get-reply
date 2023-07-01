import { IncomingEmail } from "~/supabase/types"
import { inngest } from "./inngest"

export const processIncomingEmail = async (incomingEmail: IncomingEmail) => {
  if (!incomingEmail.messageId) throw new Error('No messageId')
 
  await inngest.send({
    name: 'queue/receive',
    id: `queue/receive-${incomingEmail.messageId}`,
    data: { incomingEmail }
  })
}
