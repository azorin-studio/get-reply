import LogBadge from '~/components/LogBadge'
import LogBody from '~/components/LogBody'
import { headers, cookies } from "next/headers"
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '~/database.types'
import { Log } from '~/types'

export const revalidate = 0

export default async function Page(props: { params: { id: string } }) {
  const id = props.params.id

  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const { data: logs, error } = await supabase
    .from('logs')
    .select('*')
    .eq('id', id)
    .limit(1)

  let log = null
  if (logs && logs.length > 0) {
    log = logs[0] as Log
  }

  if (!log) return <div>404</div>

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-row antialiased">
      <main className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          Log
        </h1>
        <LogBadge 
          log={log} 
        />
        <LogBody
          log={log} 
        />
      </main>
    </div>
  )
}
