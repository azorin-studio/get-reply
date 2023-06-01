'use client'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import { useRef } from 'react'
import { useHover } from 'usehooks-ts'
import { Log } from '~/db-admin/types'
import { useSupabase } from '~/hooks/use-supabase'

export const revalidate = 0

export default function LogBadge(props: { log: Log }) {
  const { supabase } = useSupabase()
  const { log } = props

  const hoverRef = useRef(null)
  const isHovered = useHover(hoverRef)
  
  const handleDelete = async (log: Log) => {
    const { error } = await supabase
      .from('logs')
      .delete()
      .eq('id', `${log.id}`)

    if (error) {
      console.error(error)
    } else {
      window.location.href = '/logs'
    }
  }

  const handleRetry = async (log: Log) => {
    await supabase
      .from('logs')
      .update({ status: 'pending' })
      .eq('id', `${log.id}`)
    window.location.reload()
  }

  let statusColor = 'blue'
  if (log.status === "error") {
    statusColor = 'red'
  } else if (log.status === "pending") {
    statusColor = 'yellow'
  } else if (log.status === "verified") {
    statusColor = 'yellow'
  } else if (log.status === "generated") {
    statusColor = 'yellow'
  } else if (log.status === "sent") {
    statusColor = 'green'
  }

  return (
    <Link
      ref={hoverRef} 
      href={`/logs/${log.id}`}
      legacyBehavior
    >
      <div key={log.id} className='table-row items-center hover:bg-slate-50 hover:cursor-pointer border-y'>
        <div className="table-cell whitespace-nowrap py-3 pl-4 pr-3 text-sm sm:pl-0">
          <div className="flex items-center">
            <div className="ml-2">
              <div className="font-medium text-gray-900">
                {log.to?.map((to) => to!.address).join(', ')}
              </div>
              <div className="mt-1 text-gray-500">{log.from.address}</div>
            </div>
          </div>
        </div>
        <div className="table-cell whitespace-nowrap px-3 py-3 text-sm text-gray-500">
          <div className="text-gray-900 font-bold">
            <Link
              className="hover:underline"
              href={`/logs/${log.id}`}
            >
              {log.subject}
            </Link>
          </div>
          <div className="mt-1 text-gray-500 truncate">
            {log.text}
          </div>
        </div>
        <div className="table-cell items-center px-3 text-sm text-gray-500">
          <div 
            className={`rounded-md inline-flex bg-${statusColor}-50 px-2 py-1.5 text-xs font-medium text-${statusColor}-700 ring-1 ring-inset ring-${statusColor}-600/20`}
          >
            {log.status}
          </div>
        </div>
        <div className="table-cell items-center whitespace-nowrap px-3 py-3 text-sm text-gray-500">
          {formatDistance(new Date(log.created_at), new Date(), { addSuffix: true })
            .replace('less than a minute ago', '0 minutes ago') }
        </div>
      </div>
    </Link>
  )
}
