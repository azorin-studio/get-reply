import fetch from 'isomorphic-fetch'

export default async function sendMail () {
  const response = await fetch('https://api.postmarkapp.com/email', {
    method: "POST",
    headers: { 
      "Accept": "application/json",
      "Content-Type": "application/json",
      'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY!
    },
    body: JSON.stringify({
      From: "reply@getreply.app",
      To: "me+postmark@eoinmurray.eu",
      Subject: "Hello from GetReply",
      HtmlBody: "<strong>Hello</strong> dear GetReply user.",
      MessageStream: "outbound"
    })
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  expect(json).toHaveProperty('Message')
  expect(json.Message).toBe('OK')
}