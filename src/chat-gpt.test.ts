import testEmail from '~/data/test-email.json'
import { Profile, type IncomingEmail } from '~/types'
import { getProfileFromEmail } from './supabase'
import { callGPT35Api } from './chat-gpt'
import { makeFollowUp1Prompt, makeFollowUp2Prompt } from './prompts'

jest.mock('./chat-gpt')

describe('chat-gpt', () => {
  let profile: Profile | null

  if (testEmail.attachments) {
    delete (testEmail as IncomingEmail).attachments
  }

  beforeAll(async () => {
    profile = await getProfileFromEmail(testEmail.from.address)
    if (!profile) {
      throw new Error(`Test user ${testEmail.from.address} profile not found. Its required for process tests to run.`)
    }
  })

  it('Creates first follow up email', async () => {
    // ts-ignore
    callGPT35Api.mockResolvedValue('follow up 1 text content')
    const prompt = makeFollowUp1Prompt(testEmail.text, profile!.user_constraints)
    const response = await callGPT35Api(prompt, 3)
    expect(response).toBe(await callGPT35Api.mock.results[0].value)
  })

  it('Creates first follow up email', async () => {
    // ts-ignore
    callGPT35Api.mockResolvedValue('follow up 2 text content')
    const prompt = makeFollowUp2Prompt(testEmail.text, profile!.user_constraints)
    const response = await callGPT35Api(prompt, 3)
    expect(response).toBe(await callGPT35Api.mock.results[1].value)
  })

})
