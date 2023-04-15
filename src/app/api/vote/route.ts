import fetch from 'node-fetch'
import { NextResponse } from "next/server"

export async function POST (request: Request) {
  const data = await request.json()
  const { vote, followups } = data

  if (!process.env.GRAPHJSON_API_KEY) {
    return NextResponse.json({ error: { message: 'GRAPHJSON_API_KEY not set.' } })
  }
  
  console.log(`Sending ratings packet to GRAPHJSON`)
  try {
    await fetch("https://api.graphjson.com/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.GRAPHJSON_API_KEY,
        collection: "ratings",
        json: JSON.stringify({
          vote,
          followups
        }),
        timestamp: Math.floor(new Date().getTime() / 1000),
      })
    })
  } catch (err: any) {
    console.error(err.message)
  }

  return NextResponse.json({ success:true })
}
