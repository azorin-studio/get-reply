import generate from '~/lib/generate'
import EXAMPLE from '~/data/examples'
import '@testing-library/jest-dom'

const EXAMPLE_EMAIL = EXAMPLE['hiring'].emails[0]

describe('Generate', () => {
  it('generates prompt from OpenAI', async () => {
    const { data } = await generate(EXAMPLE_EMAIL)
    console.log(data)
    expect(data).toHaveLength(2)
    expect(data[0]).toContain('Dear Hiring Manager,')
    expect(data[0]).toContain('Mike Smith')
    expect(data[1]).toContain('Dear Hiring Manager,')
    expect(data[1]).toContain('Mike Smith')
  }, 15000)
})