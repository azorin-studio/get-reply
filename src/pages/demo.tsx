import Head from "next/head"
import { useEffect, useState } from "react"
import Footer from "~/components/Footer"
import Header from "~/components/Header"
import EXAMPLES from '~/data/examples'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const DEFAULT_EMAIL = `
Dear Hiring Manager, 

I'm interested in the Frontend Engineering position at your company. As a software developer with 8 years of experience with React, I believe I'd be a great fit for the role at InnovateX. 

Attached is my resume and cover letter for your review. Please let me know if you have any questions.

Best regards,
Mike Smith
`

export default function Home() {
  const [busy, setBusy] = useState<boolean>(false)
  const [result, setResult] = useState<null | { followup1: string, followup2: string }>(null)
  const [error, setError] = useState<null | string>(null)
  const [content, setContent] = useState<string | null>(DEFAULT_EMAIL)

  async function onSubmit(event: any) {
    setBusy(false)
    setError(null)
    event.preventDefault()
    try {
      setBusy(true)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: content }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`)
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
          <Header />
          <main className="container flex-1 p-4">
            <div className="flex flex-row gap-8">
              <form 
                className="basis-1/2 mt-8 flex flex-row lg:flex-col gap-4 "
                onSubmit={onSubmit}
              >
                <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter sm:text-2xl md:text-2xl">Enter your outbound email:</h1>
                <textarea
                  name="email"
                  rows={12}
                  placeholder="Enter the email you want follow ups for"
                  className="p-2 w-full prose prose-sm max-w-full min-h-fit whitespace-pre-wrap block border rounded-md bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  value={content || ""}
                  onChange={(e) => setContent(e.target.value)}
                />
                <input
                  type="submit" 
                  value="Generate"
                  className="inline-flex items-center align-items rounded-md bg-slate-800 py-2 px-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                />
              </form>
              <div className="basis-1/2 mt-8 flex flex-col gap-4">
                <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter sm:text-2xl md:text-2xl">The follow ups that GetReply will generate:</h1>
                {!busy && !error && result && (
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                      <p className="text-slate-700">
                        First follow up that GetReply will generate in your drafts after 3 days, it will mark the thread as unread to bring it to your attention,
                        then you can edit and send as you please:
                      </p>
                      <div className="border rounded p-2 prose-sm whitespace-pre-wrap">
                        {result!.followup1}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <p className="text-slate-700">
                        GetReply will repeat the process if there is not a response after another 3 days, generating a second draft email:
                      </p>
                      <div className="border rounded p-2 prose-sm whitespace-pre-wrap">
                        {result!.followup2}
                      </div>
                    </div>
                  </div>
                )}

                {!busy && !error && !result && (
                  <div>Click the generate button on the left!</div>
                )}
                <div className="text-red-600">{!busy && error}</div>
                <div>{busy && 'Generating follow ups. This can take up to 10 seconds.'}</div>
              </div>
            </div>
          </main>
          <Footer/>
        </div>
      </div>
    </div>
  )
}
