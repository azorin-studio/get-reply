'use client'

import { format, formatDistance } from 'date-fns'
import Link from 'next/link'
import { Log } from '~/db-admin/types'
import StatusBadge from './StatusBadge'
import classNames from 'classnames'

export const revalidate = 0

export default function LogBadge(props: { log: Log }) {
  const { log } = props

  return (
    <Link
      href={`/logs/${log.id}`}
      legacyBehavior
    >
      <div className='border rounded-sm divide-y hover:cursor-pointer group'>
        <div className="w-full p-2 flex flex-row items-center justify-between bg-slate-50 group-hover:bg-slate-100">
          <div className="flex flex-col">
            <div className="text-sm font-bold">
              {log.from.address}
            </div>
            <div className="text-gray-600 text-sm">
              to{' '}{log.to?.map((to) => to!.address).join(', ')}
            </div>
          </div>

          <div className='flex flex-row gap-4 items-center'>
            {log.status && <StatusBadge status={log.status} />}
            <div className="text-gray-600 text-sm">
              { log.created_at && 
                <span>
                  {format(new Date(log.created_at), 'LLLL dd, yyyy, h:MM a')}  ({formatDistance(new Date(log.created_at), new Date(), { addSuffix: true })})
                </span>
              }
            </div>
          </div>
        </div>

        {log.errorMessage &&
          <div className={`bg-red-50 p-2 text-xs font-medium text-red-500`}>
            {log.errorMessage}
          </div>
        }

        <p 
          className={classNames(
            "line-clamp-3 whitespace-pre-wrap",
            "text-sm"
          )}
        >
          {log.text?.trim()}
        </p>

      </div>

    </Link>
  )
}
