import 'server-only'

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from "next/headers"
import { redirect } from 'next/navigation'
import { Database } from '~/database.types'

export const revalidate = 0

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if(session) {
    console.log('Trying to add google_refresh_token to profile')

    const { error } = await supabase
      .from('profiles')
      .update({ google_refresh_token: session.provider_refresh_token })
      .eq('id', session.user.id)
      .select('*')

    if (error) throw new Error(error.message)

    return redirect('/logs')
  }

  return (
    <main className="flex-1 flex flex-col p-4 lg:px=2 gap-4">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Google callback
      </h2>
    </main>
  )
}
