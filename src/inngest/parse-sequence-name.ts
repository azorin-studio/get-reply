import { IncomingEmail, Log } from "~/db-admin/types"

export default function parseSequenceName (log: Log | IncomingEmail): { sequenceName: string | null, tags: string[] } {
  let allToEmails: any[] = []
  if (log.to) {
    allToEmails = [...allToEmails, ...log.to.map((to) => to.address)]
  }
  if (log.cc) {
    allToEmails = [...allToEmails, ...log.cc.map((to) => to.address)]
  }
  if (log.bcc) {
    allToEmails = [...allToEmails, ...log.bcc.map((to) => to.address)]
  }

  const toGetReply = allToEmails.find((email) => email.endsWith('getreply.app'))
  if (!toGetReply) {
    return { sequenceName: null, tags: [] }
  }

  const emailPrefix = toGetReply.split('@')[0]
  const sequenceName = emailPrefix.split('+')[0]
  const tags = emailPrefix.split('+').slice(1)

  return { sequenceName, tags }
}