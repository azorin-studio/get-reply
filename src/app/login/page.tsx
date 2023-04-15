import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from "next/headers"
import { Database } from '~/lib/database.types'

import LoginPage from './login-client'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    console.log('LOGIN: session exists, redirecting to /protected')
    return redirect('/protected')
  }

  return (
    <LoginPage />
  )
}
