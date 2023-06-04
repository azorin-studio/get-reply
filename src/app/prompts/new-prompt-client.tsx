"use client"

import fetch from 'isomorphic-fetch'
import { Loader } from "lucide-react"
import ms from "ms"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import PromptSelector from '~/components/PromptSelector'
import { Prompt } from '~/db-admin/types'
import usePrompts from "~/hooks/use-prompts"
import { useSupabase } from '~/hooks/use-supabase'
import useUser from '~/hooks/use-user'

const DEFAULT_EMAIL = `Dear Hiring Manager, 

I'm interested in the Frontend Engineering position at your company. As a software developer with 8 years of experience with React, I believe I'd be a great fit for the role at InnovateX. 

Attached is my resume and cover letter for your review. Please let me know if you have any questions.

Best regards,
Mike Smith`

const DEFAULT_RESULT = null

export default function DemoPage(props: any) {
  const { supabase } = useSupabase()
  const prompts = usePrompts()  

  const router = useRouter()
  const [creatingNew, setCreatingNew] = useState<boolean>(false)
  const [busy, setBusy] = useState<boolean>(false)
  const [result, setResult] = useState<null>(DEFAULT_RESULT)
  const [timer, setTimer] = useState<null | string>(null)
  const [content, setContent] = useState<string | null>(DEFAULT_EMAIL)
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null)
  const [error, setError] = useState<null | string>(null)

  const [saveBusy, setSaveBusy] = useState<string>('Save')

  const user = useUser()

  useEffect(() => {
    if (!props.params) {
      setActivePrompt(prompts[0])
      return 
    }
    const promptIndex = prompts.findIndex((p: any) => p.id === props.params.id)
    if (promptIndex > -1) {
      setActivePrompt(prompts[promptIndex])
    } 
  }, [prompts])

  const deletePrompt = async () => {
    if (!activePrompt || !activePrompt.prompt) {
      alert('No prompt chosen')
      return
    }

    if (!confirm('Are you sure you want to delete this prompt?')) {
      return
    }

    await supabase
      .from('prompts')
      .delete()
      .match({ id: activePrompt.id })
    
      router.push(`/prompts/new`)
  }

  const saveNewPrompt = async () => {
    if (!activePrompt || !activePrompt.prompt) {
      alert('Please enter a prompt')
      return
    }

    setSaveBusy('Saving')

    const p: any = { 
      prompt: activePrompt.prompt, 
      name: activePrompt.name, 
      description: activePrompt.description,
      user_id: user && user.id,
    }
    if (props.params?.id) {
      p.id = props.params.id
    }

    const { data, error } = await supabase
      .from('prompts')
      .upsert([p])
      .select()

    if (error) {
      alert(error.message)
      return
    }

    if (!data || data.length !== 1) {
      alert('Error saving prompt')
      return
    }

    const newPrompt = data[0]
    setActivePrompt(newPrompt as Prompt)
    setSaveBusy('Saved')
    router.push(`/prompts/${newPrompt.id}`)
  }

  async function onGenerate(event: any) {
    setBusy(false)
    setError(null)
    setTimer(null)
    event.preventDefault()

    try {
      if (!content) {
        throw new Error('Please enter some text')
      }
      if (!activePrompt || !activePrompt.prompt) {
        throw new Error('No prompt chosen')
      }

      let fullPrompt = activePrompt.prompt
      if (activePrompt.name === 'new') {
        fullPrompt = `${fullPrompt}\n\nHere is the email text:\n\n"{email}""`
      }

      fullPrompt = fullPrompt.replace('{email}', content)

      setBusy(true)
      const t1 = new Date()
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      })
      const t2 = new Date()
      setTimer(ms(t2.getTime()-t1.getTime()))

      const { generation, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      setResult(generation)
      setBusy(false)
    } catch(error: any) {
      setBusy(false)
      console.warn(error)
      setError(error.message)
    }
  }

  const handleNewPromptClick = () => {
    setCreatingNew(true)
    setActivePrompt({
      name: 'new',
      prompt: '',
      description: '',
      user_id: user && user.id,
    })
  }

  const handlePromptNameChange = (event: any) => {
    const newPrompt = {
      ...activePrompt,
      name: event.target.value,
    }
    setActivePrompt(newPrompt)
  }

  const handleCancelClick = () => {
    setCreatingNew(false)
    setActivePrompt(prompts[0])
  }

  const handlePromptTextChange = (event: any) => {
    const newPrompt = {
      ...activePrompt,
      prompt: event.target.value,
    }

    setActivePrompt(newPrompt)
  }

  return (
    <main className="p-2 flex flex-col bg-red-50">       
      <div className='flex flex-row w-full border-b p-2 h-12 items-center text-sm justify-between'>
        {!creatingNew && <PromptSelector prompts={prompts} activePrompt={activePrompt} />}
        {creatingNew && (
          <>
            <input 
              type="text"
              className='border p-1 rounded text-sm'
              placeholder='Name'
              value={activePrompt?.name || ""}
              onChange={handlePromptNameChange}
            />
            <div className='flex flex-row gap-2'>
              <button 
                className="text-sm p-1"
                onClick={handleCancelClick}
              >
                Cancel
              </button>
              <button 
                className="text-sm border rounded p-1"
                onClick={saveNewPrompt}
              >
                {saveBusy}
              </button>
            </div>
          </>
        )}

        <div className='flex flex-row gap-2'>
          {(user && activePrompt?.user_id === user.id) && (
            <button 
              className="text-sm border rounded p-1"
              onClick={(e) => setCreatingNew(true)}
            >
              Edit
            </button>
          )}
          {(user && activePrompt?.user_id === user.id) && (
            <button 
              className="text-sm border rounded p-1 text-red-500"
              onClick={deletePrompt}
            >
              Delete
            </button>
          )}
          {!creatingNew && user && (
            <button 
              className="text-sm border p-2 rounded hover:bg-slate-50 my-2"
              onClick={handleNewPromptClick}
            >
              Create new prompt +
            </button>
          )}
        </div>
      </div>

      <div>
        {!creatingNew && (
          <div className="text-sm whitespace-pre-wrap p-2">
            {activePrompt?.prompt || ""}
          </div>
        )}
        {creatingNew && (
          <textarea
            rows={10}
            placeholder={`Enter prompt for the ai`}
            className="text-sm bg-white w-full min-h-fit whitespace-pre-wrap block p-2 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            value={activePrompt?.prompt || ""}
            onChange={handlePromptTextChange}
          />
        )} 
      </div> 
      
      <div className="flex flex-col">
        <div className='flex w-full border-b p-2 h-12 items-center text-sm'>
          Type your email below
        </div>
        <div className='flex flex-grow'>
          <textarea
            name="email"
            rows={10}
            placeholder="Enter the email you want follow ups for"
            className="w-full h-full p-2 text-sm focus:outline-none"
            value={content || ""}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
    
      <div className="bg-slate-50">
        <div className='flex w-full border-b p-2 h-12 items-center text-sm'>
          <button
            type="submit" 
            value="Generate"
            onClick={onGenerate}
            className="rounded-md bg-slate-800 p-2 text-sm text-white "
          >
            {busy ? 'Generating' : 'Generate'}
          </button>
          <div className="text-sm items-center inline ml-2">{timer && `Generated in ${timer}`}</div>           
        </div>
        
        {!busy && !error && result && (
          <div className="whitespace-pre-wrap text-sm p-2">
            {result} 
          </div>
        )}

        <div className="text-red-600">{!busy && error}</div>

        <div>
          {busy && (
            <div className="inline-flex flex-row gap-2 text-sm p-2">
              <Loader className="animate-spin" />
              Generating. This can take up to 10 seconds.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}