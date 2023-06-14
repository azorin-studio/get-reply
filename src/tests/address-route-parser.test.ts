import testEmail from '~/tests/test-email.json'
import parseSequenceName from '~/inngest/parse-sequence-name'
import { IncomingEmail } from '~/db-admin/types'

describe('address-route-parser', () => {
  it('should parse the sequence name from the address', () => {
    testEmail.to = [{
      "address": "reply@getreply.app",
      "name": ""
    }]

    const { sequenceName } = parseSequenceName(testEmail as IncomingEmail)
    expect(sequenceName).toEqual('reply')
  })

  it('should parse the sequence name address', () => {
    testEmail.to = [{
      "address": "reply+pc@getreply.app",
      "name": ""
    }]

    const { sequenceName, tags } = parseSequenceName(testEmail as IncomingEmail)
    expect(sequenceName).toEqual('reply')
    expect(tags).toEqual(['pc'])
    expect(tags.includes('pc')).toEqual(true)
  })
})
