
interface IParsePromptName {
  to: any[] | null | undefined,
  cc: any[] | null | undefined,
  bcc: any[] | null | undefined,
}

export default function parsePromptNamesAndTags ({ 
  to = [], 
  cc = [], 
  bcc = [], 
}: IParsePromptName): { promptName: string, tags: string[] }[] {
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

  const toGetReplyEmails: string[] = allToEmails.filter((email) => email.endsWith('getreply.app'))

  return toGetReplyEmails.map((toGetReply) => {
    const emailPrefix = toGetReply.split('@')[0]
    const promptName = emailPrefix.split('+')[0]
    const tags = emailPrefix.split('+').slice(1)
  
    return { promptName, tags }  
  })
}