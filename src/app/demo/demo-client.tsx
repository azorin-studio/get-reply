"use client"

import { Loader } from "lucide-react"
import Head from "next/head"
import { useState } from "react"
import fetch from 'isomorphic-fetch'
import Footer from "~/components/Footer"
import Header from "~/components/Header"
import ms from "ms"
import RatingButtons from "~/components/RatingButtons"

const DEFAULT_EMAIL = `Dear Hiring Manager, 

I'm interested in the Frontend Engineering position at your company. As a software developer with 8 years of experience with React, I believe I'd be a great fit for the role at InnovateX. 

Attached is my resume and cover letter for your review. Please let me know if you have any questions.

Best regards,
Mike Smith`

const DEFAULT_RESULT = null
// const DEFAULT_RESULT = ['a', 'b']

export default function DemoPage() {
const [busy, setBusy] = useState<boolean>(false)
const [result, setResult] = useState<null | string[]>(DEFAULT_RESULT)
const [timer, setTimer] = useState<null | string>(null)
const [error, setError] = useState<null | string>(null)
const [content, setContent] = useState<string | null>(DEFAULT_EMAIL)
const [userPrompt, setUserPrompt] = useState<string>('')

async function onSubmit(event: any) {
  setBusy(false)
  setError(null)
  setTimer(null)
  event.preventDefault()
  try {
    setBusy(true)
    const t1 = new Date()
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: content, userPrompt }),
    })
    const t2 = new Date()
    setTimer(ms(t2.getTime()-t1.getTime()))

    const { data, error } = await response.json()
    console.log(response)
    if (response.status !== 200) {
      throw error || new Error(`Request failed with status ${response.status}`)
    }

    setResult(data)
    // setContent("")
    setBusy(false)
  } catch(error: any) {
    // Consider implementing your own error handling logic here
    setBusy(false)
    console.error(error)
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
        <main className="container flex-1 p-4">
          <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 mx-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  GetReply is still in alpha, if you get an error while generating follow ups below, just try again. 
                </p>
                <p className="text-sm text-yellow-700 mt-4">
                  We are pushing improvements regularly.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 p-8">
            
            <form className="basis-1/2 flex flex-col gap-4"
              onSubmit={onSubmit}
            >
              <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter sm:text-2xl md:text-2xl">
                Write a sample email to test our follow ups
              </h1>
              <p className="text-slate-700 text-sm">
                Normally you just bcc GetReply in your outbound email, making it simple to integrate with your workflow. Here you can
                enter a sample email to test what follow ups GetReply would generate.
              </p>
              <div>
                <div
                  className="p-2 w-full max-w-full min-h-fit whitespace-pre-wrap block border-x border-t rounded-t-md text-xs bg-slate-50"
                >
                  to: {'to@example.com'}, bcc: <span className="italic font-semibold">{'followup@getreply.app'}</span>
                </div>
                <div
                  className="p-2 w-full max-w-full min-h-fit whitespace-pre-wrap block border-x border-t  text-xs bg-slate-50"
                >
                  Subject: Checking in
                </div>
                <textarea
                  name="email"
                  rows={10}
                  placeholder="Enter the email you want follow ups for"
                  className="p-2 w-full prose prose-sm max-w-full min-h-fit whitespace-pre-wrap block border rounded-b-md bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  value={content || ""}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <textarea
                name="userPrompt"
                rows={5}
                placeholder={`Enter custom prompts rules for the ai in a list separated by '-', example:\n\n- use the word "wow" a few times`}
                className="p-2 w-full prose prose-sm max-w-full min-h-fit whitespace-pre-wrap block border rounded-md bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={userPrompt || ""}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              <button
                type="submit" 
                value="Generate"
                className="inline-flex gap-2 items-center h-12 justify-center align-items rounded-md bg-slate-800 py-2 px-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {/* {busy && <Loader className="animate-spin" />} */}
                {busy ? 'Generating' : 'Generate'}
              </button>
            </form>
            <div className="basis-1/2 flex flex-col gap-4">
              <div className="flex flex-row justify-between items-center">
                <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter sm:text-2xl md:text-2xl">
                  GetReply will draft follow ups.
                </h1>
                <RatingButtons 
                  disabled={!(!busy && !error && result?.length)}
                  result={result}
                />
              </div>
              {!busy && !error && result?.length && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <p className="text-slate-700 text-sm">
                      After a few days GetReply will draft a follow up for you, and mark the thread as unread to bring it to your attention, then you edit and send.
                    </p>
                    <div className="border bg-slate-100 rounded prose-sm whitespace-pre-wrap">
                      <div className="border-b p-1 text-xs px-2 text-slate-500 align-items justify-end">
                        Generation took {timer}
                      </div>
                      <div className="p-2" data-testid="followup1">
                        {result[0]} 
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <p className="text-slate-700 text-sm">
                      GetReply will repeat the process if there is not a response after another few days.
                    </p>
                    <div className="border bg-slate-100 rounded p-2 prose-sm whitespace-pre-wrap" data-testid="followup2">
                      {result[1]}
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
                    Generating follow ups. This can take up to 10 seconds.
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
