import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import CopyToClipboardBadge from '~/components/CopyToClipboardBadge'
import LogBadge from '~/components/LogBadge'
import { Database } from '~/lib/database.types'
import { Log } from '~/lib/types'

export const revalidate = 0

export default async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    console.log('My Account: session does not exist, redirecting to /')
    return redirect('/') 
  }

  const { data } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false })

  const logs: Log[] = data || []

  return (
    <main className="p-2 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Logs
      </h1>


      <div>
        {logs.length === 0 && (
          <div className="flex flex-col gap-2">
            <div>You have no logs yet. </div>
            <div>
              
              To get started send a test email to <CopyToClipboardBadge text="haiku@getreply.app" />. 
              GetReply will respond with a short
              <Link
                href="https://en.wikipedia.org/wiki/Haiku"
                className="mx-1 items-center text-blue-600 space-x-2 flex font-bold sm:inline-block hover:underline"
              >
                haiku
              </Link>.
            </div>
            <div>
              You can also browse the available {' '}
              <Link
                href="/sequences"
                className="items-center text-blue-600 space-x-2 flex font-bold sm:inline-block hover:underline"
              >
                sequences
              </Link>{' '}
              or make your own.
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {logs.map((log) => (
            <LogBadge key={log.id} log={log} />
          ))}
        </div>
      </div>
    </main>
  )
}
