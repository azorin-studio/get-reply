import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import classNames from 'classnames'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LuPlus } from 'react-icons/lu'
import SequenceBadge from '~/components/SequenceBadge'
import SequencesWelcomeMessage from '~/components/SequencesWelcomeMessage'
import { Database } from '~/lib/database.types'
import { Log, Sequence } from '~/lib/types'

export const revalidate = 0

export default async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    console.log('My Account: session does not exist, redirecting to /')
    return redirect('/') 
  }

  const res = await supabase
    .from('sequences')
    .select('*')
    .order('created_at', { ascending: false })

  const sequences: Sequence[] = res.data || []

  const { data } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false })

  const logs: Log[] = data || []

  return (
    <main className="p-2 flex flex-col gap-8 mb-[30%]">
      {logs.length === 0 && (
        <SequencesWelcomeMessage />
      )}
      <h1 className="text-xl font-bold">
        Public Sequences
      </h1>

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
            .filter((sequence) => sequence.visibility === 'private')
            .map((sequence) => 
              <SequenceBadge key={sequence.id} sequence={sequence} />
            )
          }

          {sequences
            .filter((sequence) => sequence.visibility==='private')
            .length === 0 && (
              <div className="flex flex-col gap-2">
                <div>You have no sequences yet. </div>
              </div>
            )}
        </div>
      </div>

    </main>
  )
}
