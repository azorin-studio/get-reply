import testEmail from '~/tests/fixtures/routed-full-email.json'
import parseSequenceName from '~/lib/parse-sequence-name'
import { IncomingEmail } from '~/lib/types'

import { text as forwardedText } from '~/tests/fixtures/forwarded-email.json'
import emailToPrompt from "~/lib/email-to-prompt"

describe('email-parser', () => {
  it.skip('should split the thread intro a list of messages', () => {    
    const fullPrompt = emailToPrompt(testEmail.text, `{email}`)
    expect(fullPrompt.trim().startsWith('---------- Forwarded message ---------')).toEqual(false)
  })

  it.skip('should split the forwarded thread intro a list of messages', () => {    
    const fullPrompt = emailToPrompt(forwardedText, `{email}`)
    console.log(fullPrompt)
    expect(fullPrompt.trim().startsWith('---------- Forwarded message ---------')).toEqual(false)
  })

  it('should parse the sequence name from the address', () => {
    testEmail.to = [{ "address": "reply@getreply.app","name": "" }]
    const { sequenceName } = parseSequenceName(testEmail as IncomingEmail)
    expect(sequenceName).toEqual('reply')
  })

  it('should parse the sequence name address', () => {
    testEmail.to = [{ "address": "reply@getreply.app","name": "" }]
    const { sequenceName, tags } = parseSequenceName(testEmail as IncomingEmail)
    expect(sequenceName).toEqual('reply')
  })
})
