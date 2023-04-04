import Head from "next/head"
import { useState } from "react"

export default function Home() {
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState()

  async function onSubmit(event) {
    setBusy(false)
    event.preventDefault()
    try {
      setBusy(true)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`)
      }

      setResult(data.result)
      setInput("")
      setBusy(false)
    } catch(error) {
      // Consider implementing your own error handling logic here
      setBusy(false)
      console.error(error)
      setResult(error.message)
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main
        className="min-h-screen bg-white font-sans text-slate-800 antialiased"
      >
        <div className="flex min-h-screen flex-col">
        <section className="container w-1/2 grid items-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24">
          <form 
            className="flex flex-col gap-4"
            onSubmit={onSubmit}
          >
            <textarea
              name="input"
              placeholder="Enter a prompt"
              className="block flex-1 border rounded-md bg-transparent py-2 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <input 
              type="submit" 
              value="Generate"
              className="inline-flex items-center align-items rounded-md bg-slate-800 py-2 px-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />
          </form>
          {busy && 'busy'}
          <div>{result}</div>
        </section>
        </div>
      </main>
    </div>
  )
}
