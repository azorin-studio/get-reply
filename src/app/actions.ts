'use server'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "~/supabase/database.types"
import appendToLog from "~/supabase/append-to-log"
import getLogById from "~/supabase/get-log-by-id"
import { cookies } from "next/headers"

export async function cancelLog(log_id: string) {
  'use server'
  const supabase = createServerComponentClient<Database>({ cookies })
  const log = await getLogById(supabase, log_id)
  if (!log) return

  await appendToLog(supabase, log, { status: 'cancelled' })
}

export async function resumeLog(log_id: string) {
  'use server'
  console.log(`[log_id: ${log_id}]: resuming`)
  const supabase = createServerComponentClient<Database>({ cookies })
  const log = await getLogById(supabase, log_id)
  console.log(`[log_id: ${log_id}]: log`, log)
  if (!log) return

  await appendToLog(supabase, log, { status: 'resume' })
}
