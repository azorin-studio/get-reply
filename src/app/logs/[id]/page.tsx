import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LogBody from '~/components/LogBody'
import { Database } from '~/lib/database.types'
import { Log, Sequence } from '~/lib/types'

export const revalidate = 0

// ├ λ /logs/[id]                             3.08 kB         147 kB

export default async function Page(props: { params: { id: string } }) {
  const id = props.params.id
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    console.log('My Account: session does not exist, redirecting to /')
    return redirect('/') 
  }

  const { data } = await supabase
    .from('logs')
    .select('*, sequence:sequences(*)')
    .eq('id', id)
    .limit(1)
  
  let log: Log | null = null
  if (data && data.length > 0) {
    log = data[0] as Log
  }

  return (
    <main className="p-2 flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">
          Log
        </h1>  
      </div>
      {log && 
        <LogBody
          log={log} 
          sequence={log.sequence as Sequence}
        />
      }
    </main>
  )
}
