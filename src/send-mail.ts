import fetch from 'isomorphic-fetch'

export default async function sendMail (props: {
  from: string,
  to: string,
  subject: string,
  textBody: string,
  messageId?: string | null | undefined,
  }) {

  const { 
    from,
    to,
    subject,
    textBody,
    messageId
  } = props

  let opts: any = {
    From: from.trim(),
    To: to.trim(),
    Subject: subject.trim(),
    TextBody: textBody.trim(),
    MessageStream: "outbound",
  }

  if (messageId) {
    opts.Headers = [
      {
        Name: "In-Reply-To",
        Value: messageId
      },
      {
        Name: "References",
        Value: messageId
      }
    ]
  }

  const response = await fetch('https://api.postmarkapp.com/email', {
    method: "POST",
    headers: { 
      "Accept": "application/json",
      "Content-Type": "application/json",
      'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY!
    },
    body: JSON.stringify(opts)
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(`Postmark error: ${response.statusText}`)
  }

  return json
}