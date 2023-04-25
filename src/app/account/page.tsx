import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import LogBadge from '~/components/LogBadge'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '~/lib/database.types'
import { Log } from '~/types'

export const revalidate = 0

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const { data, error } = await supabase
    .from('logs')
    .select('*')

  const logs: Log[] | null = data as Log[]

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    console.log('My Account: session does not exist, redirecting to /login')
    return redirect('/login') 
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select("*")
    .eq('id', session.user.id)
    .limit(1)

  let profile = null
  if (profiles && profiles.length > 0) {
    profile = profiles[0]
  }

  if (!profile) {
    console.log('My Account: profile does not exist, redirecting to /login')
    return redirect('/login') 
  }

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-row bg-white font-sans text-slate-800 antialiased">
      <main className="flex flex-col gap-8 p-4 mx-auto">
        <h1 className="text-2xl font-bold">
          My account
        </h1>
        <div className="flex flex-row justify-between">
          <div>
            <div className="font-bold">
              Plan
            </div>
            <div>
              alpha
            </div>
          </div>
          <div>
            <div className="font-bold">
              Email
            </div>
            <div>
              { profile.email }
            </div>
          </div>
          <div>
            <div className="font-bold">
              Provider
            </div>
            <div>
              { profile.google_refresh_token ? 'Google' : 'GetReply' }
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
        <div className="font-bold">
          Get started
        </div>
        <p>
          To get follow ups sent to your gmail please bcc this address:
        </p>

        <p className="text border font-bold rounded p-2">
          bot@getreply.app
        </p>
        <p>
          While in alpha, GetReply will place one draft in your account immediately, and not two follow ups after three and six days.
        </p>
        </div>
        <div>
          
          <div className="flex flex-col gap-4">
          <div className="font-bold">
            Logs
          </div>
          {logs && logs.map((log) => (<LogBadge key={log.id} log={log} />))}
          </div>
        </div>

        <Link
          href="/logout"
          className="space-x-2 text-red-600 flex flex-row font-bold sm:inline-block hover:underline"
        >
          Logout
        </Link>

      </main>
    </div>
  )
}
