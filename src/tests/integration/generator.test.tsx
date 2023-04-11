import generate from '~/lib/generate'
import EXAMPLE from '~/data/examples'
import '@testing-library/jest-dom'

const EXAMPLE_EMAIL = `
Dear Maria, 

I'm interested in the Stuntman position at your company. As a software developer with 8 years of experience with React, I know nothing
about being a stuntman, but I'll try anyway.

Attached is my resume and cover letter for your review. Please let me know if you have any questions.

Best regards,
John
`

const EXAMPLE_USER_PROMPT = `
- use the word "wow" a few times
`

describe('Generate', () => {
  test.concurrent.each(Array(10).fill(null))('generates prompt from OpenAI', async () => {
    const { data } = await generate(EXAMPLE_EMAIL, EXAMPLE_USER_PROMPT)
    
    expect(data).toHaveLength(2)
    expect(data[0]).not.toContain('====SEP====')
    expect(data[1]).not.toContain('====SEP====')
    expect(data[0]).not.toBe('')
    expect(data[1]).not.toBe('')
    expect(data[0]).toContain('wow')
    expect(data[1]).toContain('wow')
    console.log(data[0])
    console.log(data[1])
  }, 15000)
  
})