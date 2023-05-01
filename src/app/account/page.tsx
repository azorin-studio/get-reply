import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '~/database.types'
import { Sequence } from '~/types'
import UnpureLogsList from '~/components/UnpureLogsList'
import UnpurePromptItem from '~/components/UnpurePromptItem'

export const revalidate = 0

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: sequences } = await supabase
    .from('sequences')
    .select('*')
    .order('created_at', { ascending: false })

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
          My account
        </h1>
        <div className="flex flex-row justify-between">
          <div>
            <div className="font-bold">
              Plan
            </div>
            <div>
              alpha
            </div>
          </div>
          <div>
            <div className="font-bold">
              Email
            </div>
            <div>
              { profile.email }
            </div>
          </div>
          <div>
            <div className="font-bold">
              Provider
            </div>
            <div>
              { profile.google_refresh_token ? 'Google' : 'GetReply' }
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
        <div className="font-bold">
          Get started
        </div>

        <div className="flex flex-col gap-2">
          {sequences && sequences.map((sequence: Sequence) => (
            <div 
              key={sequence.id} 
              className="flex flex-col gap-2 border rounded p-2"
            >
              <div className="text-sm">
                Send an email email to {' '}
                <span className="italic">
                  {sequence.name}@getreply.app
                </span> {' '}so that
              </div>
              {sequence.prompt_list?.map((prompt, index) => (
                <>
                  <UnpurePromptItem 
                    key={prompt!.prompt_id}
                    id={prompt!.prompt_id} 
                    compact={true}
                  />
                  <div className="text-sm">
                    will run after {prompt!.delay} days
                  </div>
                  {index < sequence.prompt_list.length - 1 && (
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

        </div>
        
        <UnpureLogsList />

        <Link
          href="/logout"
          className="space-x-2 text-red-600 flex flex-row font-bold sm:inline-block hover:underline"
        >
          Logout
        </Link>

      </main>
    </div>
  )
}
