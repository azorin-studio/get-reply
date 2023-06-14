'use client'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import { useRef } from 'react'
import { useHover } from 'usehooks-ts'
import { Sequence } from '~/db-admin/types'
import { useSupabase } from "~/hooks/use-supabase"
import useUser from '~/hooks/use-user'
import CopyToClipboardBadge from './CopyToClipboardBadge'

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
    <div
      className="flex flex-row gap-4 w-full items-center "
    >
        <div className="flex flex-col grow truncate">
          <div className="font-semibold">
            <CopyToClipboardBadge text={`${sequence.name}@getreply.app`}              
            />
          </div>
          <div className='truncate text-slate-500'>
            {sequence.description}
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 justify-between"> 
          {!isHovered && (user && user.id === sequence.user_id) &&
            <div>
              {sequence.created_at && formatDistance(new Date(sequence.created_at), new Date(), { addSuffix: true }) }
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
          {user && user.id === sequence.user_id && (
            <Link
              href={`/sequences/${sequence.id}`}
              className='text-blue-500 hover:underline'
              // legacyBehavior
            >
              Edit
            </Link>
          )}
        </div>
      </div>

  )
}
