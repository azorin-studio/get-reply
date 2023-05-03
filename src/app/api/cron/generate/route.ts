import { NextResponse } from "next/server"
import { handleGenerateEvent } from "~/cron"

export async function GET () {
  try {
    return NextResponse.json(await handleGenerateEvent())
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error })
  }
}