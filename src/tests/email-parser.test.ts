import testEmail from '~/tests/fixtures/routed-full-email.json'
import parseSequenceName from '~/inngest/parse-sequence-name'
import { IncomingEmail } from '~/db-admin/types'

import { text as forwardedText } from '~/tests/fixtures/forwarded-email.json'
import emailToPrompt from "~/lib/email-to-prompt"

describe('email-parser', () => {
  it('should split the thread intro a list of messages', () => {    
    const fullPrompt = emailToPrompt(testEmail.text, `{email}`)
  })

  it('should split the forwarded thread intro a list of messages', () => {    
    const fullPrompt = emailToPrompt(forwardedText, `{email}`)
    console.log(fullPrompt)
  })

  it('should parse the sequence name from the address', () => {
    testEmail.to = [{ "address": "reply@getreply.app","name": "" }]
    const { sequenceName } = parseSequenceName(testEmail as IncomingEmail)
    expect(sequenceName).toEqual('reply')
  })

  it('should parse the sequence name address', () => {
    testEmail.to = [{ "address": "reply+pc@getreply.app","name": "" }]
    const { sequenceName, tags } = parseSequenceName(testEmail as IncomingEmail)
    expect(sequenceName).toEqual('reply')
    expect(tags).toEqual(['pc'])
    expect(tags.includes('pc')).toEqual(true)
  })
})
