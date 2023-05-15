import { NextResponse } from "next/server"
import { handleGenerateEvent } from "~/cron/cron"

export const revalidate = 0

export async function GET () {
  try {
    return NextResponse.json(await handleGenerateEvent())
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error })
  }
}
