import { Configuration, OpenAIApi } from "openai"

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function callGPT35Api(prompt: string, retries = 3, delay = 1000): Promise<string> {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const openai = new OpenAIApi(configuration)

  if (!configuration.apiKey) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md")
  }

  try {
    const completionOptions = {
      model: "gpt-4",
      // prompt,
      messages: [{ role:"user", content: prompt }],
      // messages: [{role: "user", content: "Hello world"}],
      
      // top_p: 1,
      // frequency_penalty: 0,
      // presence_penalty: 0,
      // max_tokens: 1024,
      // n: 1,
    }
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      temperature: 0.5,
      max_tokens: 1024,
      n:1,
      messages: [{ role:"user", content: prompt }]
    })
    
    const response = completion.data.choices[0].message?.content.trim()
    if (response) {
      return response
    } else {
      throw new Error('Empty response from GPT-3.5')
    }
  } catch(error: any) {
    const errMsg = error.response?.data?.error.message || error.message
    if (retries > 0) {
      console.warn(`Error in callGPT35Api, ${retries-1} tries remaining. Trying again.`)
      await sleep(delay)
      return callGPT35Api(prompt, retries - 1, delay)
    } else {
      // Handle the error (e.g., log it, return a default value, or throw a custom error)
      console.error(`Error in callGPT35Api, 0 tries remaining. Terminating.`)
      console.error(errMsg)
      throw new Error(errMsg)
    }
  }
}

