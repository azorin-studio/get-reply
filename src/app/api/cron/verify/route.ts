import { NextResponse } from "next/server"
import { handleVerifyEvent } from "~/cron"

export async function GET () {
  try {
    return NextResponse.json(await handleVerifyEvent())
  } catch (error) {
    return NextResponse.json({ error })
  }
}
