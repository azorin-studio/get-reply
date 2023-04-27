import { NextResponse } from "next/server"
import { generateFollowUpEmails, FollowUpEmails } from "~/lib/chat-gpt"

export async function POST (request: Request) {
  const body = await request.json()

  const email = body.email || ''
  if (email.trim().length === 0) {
    return NextResponse.json({ error: { message: "Please enter a valid email" } })
  }

  const userConstraints = body.userConstraints || []

  try {
    const followUps: FollowUpEmails = await generateFollowUpEmails(email, userConstraints)
    return NextResponse.json(followUps)

  } catch(error: any) {
    console.error(error.message)
    if (error.response) {
      return NextResponse.json(error.response.data)
    } else {
      return NextResponse.json({ error: { message: error.message || 'An error occurred during your request.' } })
    }
  }
}
