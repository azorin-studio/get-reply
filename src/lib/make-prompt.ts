

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

export default makePrompt