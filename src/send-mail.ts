import fetch from 'isomorphic-fetch'

export default async function sendMail (props: {
  from: string,
  to: string,
  subject: string,
  textBody: string,
  }) {

  const { 
    from,
    to,
    subject,
    textBody,
  } = props

  // console.log('sendMail', JSON.stringify({ from, to, subject, textBody }, null, 2))

  const response = await fetch('https://api.postmarkapp.com/email', {
    method: "POST",
    headers: { 
      "Accept": "application/json",
      "Content-Type": "application/json",
      'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY!
    },
    body: JSON.stringify({
      From: from.trim(),
      To: to.trim(),
      Subject: subject.trim(),
      TextBody: textBody.trim(),
      MessageStream: "outbound"
    })
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return json
}