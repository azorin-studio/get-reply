import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
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

  const { data } = await supabase
    .from('sequences')
    .select('*')
    .order('created_at', { ascending: false })

  const sequences = data as Sequence[]

  if (!session) {
    console.log('My Account: session does not exist, redirecting to /login')
    return redirect('/login') 
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select("*")
    .eq('id', session.user.id)
    .limit(1)

  let profile = null
  if (profiles && profiles.length > 0) {
    profile = profiles[0]
  }

  if (!profile) {
    console.log('My Account: profile does not exist, redirecting to /login')
    return redirect('/login') 
  }

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-row bg-white font-sans text-slate-800 antialiased">
      <main className="flex flex-col gap-4 mx-auto">
        <h1 className="text-2xl font-bold">
          Sequences
        </h1>
        <Link 
          href="/sequences/new"
          className="text-blue-500 hover:underline"  
        >
            Create a new sequence
        </Link>

        <div className="flex flex-col gap-2">
          {sequences && sequences.map((sequence) => (
            <div 
              key={sequence.id} 
              className="flex flex-col gap-2 border rounded p-2"
            >
              <Link 
                className='text-blue-500 hover:underline'
                href={`/sequences/${sequence.id}`}
              >
                {sequence.name}
              </Link>
              <div className="text-sm">
                Send an email email to {' '}
                <span className="italic">
                  {sequence.name}@getreply.app
                </span> {' '}so that
              </div>
              {sequence.steps?.map((prompt, index) => (
                <>
                  promt {prompt!.prompt_id} {' '}
                  <div className="text-sm">
                    will run after {prompt!.delay} days
                  </div>
                  {(sequence.steps && index < sequence.steps.length - 1) && (
                    <div className="text-sm">
                      and then
                    </div>
                    )
                  }
                </>
              ))}
            </div>
          )) }
        </div>
      </main>
    </div>
  )
}
