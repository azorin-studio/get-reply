import { NextResponse } from "next/server"
import { callGPT35Api } from "~/chat-gpt"

export const revalidate = 0

export async function POST (request: Request) {
  const body = await request.json()

  const prompt = body.prompt || ''
  if (prompt.trim().length === 0) {
    return NextResponse.json({ error: "Please enter a prompt" })
  }

  try {
    const generation: string = await callGPT35Api(prompt, 3)
    return NextResponse.json({ generation, error: null })

  } catch(error: any) {
    console.error(error.message)
    if (error.response) {
      return NextResponse.json(error.response.data)
    } else {
      return NextResponse.json({ error: error.message || 'An error occurred during your request.' })
    }
  }
}
