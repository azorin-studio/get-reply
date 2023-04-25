'use client'
import Link from 'next/link'
import { Log } from '~/types'
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
    <div className="flex flex-row gap-2">
      <Link 
        href={`/logs/${log.id}`}
        className='text-blue-500 underline'
      >
        {log.id}
      </Link>
      <p className="text-sm">
        {log.created_at}
      </p>
      <p className="text-sm">
        {log.text}
      </p>
      <Link 
        href={`#`}
        className='text-read-500 underline'
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
    )
}
