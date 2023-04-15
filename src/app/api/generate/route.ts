import { NextResponse } from "next/server"
import generate from "~/lib/generate"

export async function POST (request: Request) {
  const body = await request.json()

  const payload = body.payload || ''
  if (payload.trim().length === 0) {
    return NextResponse.json({ error: { message: "Please enter a valid payload" } })
  }

  const userPrompt = body.userPrompt || ''

  try {
    const { data, prompt } = await generate(payload, userPrompt)

    if (process.env.GRAPHJSON_API_KEY) {
      console.log(`Sending generations packet to GRAPHJSON`)
      try {
        await fetch("https://api.graphjson.com/api/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.GRAPHJSON_API_KEY,
            collection: "generations",
            json: JSON.stringify({
              followups: data,
              prompt
            }),
            timestamp: Math.floor(new Date().getTime() / 1000),
          })
        })  
      } catch (err: any) {
        console.error(err.message)
      }
    }
    return NextResponse.json({ data })

  } catch(error: any) {
    console.error(error.message)
    if (error.response) {
      return NextResponse.json(error.response.data)
    } else {
      return NextResponse.json({ error: { message: error.message || 'An error occurred during your request.' } })
    }
  }
}
