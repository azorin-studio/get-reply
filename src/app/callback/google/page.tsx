import 'server-only'

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from "next/headers"
import { Database } from '~/lib/supabase/database.types'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if(session) {
    await supabase
      .from('profiles')
      .update({ google_access_token: session.provider_token, google_refresh_token: session.provider_refresh_token })
      .eq('email', session.user.email)

    return redirect('/account')
  }

  return (
    <main className="flex-1 flex flex-col p-4 lg:px=2 gap-4">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Google callback
      </h2>
    </main>
  )
}
