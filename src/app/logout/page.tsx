import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from "next/headers"
import { Database } from '~/lib/database.types'

import LogoutPage from './logout-page'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })
  
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession()

  // if (!session) {
  //   console.log('LOGOUT: session does not exist, redirecting to /login')
  //   return redirect('/login')
  // }

  return (
    <LogoutPage />
  )
}
