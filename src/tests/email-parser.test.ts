import testEmail from '~/tests/fixtures/routed-full-email.json'
import parsePromptNamesAndTags from '~/lib/parse-prompt-names-and-tags'
import parseDelayFromTags from '~/lib/parse-delay-from-tags'

describe('email parser', () => {
  it('should parse the sequence name', () => {
    const address = 'reply@getreply.app'
    testEmail.to = [{ address, name: "" }]
    const promptNamesAndTags = parsePromptNamesAndTags({
      to: testEmail.to,
      cc: testEmail.cc,
      bcc: testEmail.bcc
    })
    expect(promptNamesAndTags[0].promptName).toEqual('reply')
  })
  
  it('should parse the sequence name and tag', () => {
    const address = "reply+pc@getreply.app"
    testEmail.to = [{ address, name: "" }]
    const promptNamesAndTags = parsePromptNamesAndTags({
      to: testEmail.to,
      cc: testEmail.cc,
      bcc: testEmail.bcc
    })
    expect(promptNamesAndTags[0].promptName).toEqual('reply')
    expect(promptNamesAndTags[0].tags).toEqual(['pc'])
  })
    
  it('should parse the sequence name and tag', () => {
    const address = "reply+pc+4hours@getreply.app"
    testEmail.to = [{ address, name: "" }]
    const promptNamesAndTags = parsePromptNamesAndTags({
      to: testEmail.to,
      cc: testEmail.cc,
      bcc: testEmail.bcc
    })
    expect(promptNamesAndTags[0].promptName).toEqual('reply')
    expect(promptNamesAndTags[0].tags).toContain('pc')
    expect(promptNamesAndTags[0].tags).toContain('4hours')
  })

  it('should parse the sequence name and tag', () => {
    testEmail.to = [
      { address: 'f+5s+laptop@getreply.app', name: '' },
      { address: 'g+15s+laptop@getreply.app', name: '' }
    ]
    const promptNamesAndTags = parsePromptNamesAndTags({
      to: testEmail.to,
      cc: testEmail.cc,
      bcc: testEmail.bcc
    })
    expect(promptNamesAndTags[0].promptName).toEqual('f')
    expect(promptNamesAndTags[0].tags).toContain('laptop')
    expect(promptNamesAndTags[0].tags).toContain('5s')
    expect(promptNamesAndTags[1].promptName).toEqual('g')
    expect(promptNamesAndTags[1].tags).toContain('laptop')
    expect(promptNamesAndTags[1].tags).toContain('15s')
  })

  it('should parse 4hours delay from tags', () => {
    const { delay, delayUnit } = parseDelayFromTags(['pc', '4hours'])
    expect(delay).toEqual(4)
    expect(delayUnit).toEqual('hours')
  })

  it('should parse no delay from tags', () => {
    const { delay, delayUnit } = parseDelayFromTags(['pc'])
    expect(delay).toEqual(null)
    expect(delayUnit).toEqual(null)
  })

  it('should parse 30min delay from tags', () => {
    const { delay, delayUnit } = parseDelayFromTags(['pc', '30min', '4hours'])
    expect(delay).toEqual(30)
    expect(delayUnit).toEqual('minutes')
  })
})
