import 'server-only'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'
import { Database } from '~/db-admin/database.types'

export const revalidate = 0

export default async function Page() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if(session) {
    const { error, data: profile } = await supabase
      .from('profiles')
      .update({ google_refresh_token: session.provider_refresh_token })
      .eq('id', session.user.id)
      .select('*')
      .single()

    if (!profile) throw new Error('No profile found')
    if (error) throw new Error(error.message)

    // return redirect('/logs')
  }

  return (
    <main className="flex-1 flex flex-col p-4 lg:px=2 gap-4">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Google callback
      </h2>
    </main>
  )
}
