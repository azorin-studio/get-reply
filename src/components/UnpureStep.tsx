'use client'

import { add, format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useSupabase } from '~/app/supabase-provider'
import { Prompt } from '~/types'

export const revalidate = 0

const UnpureStep = (props: { 
  prompt_id: string, 
  delay: number, 
  generation?: string | null | undefined, 
  created_at: string | null | undefined, 
  status: string | null | undefined
}) => {
  const { prompt_id, delay, generation, created_at, status } = props
  const { supabase } = useSupabase()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  useEffect(() => {
    const fetchPrompt = async () => {
      setRefreshing(true)
      const { data } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', prompt_id)
        .limit(1)
        let prompt = null
        if (data && data.length > 0) {
          prompt = data[0] as Prompt
        }

      setPrompt(prompt)
      setRefreshing(false)
    }
    fetchPrompt()
  }, [])

  return (      
    <div className="flex flex-col gap-2 ml-24 pl-2">
      
      <div className="flex flex-col gap-2">
        <div className="flex-none text-slate-400">
          Prompt
        </div>
        <div className='border p-2 grow rounded whitespace-pre-wrap'>
          {prompt && prompt.prompt}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex-none text-slate-400">
          Generated draft {status === 'drafted' ? 'was' : 'will be'} placed in your drafts folder on {' '}
          { created_at && format(add(new Date(created_at), {days: delay}), 'do MMMM yyyy') }
        </div>
        <div className='border p-2 grow rounded whitespace-pre-wrap'>
          {generation ? generation : '...'}
        </div>
      </div>
    </div>
  )
}

export default UnpureStep