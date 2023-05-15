import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import PromptBody from '~/components/PromptBody'
import { Database } from '~/database.types'
import { Prompt } from '~/types'

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
    .from('prompts')
    .select('*')
    .eq('id', id)
    .limit(1)
  
  let prompt = null
  if (data && data.length > 0) {
    prompt = data[0] as Prompt
  }
  
  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-row antialiased">
      <main className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          Prompt
        </h1>
        {prompt && 
          <PromptBody
            prompt={prompt} 
          />
        }
      </main>
    </div>
  )
}
