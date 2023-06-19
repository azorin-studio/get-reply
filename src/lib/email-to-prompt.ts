import replyParser from "node-email-reply-parser"

export default function emailToPrompt (emailBody: string, prompt: string) {
  const messages = replyParser(emailBody)
      .getFragments()
      .map((fragment: any) => fragment.getContent().replace(/>/g, ''))
      // .filter((message: string) => !message.trim().startsWith('---------- Forwarded message ---------'))

  const parsedBody = messages.join('\n\n')

  const fullPrompt = (prompt as string).replace('{email}', parsedBody)
  return fullPrompt
}