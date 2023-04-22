import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from "next/headers"
import { redirect } from 'next/navigation'
import { Database } from '~/lib/database.types'

export default async function Page() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    console.log('PROTECTED: session does not exist, redirecting to /login')
    return redirect('/login')
  }

  return (
    <main className="flex-1 flex flex-col p-4 lg:px=2 gap-4">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Hi from protected page
      </h2>
      <p>
        Hi {session.user.email}
      </p>
      <p>
        Please bcc bot@getreply.app using your gmail account and we will place easy to use follow ups in your drafts after two and three days.
      </p>
      {/* <pre 
        className='p-4 border rounded bg-slate-100'
        style={{
          overflowX: 'scroll'
        }}
      >
        {JSON.stringify(session, null, 2)}
      </pre> */}
    </main>
  )
}
