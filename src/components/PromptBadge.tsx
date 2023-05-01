'use client'
import Link from 'next/link'
import { Prompt } from '~/types'
import { formatDistance } from 'date-fns'
import { useSupabase } from '~/app/supabase-provider'

export const revalidate = 0

export default function PromptBadge(props: { prompt: Prompt }) {
  const { supabase } = useSupabase()
  const { prompt } = props
  
  const handleDelete = async (prompt: Prompt) => {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', `${prompt.id}`)

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
              href={`/prompts/${prompt.id}`}
              className='text-blue-500 underline '
            >
              {prompt.name}
            </Link>
          </div>
          <div className="text-sm">
            { prompt.created_at && formatDistance(new Date(prompt.created_at), new Date(), { addSuffix: true }) }
          </div>
        </div>
      </div>
      
    </div>
  )
}
