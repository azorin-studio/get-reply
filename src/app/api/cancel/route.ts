import { NextResponse } from "next/server"
import { send } from "~/bus/process-incoming-email"

export const revalidate = 0

export async function GET (request: Request) {
  const log_id = new URL(request.url).searchParams.get('log_id') || null
  if (!log_id) throw new Error('No log_id provided')

  await send(null, { 
    name: 'queue/cancel', 
    data: { log_id }
  })

  return NextResponse.json({ success: true })
}
