import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import classNames from 'classnames'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LuPlus } from 'react-icons/lu'
import SequenceBadge from '~/components/SequenceBadge'
import { Database } from '~/db-admin/database.types'
import { Sequence } from '~/db-admin/types'

export const revalidate = 0

export default async function Page() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    console.log('My Account: session does not exist, redirecting to /')
    return redirect('/') 
  }

  const res = await supabase
    .from('sequences')
    .select('*')
    .order('weight', { ascending: true })

  const sequences: Sequence[] = res.data || []

  console.log(res)

  return (
    <main className="p-2 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Sequences
      </h1>

      <p>
        Email a sequence and GetReply will response at that time with a draft follow up email. No hassle.
      </p>

      <div className="flex flex-col gap-4">
        {sequences && sequences
          .filter((sequence) => sequence.visibility==='public')
          .map((sequence) => 
            <SequenceBadge key={sequence.id} sequence={sequence} />
          )
        }
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <div className='flex flex-row justify-between'>
          <h2 className="text-xl font-bold">
              My Sequences
          </h2>
          <Link 
            className={classNames(
              'text-sm border px-2.5 py-1.5',
              'bg-blue-500 border-blue-600 text-white rounded border flex flex-row gap-2 items-center',
              'hover:bg-blue-600'
            )}
            href="/sequences/new"
          >
            Create new sequence <LuPlus width={16} />
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {sequences && sequences
            .filter((sequence) => sequence.visibility==='private')
            .map((sequence) => 
              <SequenceBadge key={sequence.id} sequence={sequence} />
            )
          }

          {sequences
            .filter((sequence) => sequence.visibility==='private')
            .length === 0 && (
              <div className='p-4 text-center text-sm'>
                You don&apos;t have any sequences yet. {' '}
                <Link 
                  href="/sequences/new"
                  className='text-blue-500 hover:underline'
                >
                  Create one!
                </Link>
              </div>
            )}
        </div>
      </div>

    </main>
  )
}
