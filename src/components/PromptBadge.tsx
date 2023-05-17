'use client'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import { useRef } from 'react'
import { useHover } from 'usehooks-ts'
import { Prompt } from '~/db/types'
import { useSupabase } from '~/hooks/use-supabase'

export const revalidate = 0

export default function PromptBadge(props: { prompt: Prompt }) {
  const { supabase } = useSupabase()
  const { prompt } = props

  const hoverRef = useRef(null)
  const isHovered = useHover(hoverRef)
  
  const handleDelete = async (prompt: Prompt) => {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', `${prompt.id}`)

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
      href={`/prompts/${prompt.id}`}
    >
        <div className="flex flex-row grow gap-2 items-center w-44 truncate">
          <div className="w-24">
            {prompt.name}
          </div>
          <div className='truncate text-slate-500'>
            {prompt.description}
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 justify-between"> 
          <div>
            { prompt.created_at && formatDistance(new Date(prompt.created_at), new Date(), { addSuffix: true }) }
          </div>

        </div>
      </Link>

  )
}
