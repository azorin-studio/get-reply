"use client"

import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import fetch from 'isomorphic-fetch'
import ms from "ms"
import { useSearchParams, useRouter } from "next/navigation"
import usePrompts from "~/hooks/use-prompts"
import { Prompt } from "~/types"

const DEFAULT_EMAIL = `Dear Hiring Manager, 

I'm interested in the Frontend Engineering position at your company. As a software developer with 8 years of experience with React, I believe I'd be a great fit for the role at InnovateX. 

Attached is my resume and cover letter for your review. Please let me know if you have any questions.

Best regards,
Mike Smith`

const DEFAULT_RESULT = null

export default function DemoPage(props: any) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prompts = usePrompts()  
  const [busy, setBusy] = useState<boolean>(false)
  const [result, setResult] = useState<null>(DEFAULT_RESULT)
  const [timer, setTimer] = useState<null | string>(null)
  const [content, setContent] = useState<string | null>(DEFAULT_EMAIL)
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    const promptName = searchParams.get('prompt') || 'followup1'
    const promptIndex = prompts.findIndex((p: any) => p.name === promptName)
    // console.log({promptIndex, promptName, p: prompts[promptIndex]})
    if (promptIndex > -1) {
      setActivePrompt(prompts[promptIndex])
    }  
    router.replace(`/demo`)
  }, [prompts])

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

  const createNewPrompt = async (userInput: string) => {
    if (userInput === 'new') {
      const newPrompt = {
        name: `new`,
        description: `Prompt ${prompts.length+1}`,
        prompt: userInput,
        id: `new`,
        created_at: new Date().toISOString(),
      }
      setActivePrompt(newPrompt)
    }

    const prompt = prompts.find((p: any) => p.name === userInput)
    if (prompt) {
      setActivePrompt(prompt)
    }
  }

  return (
    <main className="flex-grow h-full grid grid-cols-3 gap-4 rounded border">
      <div className="border p-2 rounded flex-grow">
        <div>
          <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
            Choose a prompt or create a new one
          </label>
          <select
            id="prompt-selector"
            name="prompt-selector"
            className="mt-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={activePrompt?.name || ""}
            onChange={(e) => createNewPrompt(e.target.value)}
          >
            {prompts.map((prompt: any) => (
              <option key={prompt.name} value={prompt.name}>
                {prompt.name}
              </option>
            ))}
            <option value="new">New prompt</option>
          </select>
        </div>
        
        {activePrompt?.name === 'new' ? 
          <textarea
            rows={10}
            placeholder={`Enter prompt for the ai`}
            className="text-sm w-full min-h-fit whitespace-pre-wrap block border rounded-md bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            value={activePrompt?.prompt || ""}
            onChange={(event) => {
              const newPrompt = {
                name: `new`,
                description: `Prompt ${prompts.length+1}`,
                prompt: event.target.value,
                id: `new`,
                created_at: new Date().toISOString(),
              }

              setActivePrompt(newPrompt)
            }}
          />
          :
          <div className="text-sm whitespace-pre-wrap">
            {activePrompt?.prompt || ""}
          </div>
        }
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
