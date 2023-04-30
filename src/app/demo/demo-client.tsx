"use client"

import { Loader } from "lucide-react"
import Head from "next/head"
import { useState } from "react"
import fetch from 'isomorphic-fetch'
import ms from "ms"
import { defaultPrompt } from '~/prompts'

const DEFAULT_EMAIL = `Dear Hiring Manager, 

I'm interested in the Frontend Engineering position at your company. As a software developer with 8 years of experience with React, I believe I'd be a great fit for the role at InnovateX. 

Attached is my resume and cover letter for your review. Please let me know if you have any questions.

Best regards,
Mike Smith`

const DEFAULT_RESULT = null

export default function DemoPage() {
const [busy, setBusy] = useState<boolean>(false)
const [result, setResult] = useState<null>(DEFAULT_RESULT)
const [timer, setTimer] = useState<null | string>(null)
const [error, setError] = useState<null | string>(null)
const [content, setContent] = useState<string | null>(DEFAULT_EMAIL)
const [prompt, setPrompt] = useState<string>(defaultPrompt('<your_email_will_go_here>'))

async function onSubmit(event: any) {
  setBusy(false)
  setError(null)
  setTimer(null)
  event.preventDefault()

  try {
    if (!content) {
      throw new Error('Please enter some text')
    }
    const fullPrompt = prompt.replace('<your_email_will_go_here>', content)
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
    // Consider implementing your own error handling logic here
    setBusy(false)
    console.warn(error)
    setError(error.message)
  }
}

return (
  <div>
    <Head>
      <title>OpenAI Quickstart</title>
      <link rel="icon" href="/dog.png" />
    </Head>

    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-4">
          <div className="flex flex-col lg:flex-row gap-8 p-8"> 
            <form className="basis-1/2 flex flex-col gap-4"
              onSubmit={onSubmit}
            >
              <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter sm:text-2xl md:text-2xl">
                Test the prompt
              </h1>
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
              <textarea
                name="constraints"
                rows={5}
                placeholder={`Enter prompt for the ai`}
                className="p-2 w-full prose prose-sm max-w-full min-h-fit whitespace-pre-wrap block border rounded-md bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={prompt || ""}
                onChange={(event) => {
                  const userInput = event.target.value
                  setPrompt(userInput)
                }}
              />
              <button
                type="submit" 
                value="Generate"
                className="inline-flex gap-2 items-center h-12 justify-center align-items rounded-md bg-slate-800 py-2 px-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {busy ? 'Generating' : 'Generate'}
              </button>
            </form>
            <div className="basis-1/2 flex flex-col gap-4 mt-12">
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
          </div>
        </main>

      </div>
    </div>
  </div>
)
}
