'use client'

import PromptBadge from '~/components/PromptBadge'
import { Prompt } from '~/types'
import { useSupabase } from '~/app/supabase-provider'
import { useEffect, useState } from 'react'

export const revalidate = 0

const UnpurePromptsList = () => {
  const { supabase } = useSupabase()
  const [prompts, setPrompts] = useState<Prompt[] | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })
      setPrompts(data as Prompt[])
    }

    let interval = setInterval(fetch, 5000)
    fetch()
    return (() => {
      clearInterval(interval)
    })
  }, [])

  console.log('prompts', prompts)

  return (      
    <div className="flex flex-col gap-4">
      {prompts && prompts.map((prompt) => (<PromptBadge key={prompt.id} prompt={prompt} />))}
    </div>
  )
}

export default UnpurePromptsList