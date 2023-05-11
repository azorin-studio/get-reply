"use client"

import fetch from 'isomorphic-fetch'
import { Loader } from "lucide-react"
import ms from "ms"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSupabase } from "~/app/supabase-provider"
import usePrompts from "~/hooks/use-prompts"
import { Prompt } from "~/types"

const DEFAULT_EMAIL = `Dear Hiring Manager, 

I'm interested in the Frontend Engineering position at your company. As a software developer with 8 years of experience with React, I believe I'd be a great fit for the role at InnovateX. 

Attached is my resume and cover letter for your review. Please let me know if you have any questions.

Best regards,
Mike Smith`

const DEFAULT_RESULT = null

export default function DemoPage(props: any) {
  const searchParams = useSearchParams()
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

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const promptName = searchParams.get('prompt') || 'followup1'
    const promptIndex = prompts.findIndex((p: any) => p.name === promptName)
    if (promptIndex > -1) {
      setActivePrompt(prompts[promptIndex])
    }  
    router.replace(`/prompts/new`)
  }, [prompts])

  const deletePrompt = async () => {
    if (!activePrompt || !activePrompt.prompt) {
      throw new Error('No prompt chosen')
    }

    const { data, error } = await supabase
      .from('prompts')
      .delete()
      .match({ id: activePrompt.id })
  }

  const saveNewPrompt = async () => {
    if (!activePrompt || !activePrompt.prompt) {
      throw new Error('No prompt chosen')
    }

    const { data, error } = await supabase
      .from('prompts')
      .insert([
        { 
          prompt: activePrompt.prompt, 
          name: activePrompt.name, 
          description: activePrompt.description,
          user_id: user.id,
        }
      ])
      .select()

    if (error) {
      throw new Error(error.message)
    }

    if (!data || data.length !== 1) {
      throw new Error('Error saving prompt')
    }

    const newPrompt = data[0]
    setActivePrompt(newPrompt as Prompt)
  }

  async function onSubmit(event: any) {
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

  return (
    <main className="flex-grow h-full grid grid-cols-3 gap-4 rounded border">
      <div className="border p-2 rounded flex-grow">
        {!creatingNew && (  
          <div> 
            <div className='flex flex-row justify-between'>
              <select
                id="prompt-selector"
                name="prompt-selector"
                className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 text-sm"
                value={activePrompt?.name || ""}
                onChange={(e) => {
                  const prompt = prompts.find((p: any) => p.name === e.target.value)
                  if (prompt) {
                    setActivePrompt(prompt)
                  }
                }}
              >
                {prompts.map((prompt: any) => (
                  <option key={prompt.name} value={prompt.name}>
                    {prompt.name}
                  </option>
                ))}
              </select>

              <button 
                className="text-sm text-blue-600"
                onClick={(e) => {
                  setCreatingNew(true)
                  setActivePrompt({
                    name: 'new',
                    prompt: '',
                    description: '',
                    user_id: user.id,
                  })
                }}
              >
                + Create new
              </button>
              {user && user.id === activePrompt?.user_id && (
                <button 
                  className="text-sm text-blue-600"
                  onClick={(e) => {
                    deletePrompt()
                  }}
                >
                  Delete
                </button>
              )}
            </div>
            <div className="text-sm whitespace-pre-wrap">
              {activePrompt?.prompt || ""}
            </div>
          </div>
        )}
        {creatingNew && (
          <div>
            <div className="p-2 flex flex-row justify-between">
              <input 
                type="text"
                className='border p-1 rounded'
                placeholder='Name'
                onChange={(e) => {
                  const newPrompt = {
                    ...activePrompt,
                    name: e.target.value,
                  }
                  setActivePrompt(newPrompt)
                }}
              />
              <button 
                className="text-sm text-blue-600"
                onClick={saveNewPrompt}
              >
                Save
              </button>
              <button 
                className="text-sm text-blue-600"
                onClick={(e) => setCreatingNew(false)}
              >
                Cancel
              </button>
            </div>
            <textarea
              rows={10}
              placeholder={`Enter prompt for the ai`}
              className="text-sm w-full min-h-fit whitespace-pre-wrap block border rounded-md bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={activePrompt?.prompt || ""}
              onChange={(event) => {
                const newPrompt = {
                  ...activePrompt,
                  prompt: event.target.value,
                }

                setActivePrompt(newPrompt)
              }}
            />
          </div>
        )}
        
      </div>
      
      <div>
        <textarea
          name="email"
          rows={10}
          placeholder="Enter the email you want follow ups for"
          className="p-2 w-full prose prose-sm max-w-full min-h-fit whitespace-pre-wrap block border rounded-md bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          value={content || ""}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    
      <div>
        <button
          type="submit" 
          value="Generate"
          onClick={onSubmit}
          className="inline-flex gap-2 items-center h-12 justify-center align-items rounded-md bg-slate-800 py-2 px-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {busy ? 'Generating' : 'Generate'}
        </button>
        {!busy && !error && result && (
          <div className="flex flex-col gap-4">
            <div className="border bg-slate-100 rounded prose-sm whitespace-pre-wrap">
              <div className="border-b p-1 text-xs px-2 text-slate-500 align-items justify-end">
                Generation took {timer}
              </div>
              <div className="p-2" data-testid="followup1">
                {result} 
              </div>
            </div>
          </div>
        )}

        {!busy && !error && !result && (
          <div>Click the generate button on the left!</div>
        )}
        <div className="text-red-600">{!busy && error}</div>
        <div>
          {busy && (
            <div className="inline-flex flex-row gap-2">
              <Loader className="animate-spin" />
              Generating. This can take up to 10 seconds.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
