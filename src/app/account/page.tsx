import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import LogBadge from '~/components/LogBadge'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '~/lib/database.types'

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const { data: logs, error } = await supabase
    .from('logs')
    .select('*')

  console.log(logs, error)

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

  console.log({logs})

  return (
    <div className="max-w-2xl p-4 flex flex-row bg-white font-sans text-slate-800 antialiased">
      <main className="flex flex-col gap-8 p-4 mx-auto">
        <h1 className="text-2xl font-bold">
          My account
        </h1>
        <div>
          <h2 className="font-bold">
            Your plan:
          </h2>
          <p>
            alpha
          </p>
        </div>
        <div>
          <h2 className="font-bold">
            Your email:
          </h2>
          <p>
            { session.user.email }
          </p>
        </div>
        <div>
          <h2 className="font-bold">
            Your provider:
          </h2>
          <p>
            { profile.google_refresh_token ? 'Google' : 'GetReply' }
          </p>
        </div>
        <div className='flex flex-col gap-2'>
        <h2 className="font-bold">
          Get started:
        </h2>
        <p>
          To get follow ups sent to your gmail please bcc this address:
        </p>

        <p className="text-xl border font-bold rounded p-2">
          bot@getreply.app
        </p>
        <p>
          While in alpha, GetReply will place one draft in your account immediately, and not two follow ups after three and six days.
        </p>
        </div>
        <div>
          <h2 className="font-bold">
            Logs:
          </h2>
          {logs.map && logs.map((log) => (<LogBadge key={log.id} log={log} />))}
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
