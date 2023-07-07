'use server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import CancelAlert from '~/components/CancelAlert'
import LogActionBar from '~/components/LogActionBar'
import LogBody from '~/components/LogBody'

import { getActionsByKey, getLogByKey } from '~/supabase/supabase'
import { Action, Log } from '~/supabase/types'
import { Database } from '~/supabase/database.types'

export default async function Page({ params, searchParams }: { 
  params: { id: string }, 
  searchParams: { [key: string]: string | string[] | undefined }
 }) {
  const id = params.id

  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/')

  const log: Log | null | undefined = await getLogByKey(supabase, 'id', id)
  const actions: Action[] = await getActionsByKey(supabase, 'log_id', id)
  if (!log) return (
    <div>Log not found</div>
  )

  return (
    <main className="p-2 flex flex-col gap-4">
      <CancelAlert
        id={id}
        cancel={'cancel' in searchParams}
      />
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">
          Log
        </h1>
        {log && (
          <LogActionBar 
            log={log}
          />
        )}
      </div>
      {log && 
        <LogBody
          log={log as Log} 
          actions={actions}
        />
      }
    </main>
  )
}
