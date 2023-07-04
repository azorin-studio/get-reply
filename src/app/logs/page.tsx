import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LogBadge from '~/components/LogBadge'
import { Database } from '~/supabase/database.types'

export const revalidate = 0

export default async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return redirect('/') 
  }

  const { data } = await supabase
    .from('logs')
    .select('*, profile:profile_id (*)')
    .order('created_at', { ascending: false })

  const logs: any[] = data || []

  return (
    <main className="p-2 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Logs
      </h1>

      <div>
        {logs.length === 0 && (
          <div className="flex flex-col gap-2">
            <div>You have no logs yet. </div>
          </div>
        )}

        {logs && logs.length > 0 && (
          <div className="flex flex-col divide-y border rounded">
          {logs.map((log) => ( <LogBadge key={log.id} log={log} /> )
        )}
        </div>)}
      </div>
    </main>
  )
}
