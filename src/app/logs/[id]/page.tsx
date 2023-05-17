import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import LogBody from '~/components/LogBody'
import RefreshPeriodically from '~/components/RefreshPeriodically'
import { Database } from '~/db/database.types'
import { Log } from '~/db/types'

export const revalidate = 0

export default async function Page(props: { params: { id: string } }) {
  const id = props.params.id
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

  const { data } = await supabase
    .from('logs')
    .select('*, sequence:sequences(*)')
    .eq('id', id)
    .limit(1)
  
  let log = null
  if (data && data.length > 0) {
    log = data[0] as Log
  }

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-row antialiased">
      <RefreshPeriodically />
      <main className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          Log
        </h1>
        {log && 
          <LogBody
            log={log} 
          />
        }
      </main>
    </div>
  )
}
