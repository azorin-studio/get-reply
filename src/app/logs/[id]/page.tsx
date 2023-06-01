import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import LogBody from '~/components/LogBody'
import { Database } from '~/db-admin/database.types'
import { Log } from '~/db-admin/types'

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
  
  let log: Log | null = null
  if (data && data.length > 0) {
    log = data[0] as Log
  }

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-row antialiased">
      {log && 
        <LogBody
          log={log} 
        />
      }
    </div>
  )
}
