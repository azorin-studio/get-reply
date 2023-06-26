import { Json } from "~/supabase/types"

interface IParseSequenceName {
  to: { address: string }[] | null | undefined,
  cc: { address: string }[] | null | undefined,
  bcc: { address: string }[] | null | undefined,
  headers: { key: string, value: string }[] | Json | null | undefined 
}

export default function parseSequenceName ({ 
  to = [], 
  cc = [], 
  bcc = [], 
  headers = [] 
}: IParseSequenceName): { sequenceName: string | null, tags: string[] } {

  let allToEmails: any[] = []
  if (to) {
    allToEmails = [...allToEmails, ...to.map((to) => to.address)]
  }
  if (cc) {
    allToEmails = [...allToEmails, ...cc.map((to) => to.address)]
  }
  if (bcc) {
    allToEmails = [...allToEmails, ...bcc.map((to) => to.address)]
  }

  const toGetReplyEmails = allToEmails.filter((email) => email.endsWith('getreply.app'))

  // we check them against the headers to see which sequence this particular
  // email was sent to, this is to stop duplicates when multiple sequences
  // are hit at once
  const toGetReply = toGetReplyEmails.find((email) => {
    const header = headers && 
      (headers as any[]).find((header) => {

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