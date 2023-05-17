'use client'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import { useRef } from 'react'
import { useHover } from 'usehooks-ts'
import { Sequence } from '~/db/types'
import { useSupabase } from "~/hooks/use-supabase"
import useUser from '~/hooks/use-user'

export const revalidate = 0

export default function SequenceBadge(props: { sequence: Sequence }) {
  const { supabase } = useSupabase()
  const { sequence } = props

  const hoverRef = useRef(null)
  const isHovered = useHover(hoverRef)

  const user = useUser()
  
  const handleDelete = async (sequence: Sequence) => {
    const { error } = await supabase
      .from('sequences')
      .delete()
      .eq('id', `${sequence.id}`)

    if (error) {
      console.error(error)
    } else {
      window.location.href = '/sequences'
    }
  }

  return (
    <Link
      ref={hoverRef} 
      className="p-2 flex flex-row gap-4 w-full items-center hover:bg-slate-50"
      href={`/sequences/${sequence.id}`}
    >
        <div className="flex flex-row grow gap-2 items-center w-44 truncate">
          <div className="">
            {sequence.name}
          </div>
          <div className='truncate text-slate-500'>
            {sequence.description}
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 justify-between"> 
          {!isHovered && (user && user.id === sequence.user_id) &&
            <div>
              { sequence.created_at && formatDistance(new Date(sequence.created_at), new Date(), { addSuffix: true }) }
            </div>
          }

          {isHovered && (user && user.id === sequence.user_id) &&
            <button
              className='text-red-500 rounded hover:bg-slate-50'
              onClick={(e) => {
                e.preventDefault()
                if (confirm('Are you sure you want to delete this sequence?')) {
                  handleDelete(sequence)
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
