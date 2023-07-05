import { IncomingEmail } from "~/supabase/types"
import { send } from "./event-list"

export default async function Fn (incomingEmail: IncomingEmail) {
  if (!incomingEmail.messageId) throw new Error('No messageId')
  return await send({
    name: 'receive',
    id: `receive-${incomingEmail.messageId}`,
    data: { incomingEmail }
  })
}
