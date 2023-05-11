'use client'
import Link from 'next/link'
import { useSupabase } from '~/app/supabase-provider'
import { Prompt } from '~/types'

export const revalidate = 0

export default function PromptBadge(props: { prompt: Prompt, compact?: boolean }) {
  const { supabase } = useSupabase()
  const { prompt, compact = false } = props
  
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
    <div className="flex flex-col gap-4">
      <div className='flex justify-between'>
        <div className="inline-flex flex-col gap-2">
          <div className="truncate text-sm min-w-32">
            <Link 
              href={`/prompts/${prompt.id}`}
              className='text-blue-500 underline '
            >
              {prompt.name}
            </Link>
          </div>
          {/* {!compact && (
            <div className="text-sm ">
            { prompt.prompt }
          </div>
          )} */}
          
        </div>
      </div>
      
    </div>
  )
}
