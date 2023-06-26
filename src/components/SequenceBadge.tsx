'use client'
import Link from 'next/link'
import { Sequence } from '~/supabase/types'
import CopyToClipboardBadge from './CopyToClipboardBadge'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import deleteSequenceById from '~/supabase/delete-sequence-by-id'

export const revalidate = 0

export default function SequenceBadge(props: { sequence: Sequence }) {
  const supabase = createClientComponentClient()
  const { sequence } = props

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [supabase.auth])
  
  const handleDelete = async () => {
    if (!sequence.id) return
    try {
      await deleteSequenceById(supabase, sequence.id)
    } catch (error) {
      if (error) console.error(error)
    }
    window.location.href = '/sequences'
  }

  return (
    <div
      className="flex flex-row gap-4 w-full items-center "
    >
        <div className="flex flex-col gap-2 grow truncate">
          <div className="font-semibold">
            <CopyToClipboardBadge text={`${sequence.name}@getreply.app`}              
            />
          </div>
          <div className="flex flex-row items-center gap-2 justify-between"> 
            <div>
            <span className='text-slate-500'>
            Responds with the prompt{' '}
            </span>
            {sequence.steps.map((step, index) => (
              <span key={index} className='text-slate-500'>
                <span>
                  <Link 
                    className='text-blue-500 mx-1'
                    href={`/prompts/${step.prompt_id}`}
                  >
                    {step.prompt_name}
                  </Link> after{' '}
                  <span className='font-semibold'>{step.delay}</span>
                  {' '}
                  <span className='text-slate-500'>{step.delayUnit}</span>
                </span>
              </span>
            ))}
            </div>

            <div className='flex flex-row gap-2'>
              {user && user.id === sequence.user_id && (
                <button
                  className='text-red-500 rounded hover:bg-slate-50'
                  onClick={(e) => {
                    e.preventDefault()
                    if (confirm('Are you sure you want to delete this sequence?')) {
                      handleDelete()
                    }
                  }}
                >
                  Delete
                </button>
              )}
              {user && user.id === sequence.user_id && (
                <Link
                  href={`/sequences/${sequence.id}`}
                  className='text-blue-500 hover:underline'
                >
                  Edit
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

  )
}
