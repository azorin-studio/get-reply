import { NextResponse } from "next/server"
import { inngest } from "~/inngest/inngest"

export const revalidate = 0

export async function GET (request: Request) {
  const log_id = new URL(request.url).searchParams.get('log_id') || null
  if (!log_id) return NextResponse.json({ error: 'No log_id found' })

  console.log(`[log_id: ${log_id}] sending to queue/cancel`)
  inngest.send('queue/cancel', { data: { log_id } })

  return NextResponse.json({ success: true })
}
