import { Log } from "~/types"

export default function parseSequenceName (log: Log) {
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
    return null
  }

  return toGetReply.split('@')[0]
}