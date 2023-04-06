import { Configuration, OpenAIApi } from "openai"
import makePrompt  from "./make-prompt"

export type Data = {
  error?: {
    message: string
  },
  data?: string[]
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const generate = async function<Data> (payload: string) {
  if (!configuration.apiKey) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md")
  }

  try {
    const prompt = makePrompt(payload)
    console.log(`PROMPT:\n\n${prompt}\n\n`)

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1024,
      n: 1,
    })
    const response = completion.data.choices[0].text
    console.log(`RESPONSE:\n\n${response}\n\n`)
    
    try {
      const [e1, e2] = response!.split('====SEP====')
      return { data: [e1.trim(), e2.trim()] }
    } catch (err) {
      throw new Error('Badly formatted response, this happens sometimes, please try again.')
    }

  } catch(error: any) {
    if (error.response) {
      throw new Error(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      throw new Error(error.message || 'An error occurred during your request.')
    }
  }
}

export default generate