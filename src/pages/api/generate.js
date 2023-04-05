import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const generate = async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    })
    return
  }

  const payload = req.body.payload || ''
  if (payload.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid payload",
      }
    })
    return
  }

  try {
    const prompt = generatePrompt(payload)
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
      const [e1, e2] = response.split('====SEP====')
      res.status(200).json([e1.trim(), e2.trim()])
    } catch (err) {
      throw new Error('Badly formatted response, this happens sometimes, please try again.')
    }
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      res.status(500).json({
        error: {
          message: error.message || 'An error occurred during your request.',
        }
      })
    }
  }
}

function generatePrompt(payload) {
  return `
- Take the input email below
- Write a follow up that would be sent three days after the original email if there is no response.
- Then write a follow up that will be sent three days after the first follow up. 
- The tone should be casual, friendly and polite.
- The follow ups should refer to the context of the first email 
- The follow ups should be short. 
- Add two newlines after the greeting.
- Add two newlines before the closing.
- The follow ups should not be identical.
- The second follow up should mention its the last time you will follow up.
- Do not include any explanations
- Only provide the two follow ups, separated by the string "====SEP===="

input: 

${payload}
`
}

export default generate