import deleteLogById from '~/lib/delete-log-by-id'
import fullEmail from './fixtures/multi-sequence-email.json'
import { processIncomingEmail } from '~/lib/functions'
import getLogById from '~/lib/get-log-by-id'
import { IncomingEmail } from '~/lib/types'

describe('process email', () => {
  let log: any
  
  it('should process one email', async () => {
    if (!process.env.INNGEST_EVENT_KEY) {
      console.log('INNGEST_EVENT_KEY not set, skipping test')
      return
    }

    log = await processIncomingEmail(fullEmail as IncomingEmail)
    log = await getLogById(log.id)
    expect(log).toBeTruthy()
    expect(log.sequence).toBeTruthy()
    expect(log.sequence.name).toBe('30sec')
  })

  afterEach(async () => {
    if (!log) return
    await deleteLogById(log.id!)
  })
})