import 'server-only'

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from "next/headers"
import { Database } from '~/database.types'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
    return redirect('/login')
  }

  return (
    <main className="flex-1 flex flex-col p-4 lg:px=2 gap-4">
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Cron
      </h2>
      <div className='flex flex-col gap-2'>
        <Link
          href='/api/process-email'
          className='text-blue-500 hover:text-blue-700'
        >
          Process test email
        </Link>
        <Link
          href='/api/cron/verify'
          className='text-blue-500 hover:text-blue-700'
        >
          Verify
        </Link>
        <Link
          href='/api/cron/generate'
          className='text-blue-500 hover:text-blue-700'
        >
          Generate
        </Link>
        <Link
          href='/api/cron/create-draft-and-notify'
          className='text-blue-500 hover:text-blue-700'
        >
          Create Draft and Notify
        </Link>
      </div>
      
    </main>
  )
}
