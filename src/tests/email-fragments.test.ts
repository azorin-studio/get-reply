import replyParser from "node-email-reply-parser"
import testEmail from '~/tests/test-email.json'

describe('email-fragment-parser (efp)', () => {
  it('should split the thread intro a list of messages', () => {    
    // replace all > with empty string
    const messages = replyParser(testEmail.text).getFragments().map((fragment: any) => fragment.getContent().replace(/>/g, ''))
    expect(messages.length).toBe(4)
  })
})
