'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LogActionBar from '~/components/LogActionBar'
import LogBody from '~/components/LogBody'
import { Database } from '~/lib/database.types'
import { Log, Sequence } from '~/lib/types'

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id

  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
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
        {log && log.id && <LogActionBar id={log.id} />}
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
