import { generateFollowUpEmails, callGPT35Api, validateAndEscapeConstraints, FollowUpEmails } from './generate-follow-ups' // Adjust the import path as needed

// Mock the API call
jest.mock('./generate-follow-ups', () => {
  const actualModule = jest.requireActual('./generate-follow-ups')
  return {
    ...actualModule,
    callGPT35Api: jest.fn(),
  }
})

describe('GPT', () => {
  const sampleEmail = 'Sample email text';
  const sampleConstraints: string[] = ['Add humor', 'Mention a recent success'];

  it('returns follow-up emails when provided with valid input', async () => {
    const result = await generateFollowUpEmails(sampleEmail, sampleConstraints);

    expect(result).toHaveProperty('followUpEmail1')
    expect(result).toHaveProperty('followUpEmail2')
    expect(result).toHaveProperty('prompt')

  }, 60000);

  it('returns an empty string when the input is invalid', () => {
    const input = 'not an array'
    const result = validateAndEscapeConstraints(input as any)
    expect(result).toBe('')
  })

  it('returns an empty string when the input exceeds the maximum number of constraints', () => {
    const input = ['constraint 1', 'constraint 2', 'constraint 3', 'constraint 4', 'constraint 5', 'constraint 6']
    const result = validateAndEscapeConstraints(input)
    expect(result).toBe('')
  })

  it('returns a filtered and escaped string for valid input', () => {
    const input = [
      'Add a touch of "humor".',
      'Mention the success of a recent project.',
      'Include a deadline for the meeting.',
      'This constraint is too long and should be skipped: ' + 'a'.repeat(101),
      123, // This non-string constraint should be skipped
    ]
    const result = validateAndEscapeConstraints(input as any)
    const expectedResult = 'Add a touch of \\"humor\\".\nMention the success of a recent project.\nInclude a deadline for the meeting.'
    expect(result).toBe(expectedResult)
  })
})
