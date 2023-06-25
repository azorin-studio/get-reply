import deleteLogById from '~/lib/delete-log-by-id'
import { IncomingEmail } from '~/lib/types'
import createActions from '~/lib/processes/create-actions'
import createLog from '~/lib/create-log'
import createTestEmail from './create-test-email'
import { parseISO } from 'date-fns'

describe('process email', () => {
  it('should parse 1second delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+1second@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 1 * 1000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 5seconds delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+5seconds@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 5 * 1000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 10sec delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+10sec@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 10 * 1000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 7s delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+7s@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 7 * 1000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 1minute delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+1minute@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 1 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 5minutes delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+5minutes@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 5 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 19min delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+19min@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 19 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 2m delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+2m@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 2 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 1hour delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+1hour@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 2hours delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+2hours@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 2 * 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 4hrs delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+4hrs@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 4 * 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 7h delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+7h@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 7 * 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 1day delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+1day@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 1 * 24 * 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 3days delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+3days@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

  it('should parse 8d delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: ['reply+8d@getreply.app'],
      date: now.toISOString()
    })

    const log: any = await createLog(email as IncomingEmail)
    const { actions } = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 8 * 24 * 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(log.id!)
  })

})