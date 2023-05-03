import { NextResponse } from "next/server"
import { handleVerifyEvent } from "~/cron"

export const revalidate = 0

export async function GET () {
  console.log(1)
  try {
    console.log(2)
    return NextResponse.json(await handleVerifyEvent())
    console.log(3)
  } catch (error) {
    console.log(4)
    console.error(error)
    return NextResponse.json({ error })
    console.log(5)
  }
}
