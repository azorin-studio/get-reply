import 'xhr_polyfill'
import { serve } from 'std/server'
import { Configuration, CreateCompletionRequest , OpenAIApi } from "openai"

function makePrompt(payload: string, userPrompt: string) {
  return `
- Take the input email below
- Write a follow up that would be sent three days after the original email if there is no response.
- Then write a follow up that will be sent three days after the first follow up. 
- The tone should be casual, friendly and polite.
- The follow ups should refer to the context of the first email 
- The follow ups should be short. 
- Add two newlines after the greeting.
- Add two newlines before the closing.
${userPrompt}
- The follow ups should not be identical.
- The second follow up should mention its the last time you will follow up.
- Do not include any explanations
- Only provide the two follow ups, separated by the string "====SEP===="

input: 

${payload}
`
}

serve(async (req) => {

  let data = {}
  try {
    data = await req.json()
  } catch (err) {}

  const { query = '', userPrompt = '' } = data

  if (!query || query.trim().length === 0) {
    return new Response(JSON.stringify({ error: "Please enter a valid query." }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  try {
    const fullPrompt = makePrompt(query, userPrompt)

    const completionConfig: CreateCompletionRequest = {
      model: "text-davinci-003",
      prompt: fullPrompt,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1024,
      n: 1,
    }

    const completionResponse = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completionConfig)
    })

    const response = (await completionResponse.json()).choices[0].text
    const [email1, email2] = response!.split('====SEP====')
    const emails = [email1.trim(), email2.trim()] 
  
    if (GRAPHJSON_API_KEY) {
      console.log(`Sending generations packet to GRAPHJSON`)
      try {
        await fetch("https://api.graphjson.com/api/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: Deno.env.get('GRAPHJSON_API_KEY'),
            collection: "generations",
            json: JSON.stringify({
              emails, fullPrompt
            }),
            timestamp: Math.floor(new Date().getTime() / 1000),
          })
        })  
      } catch (err: any) {
        console.error(err.message)
      }
    }

    return new Response(JSON.stringify({ emails, fullPrompt }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})