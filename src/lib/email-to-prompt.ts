import replyParser from "node-email-reply-parser"


export default function emailToPrompt (emailBody: string, prompt: string) {
  const parsedBody = replyParser(emailBody).getVisibleText()
  const fullPrompt = (prompt as string).replace('{email}', parsedBody)
  return fullPrompt
}