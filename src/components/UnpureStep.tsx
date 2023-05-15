'use client'

import { Loader } from "lucide-react"
import { useEffect, useState } from 'react'
import { useSupabase } from '~/app/supabase-provider'
import { Prompt } from '~/types'

export const revalidate = 0

const UnpureStep = (props: { prompt_id: string, delay: number, generation: string }) => {
  const { prompt_id, delay, generation } = props
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
    <div className="flex flex-col gap-4">
      {refreshing &&
        <Loader className="animate-spin ml-2" />
      }
      {prompt &&
        <div className=''>
          {prompt.prompt}
        </div>
      }
    </div>
  )
}

export default UnpureStep