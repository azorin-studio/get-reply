import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SequenceBadge from '~/components/SequenceBadge'
import { Database } from '~/database.types'
import { Sequence } from '~/types'

export const revalidate = 0

export default async function Page() {
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
    .from('sequences')
    .select('*')
    .order('created_at', { ascending: false })

  const sequences: Sequence[] = data || []

  return (
    <main className="max-w-2xl mx-auto p-4 flex flex-col font-sans text-slate-800 antialiased">
      <div className='flex flex-row justify-between'>
        <h1 className="text-2xl font-bold">
          Sequences
        </h1>
        <Link
          href="/sequences/new"
          className="border rounded p-2 hover:bg-slate-50"
        >
          New Sequence
        </Link>
      </div>

      <div className="flex flex-col gap-1 mt-12">
        <div className='divide-y border rounded'>
          {sequences && sequences.map((sequence) => (<SequenceBadge key={sequence.id} sequence={sequence} />))}
        </div>
      </div>
    </main>
  )
}
