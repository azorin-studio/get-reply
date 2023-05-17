'use client'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import { useRef } from 'react'
import { useHover } from 'usehooks-ts'
import { Log } from '~/db/types'
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
      window.location.href = '/sequences'
    }
  }

  let bgColor = 'bg-gray-200'
  if (log.status === "error") {
    bgColor = 'bg-red-400'
  } else if (log.status === "pending") {
    bgColor = 'bg-yellow-100'
  } else if (log.status === "verified") {
    bgColor = 'bg-yellow-300'
  } else if (log.status === "generated") {
    bgColor = 'bg-yellow-500'
  } else if (log.status === "drafted") {
    bgColor = 'bg-green-300'
  }

  return (
    <Link
      ref={hoverRef} 
      className="p-2 flex flex-row gap-4 w-full items-center hover:bg-slate-50"
      href={`/logs/${log.id}`}
    >
        <div
          className='flex flex-row gap-2 items-center w-24'
        >
          <div 
            className={`mt-0 rounded-full p-1 items-center ${bgColor}`}
          >
          </div>
          <div className='items-center capitalize'>
            {log.status}
          </div>
        </div>

        <div className="flex flex-row gap-2 items-center w-40 truncate font-bold">
          {log.to?.map((to) => to!.address).join(', ')}
        </div>

        <div className="flex flex-row grow gap-2 items-center w-44 truncate">
          <div className="">
            {log.subject}
          </div>
          <div className='truncate text-slate-500'>
            {" - "}{log.text}
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 justify-between"> 
          {!isHovered &&
            <div>
              { log.created_at && formatDistance(new Date(log.created_at), new Date(), { addSuffix: true }) }
            </div>
          }

          {isHovered &&
            <button
              className='text-red-500 rounded hover:bg-slate-50'
              onClick={(e) => {
                e.preventDefault()
                if (confirm('Are you sure you want to delete this log?')) {
                  handleDelete(log)
                }
              }}
            >
              Delete
            </button>
          }
        </div>
      </Link>

  )
}
