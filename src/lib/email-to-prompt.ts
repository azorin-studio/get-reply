import replyParser from "node-email-reply-parser"

export default function emailToPrompt ({ 
  body = '', 
  subject = '',
  prompt 
}: {
  body: string | undefined | null,
  subject: string | undefined | null,
  prompt: string
}) {

  let messages = []
  if (body) {
  messages = replyParser(body)
      .getFragments()
      .map((fragment: any) => fragment.getContent().replace(/>/g, ''))
  }
  
  const parsedBody = messages.join('\n\n')
  let fullPrompt = prompt.replace('{body}', parsedBody)
  
  // if (subject) {
  //   fullPrompt = fullPrompt.replace('{subject}', subject)
  // }

  return fullPrompt
}