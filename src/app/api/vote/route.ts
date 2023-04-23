import fetch from 'node-fetch'
import { NextResponse } from "next/server"

export async function POST (request: Request) {
  const data = await request.json()
  const { vote, followups } = data

  return NextResponse.json({ success:true })
}
