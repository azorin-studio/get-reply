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
  
  const { email } = await request.json()

  const from = email.from.address
  const subject = email.subject
  const text = email.text

  if (headers().get('Authorization') === `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    console.log('Auth passed')
    console.log(JSON.stringify(email, null, 2))
  }

  return NextResponse.json(email)
}
