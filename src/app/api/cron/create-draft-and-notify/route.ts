import { NextResponse } from "next/server"
import { handleCreateDraftEvent } from "~/cron/cron"

export const revalidate = 0

export async function GET () {
  try {
    return NextResponse.json(await handleCreateDraftEvent())
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error })
  }
}
