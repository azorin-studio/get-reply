'use client'

import { format, formatDistance } from 'date-fns'
import Link from 'next/link'
import { Log } from '~/lib/types'
import StatusBadge from './StatusBadge'
import classNames from 'classnames'
import { statusColors } from './status-colors'

export const revalidate = 0

export default function LogBadge(props: { log: Log }) {
  const { log } = props

  const statusColor = (log.status && statusColors[log.status]) || 'blue'

  return (
    <Link
      href={`/logs/${log.id}`}
      legacyBehavior
    >
      <div className='border rounded-sm divide-y hover:cursor-pointer group'>
        <div className="w-full p-2 flex flex-row items-center justify-between bg-slate-50 group-hover:bg-slate-100">
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

        {/* {log.errorMessage &&
          <div className={`bg-${statusColor}-50 p-2 text-xs font-medium text-${statusColor}-500`}>
            {log.errorMessage}
          </div>
        } */}

        {/* <div className="flex flex-row gap-4 p-2">
          <div
            className={classNames(
              "line-clamp-3 whitespace-pre-wrap text-sm max-w-full truncate",
            )}
          >
            {log.text?.trim()}
          </div>
        </div> */}

      </div>

    </Link>
  )
}
