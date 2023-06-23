import { IncomingEmail, Log } from "~/lib/types"

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

  const toGetReplyEmails = allToEmails.filter((email) => email.endsWith('getreply.app'))

  // we check them against the headers to see which sequence this particular
  // email was sent to, this is to stop duplicates when multiple sequences
  // are hit at once
  const toGetReply = toGetReplyEmails.find((email) => {
    const header = log.headers && 
      (log.headers as any[]).find((header) => {

        if (header?.key === 'received') {
          // console.log(header.key, header?.value, email)
          if (header?.value.includes(email)) {
            return true
          }
        }
      })
    return !!header
  })


  if (!toGetReply) {
    return { sequenceName: null, tags: [] }
  }

  const emailPrefix = toGetReply.split('@')[0]
  const sequenceName = emailPrefix.split('+')[0]
  const tags = emailPrefix.split('+').slice(1)

  return { sequenceName, tags }
}