import 'xhr_polyfill'
import { serve } from 'std/server'
import { Configuration, CreateCompletionRequest , OpenAIApi } from "openai"

serve(async (req) => {
  let data = {}
  try {
    data = await req.json()
  } catch (err) {}

  const { vote, emails } = data

  try {
    await fetch("https://api.graphjson.com/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: Deno.env.get('GRAPHJSON_API_KEY'),
        collection: "ratings",
        json: JSON.stringify({
          vote,
          emails
        }),
        timestamp: Math.floor(new Date().getTime() / 1000),
      })
    })

    return new Response(JSON.stringify({ vote, emails }), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})