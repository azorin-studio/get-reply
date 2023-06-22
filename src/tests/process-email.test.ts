import deleteLogById from '~/db-admin/delete-log-by-id'
import fullEmail from './fixtures/multi-sequence-email.json'
import { processIncomingEmail } from '~/inngest/functions'
import getLogById from '~/db-admin/get-log-by-id'
import { IncomingEmail } from '~/db-admin/types'

describe('process email', () => {
  let log: any
  
  it('should process one email', async () => {
    log = await processIncomingEmail(fullEmail as IncomingEmail)
    log = await getLogById(log.id)
    expect(log).toBeTruthy()
    expect(log.sequence).toBeTruthy()
    expect(log.sequence.name).toBe('24seconds')
  })

  afterEach(async () => {
    await deleteLogById(log.id!)
  })
})