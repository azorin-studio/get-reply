import { UserConstraint, validateAndEscapeConstraints } from "./chat-gpt"

export function defaultPrompt(
  email: string,
): string {
  
  const prompt = `
Hi GPT-3.5, I need your help to create a follow-up email based on the given email text. The follow-up email should be sent 3 days after the original email. Please ensure that the follow-up email:

1. Maintain a casual, friendly, and polite tone.
2. Refer to the context of the original email.
3. Is short in length.
4. Do not include explanations like "Follow-up Email:"
Here is the email text:

"${email}"
`
  return prompt.trim()
}

export function makeFollowUp1Prompt(
  email: string,
  userConstraints: UserConstraint[] | null
): string {
  const escapedUserConstraints = validateAndEscapeConstraints(userConstraints)
  
  const prompt = `
Hi GPT-3.5, I need your help to create a follow-up email based on the given email text. The follow-up email should be sent 3 days after the original email. Please ensure that the follow-up email:

1. Maintain a casual, friendly, and polite tone.
2. Refer to the context of the original email.
3. Is short in length.
${userConstraints ? userConstraints.length > 0 && 
`
Additionally, please consider the following user-defined constraints:
${escapedUserConstraints}
` : ''}
Here is the email text:

"${email}"

Do not include explanations like "Follow-up Email:"
`
  return prompt
}

export function makeFollowUp2Prompt(
  email: string,
  userConstraints: UserConstraint[] | null
): string {
  const escapedUserConstraints = validateAndEscapeConstraints(userConstraints)

  const prompt = `
Hi GPT-3.5, I need your help to create a second follow-up email based on the given email text. Assume the first follow up already exists. The second follow-up email should be sent 6 days after the original email. Please ensure that the follow-up email:

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
`
  return prompt
}