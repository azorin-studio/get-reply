import { Configuration, OpenAIApi } from "openai"

type UserConstraint = string

export interface FollowUpEmails {
  followUpEmail1: string
  followUpEmail2: string,
  prompt?: string
}

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

export function makePrompt(
  email: string,
  userConstraints: UserConstraint[] | null
): string {
  const escapedUserConstraints = validateAndEscapeConstraints(userConstraints)

  const pv2 = `
Hi GPT-3.5, I need your help to create two follow-up emails based on the given email text. The first follow-up email should be sent 3 days after the original email, and the second follow-up email should be sent 6 days after the original email. Please ensure that the follow-up emails:

1. Maintain a casual, friendly, and polite tone.
2. Refer to the context of the original email.
3. Are short in length.
4. Are not identical to each other.
5. Include a mention in the second follow-up email that it's the last time you will follow up.
${userConstraints ? userConstraints.length > 0 && 
`
Additionally, please consider the following user-defined constraints:
${escapedUserConstraints}

` : ''}
Here is the email text:

"${email}"

Please provide the two follow-up emails, separated by the custom delimiter "@@@FOLLOW_UP_EMAILS_DELIMITER@@@". Do not include explanations like "Follow-up Email 1:" or "Follow-up Email 2:" in your response:

[Your response for followUpEmail1 here]
@@@FOLLOW_UP_EMAILS_DELIMITER@@@
[Your response for followUpEmail2 here]
`
  return pv2
}

export async function callGPT35Api(prompt: string, retries = 3, delay = 1000): Promise<FollowUpEmails> {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const openai = new OpenAIApi(configuration)

  if (!configuration.apiKey) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md")
  }

  try {
    // console.log(`PROMPT:\n\n${prompt}\n\nEND PROMPT`)
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
    // console.log({ completionOptions })
    const completion = await openai.createCompletion(completionOptions)
    
    const response = completion.data.choices[0].text
    const delimiter = '@@@FOLLOW_UP_EMAILS_DELIMITER@@@'
    // console.log(`RESPONSE:\n\n${response}\n\nEND RESPONSE`)

    if (response!.includes(delimiter)) {
      let [followUpEmail1, followUpEmail2] = response!.split(delimiter)
  
      // Remove unwanted explanations (e.g., "Follow-up Email 1:")
      followUpEmail1 = followUpEmail1.replace(/Follow-up Email 1:/i, '').trim()
      followUpEmail2 = followUpEmail2.replace(/Follow-up Email 2:/i, '').trim()

      return {
        followUpEmail1: followUpEmail1.trim(),
        followUpEmail2: followUpEmail2.trim(),
      }
    } else {
      // Handle the error (e.g., log it, return a default value, or throw a custom error)
      // console.error('Error parsing GPT-3.5 response: Delimiter not found')
      throw new Error('Error parsing GPT-3.5 response')
    }

  } catch(error: any) {
    if (retries > 0) {
      console.warn('Error in callGPT35Api, retrying:', error)
      await sleep(delay)
      return callGPT35Api(prompt, retries - 1, delay)
    } else {
      // Handle the error (e.g., log it, return a default value, or throw a custom error)
      console.error('Error in callGPT35Api, no more retries', error)
      throw new Error('Error parsing GPT-3.5 response after multiple retries')
    }
  }
}

export async function generateFollowUps(
  email: string,
  userConstraints: UserConstraint[] | null,
  retries = 3
): Promise<FollowUpEmails> {
  const prompt = makePrompt(email, userConstraints)
  const followUpEmails = await callGPT35Api(prompt, retries)
  return { ...followUpEmails, prompt }
}

