import { headers, cookies } from 'next/headers'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '~/database.types'

export const revalidate = 0
import IndexPage from './index-page'

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    console.log('Index: session exists, redirecting to /account')
    return redirect('/account') 
  }
  
  return (
    <IndexPage />
  )
}
