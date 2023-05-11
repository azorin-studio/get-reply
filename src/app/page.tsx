import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Database } from '~/database.types'
import IndexPage from './index-page'

export const revalidate = 0

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    console.log('Index: session exists, redirecting to /sequences')
    return redirect('/sequences') 
  }
  
  return (
    <IndexPage />
  )
}
