import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { ArrowUpRight } from 'lucide-react'
import { headers, cookies } from "next/headers"
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Database } from '~/lib/supabase/database.types'

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    console.log('My Account: session does not exist, redirecting to /login')
    return redirect('/login')
  }


  let { data: logs, error } = await supabase
    .from('logs')
    .select('*')

  console.log(logs)

  return (
    <div className="max-w-2xl p-4 flex flex-row bg-white font-sans text-slate-800 antialiased">
      <main className="flex flex-col gap-8 p-4 mx-auto">
        <h1 className="text-2xl font-bold">
          Hi {session.user.email}
        </h1>
        <div>
          <h2 className="font-bold">
            Your plan:
          </h2>
          <p>
            alpha
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
          {logs?.map((log) => (
            <div key={log.id} className="flex flex-row gap-2">
              <p className="text-sm">
                {log.created_at}
              </p>
              <p className="text-sm">
                {log.text}
              </p>
            </div>
          )
            
          )}
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
