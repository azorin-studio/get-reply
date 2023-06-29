import testEmail from '~/tests/fixtures/routed-full-email.json'
import parseSequenceName from '~/lib/parse-sequence-name'
import parseDelayFromTags from '~/lib/parse-delay-from-tags'

describe('email parser', () => {
  it('should parse the sequence name', () => {
    const address = 'reply@getreply.app'
    testEmail.to = [{ address, name: "" }]
    const { sequenceName } = parseSequenceName({
      to: testEmail.to,
      cc: testEmail.cc,
      bcc: testEmail.bcc,
      headers: testEmail.headers
    })
    expect(sequenceName).toEqual('reply')
  })
  
  it('should parse the sequence name and tag', () => {
    const address = "reply+pc@getreply.app"
    testEmail.to = [{ address, name: "" }]
    const { sequenceName, tags } = parseSequenceName({
      to: testEmail.to,
      cc: testEmail.cc,
      bcc: testEmail.bcc,
      headers: [{
        key: "received",
        value: address
      }]
    })
    expect(sequenceName).toEqual('reply')
    expect(tags).toEqual(['pc'])
  })

  it('should parse the sequence name and multiple tags', () => {
    const address = "reply+pc+4hours@getreply.app"
    testEmail.to = [{ address, name: "" }]
    const { sequenceName, tags } = parseSequenceName({
      to: testEmail.to,
      cc: testEmail.cc,
      bcc: testEmail.bcc,
      headers: [{
        key: "received",
        value: address
      }]
    })
    expect(sequenceName).toEqual('reply')
    expect(tags).toEqual(['pc', '4hours'])
  })

  it.only('should parse the multiple sequences', () => {
    const address = "f+5s+laptop@getreply.app"
    testEmail.to = [
      { address: 'f+5s+laptop@getreply.app', name: '' },
      { address: 'f+15s+laptop@getreply.app', name: '' }
    ]

    const { sequenceName, tags } = parseSequenceName({
      to: testEmail.to,
      cc: testEmail.cc,
      bcc: testEmail.bcc,
      headers: [{
        key: "received",
        value: address
      }]
    })
    expect(sequenceName).toEqual('f')
    expect(tags).toEqual(['5s', 'laptop'])
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
