'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { Log } from '~/supabase/types'
import StatusBadge from './StatusBadge'

export const revalidate = 0

export default function LogBadge(props: { log: Log }) {
  const { log } = props

  return (
    <Link
      href={`/logs/${log.id}`}
      legacyBehavior
    >
      <div className='rounded-sm divide-y hover:cursor-pointer group'>
        <div className="w-full p-2 flex flex-row items-center justify-between group-hover:bg-slate-50">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-col text-sm">
              <div className="font-bold">
                {log.subject}
              </div>
              <div className="text-gray-600">
                to {' '}{log.to?.map((to) => to!.address).join(', ')}
              </div>
            </div>
          </div>

          <div className='flex flex-row gap-4 items-center'>
            {log.status && (
              <StatusBadge status={log.status} />
            )}
            <div className="text-gray-600 text-sm">
              { log.created_at && 
                <span>
                  {format(new Date(log.created_at), 'dd LLL, HH:mm')}
                </span>
              }
            </div>
          </div>
        </div>

      </div>

    </Link>
  )
}
