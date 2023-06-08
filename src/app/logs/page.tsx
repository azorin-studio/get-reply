import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LogBadge from '~/components/LogBadge'
import { Database } from '~/db-admin/database.types'
import { Log } from '~/db-admin/types'

export const revalidate = 0

export default async function Page() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    console.log('My Account: session does not exist, redirecting to /login')
    return redirect('/login') 
  }

  const { data } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false })

  const logs: Log[] = data || []

  return (
    <main className='flex flex-col gap-4'>
      <h1 className="text-2xl font-bold">
        Logs
      </h1>


      <div>
        {logs.length === 0 && (
          <div className="mt-4 text-slate-600">
            No logs yet.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {logs.map((log) => (
            <LogBadge key={log.id} log={log} />
          ))}
        </div>
      </div>
    </main>
  )
}
