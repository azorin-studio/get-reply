import { NextResponse } from "next/server"
import { handleCreateDraftEvent } from "~/cron"

export async function GET () {
  try {
    return NextResponse.json(await handleCreateDraftEvent())
  } catch (error) {
    return NextResponse.json({ error })
  }
}
