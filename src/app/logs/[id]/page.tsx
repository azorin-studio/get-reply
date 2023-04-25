import LogBadge from '~/components/LogBadge'
import { headers, cookies } from "next/headers"
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '~/lib/database.types'
import { Log } from '~/types'

export default async function Page({ params }) {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const { data: logs, error } = await supabase
    .from('logs')
    .select('*')
    .eq('id', params.id)
    .limit(1)

  let log = null
  if (logs && logs.length > 0) {
    log = logs[0]
  }

  return (
    <div className="max-w-2xl p-4 flex flex-row bg-white font-sans text-slate-800 antialiased">
      <main className="flex flex-col gap-8 p-4 mx-auto">
        <div>
          <h2 className="font-bold">
            Log:
          </h2>
          {log && (
            <LogBadge 
              key={log.id} 
              log={log} 
            />
          )}
          
        </div>
      </main>
    </div>
    )
}
