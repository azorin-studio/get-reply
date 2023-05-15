import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import PromptBadge from '~/components/PromptBadge'
import { Database } from '~/database.types'
import { Prompt } from '~/types'

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
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false })

  const prompts: Prompt[] = data || []

  return (
    <main className="max-w-2xl mx-auto p-4 flex flex-col font-sans text-slate-800 antialiased">
      <div className='flex flex-row justify-between'>
        <h1 className="text-2xl font-bold">
          Prompts
        </h1>
        <Link
          href="/prompts/new"
          className="border rounded p-2 hover:bg-slate-50"
        >
          New Prompt
        </Link>
      </div>
      
      <div className="flex flex-col gap-1 mt-12">
        <div className='divide-y border rounded'>
          {prompts && prompts.map((prompt) => (<PromptBadge key={prompt.id} prompt={prompt} />))}
        </div>
      </div>
    </main>
  )
}
