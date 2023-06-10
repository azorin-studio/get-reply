import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import LogBody from '~/components/LogBody'
import { Database } from '~/db-admin/database.types'
import getSequenceById from '~/db-admin/get-sequence-by-id'
import { Log, Sequence } from '~/db-admin/types'

export const revalidate = 0

export default async function Page(props: { params: { id: string } }) {
  const id = props.params.id
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
    .select('*, sequence:sequences(*)')
    .eq('id', id)
    .limit(1)
  
  let log: Log | null = null
  if (data && data.length > 0) {
    log = data[0] as Log
  }

  const sequence = await getSequenceById(log!, supabase)

  return (
    <main className="p-2 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Log
      </h1>
      {log && 
        <LogBody
          log={log} 
          sequence={sequence as Sequence}
        />
      }
    </main>
  )
}
