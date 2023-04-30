import { Configuration, OpenAIApi } from "openai"

export type UserConstraint = string

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function validateAndEscapeConstraints(
  constraints: UserConstraint[] | null,
  maxConstraints: number = 5,
  maxConstraintLength: number = 100
): string {
  if (!Array.isArray(constraints) || constraints.length > maxConstraints) {
    return '' // Return an empty string if the input is invalid or exceeds the maximum number of constraints
  }

  return constraints
    .map(constraint => {
      if (typeof constraint !== 'string' || constraint.length > maxConstraintLength) {
        return null // Skip constraints that are not strings or exceed the maximum character limit
      }

      // Remove potentially malicious content (e.g., HTML tags or script tags)
      const sanitizedConstraint = constraint.replace(/<[^>]*>?/gm, '')

      // Escape special characters
      const escapedConstraint = sanitizedConstraint.replace(/["\\]/g, '\\$&')

      return escapedConstraint
    })
    .filter(constraint => constraint !== null) // Remove any skipped constraints
    .join('\n')
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
      model: "text-davinci-003",
      prompt,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1024,
      n: 1,
    }
    const completion = await openai.createCompletion(completionOptions)
    
    const response = completion.data.choices[0].text
    if (response) {
      console.log(`GPT-3.5 response: ${response}`)
      return response
    } else {
      throw new Error('Empty response from GPT-3.5')
    }
  } catch(error: any) {
    if (retries > 0) {
      console.warn(`Error in callGPT35Api, ${retries-1} tries remaining. Trying again.`, error)
      await sleep(delay)
      return callGPT35Api(prompt, retries - 1, delay)
    } else {
      // Handle the error (e.g., log it, return a default value, or throw a custom error)
      console.error(`Error in callGPT35Api, 0 tries remaining. Terminating.`, error)
      throw new Error('Error parsing GPT-3.5 response after multiple retries')
    }
  }
}

