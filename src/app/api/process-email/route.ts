import 'server-only';

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from 'next/headers'
import { Database } from '~/lib/database.types'

import { NextResponse } from 'next/server'

export async function POST (request: Request) {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })
  
  const data = await request.json()
  
  const from = data.from.address
  const subject = data.subject
  const text = data.text

  return NextResponse.json(data)
}
