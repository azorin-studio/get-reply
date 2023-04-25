'use client'
import Link from 'next/link'
import { Log } from '~/types'
import { formatRelative } from 'date-fns'
import { useSupabase } from '~/app/supabase-provider'

export default function LogBadge(props: { log: Log }) {
  const { supabase } = useSupabase()
  const { log } = props
  
  const handleDelete = async (log: Log) => {
    const { error } = await supabase
      .from('logs')
      .delete()
      .eq('id', `${log.id}`)

    if (error) {
      console.error(error)
    } else {
      window.location.href = '/account'
    }
  }

  return (
    <div className="border p-2 rounded flex flex-col gap-4">
      <div className='flex justify-between'>
        <div className="inline-flex flex-row gap-2">
          <div className="truncate text-sm min-w-32">
            <Link 
              href={`/logs/${log.id}`}
              className='text-blue-500 underline '
            >
              {log.id}
            </Link>
          </div>
          <div className="text-sm">
            { log.created_at && formatRelative(new Date(log.created_at), new Date()) }
          </div>
        </div>

        <div className="flex flex-row gap-4 items-center text-sm">
          <div>{log.status}</div>
          <Link 
            href={`#`}
            className='text-red-500 underline text-sm'
            onClick={(e) => {
              e.preventDefault()
              if (confirm('Are you sure you want to delete this log?')) {
                handleDelete(log)
              }
            }}
          >
            Delete
          </Link>
        </div>
      </div>
      
      <div className="">
        <div className="flex flex-row gap-2 text-sm">
          <div className="font-bold">to: </div><div>{log.to?.map((to) => to!.address).join(', ')}</div>
        </div>
        <div className="flex flex-row gap-2 text-sm">
          <div className="font-bold">from: </div><div>{log.from && log.from.address}</div>
        </div>
        <div className="flex flex-row gap-2 text-sm">
          <div className="font-bold">subject: </div><div>{log.subject}</div>
        </div>
      </div>
    </div>
  )
}
