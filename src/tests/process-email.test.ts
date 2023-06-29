import deleteLogById from '~/supabase/delete-log-by-id'
import { IncomingEmail } from '~/supabase/types'
import createActions from '~/inngest/jobs/create-actions'
import createLog from '~/supabase/create-log'
import createTestEmail from './create-test-email'
import { parseISO } from 'date-fns'
import supabaseAdminClient from '~/supabase/supabase-admin-client'

describe.skip('process email', () => {
  it('should parse 1second delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+1second+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    email.messageId = now.toISOString()
    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 1 * 1000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 5seconds delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+5seconds+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 5 * 1000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 10sec delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+10sec+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 10 * 1000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 7s delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+7s+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 7 * 1000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 1minute delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+1minute+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 1 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 5minutes delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+5minutes+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 5 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 19min delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+19min+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 19 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 2m delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+2m+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 2 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 1hour delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+1hour+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 2hours delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+2hours+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 2 * 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 4hrs delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+4hrs+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 4 * 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 7h delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+7h+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 7 * 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 1day delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+1day+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 1 * 24 * 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 3days delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+3days+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

  it('should parse 8d delay', async () => {
    const now = new Date()
    const email = createTestEmail({
      toAddresses: [`f+8d+${process.env.EMAIL_ROUTING_TAG}@getreply.app`],
      date: now.toISOString()
    })

    const log: any = await createLog(supabaseAdminClient, email as IncomingEmail)
    const actions = await createActions(log.id)

    expect(actions.length).toBe(1)
    const tagFromNow = new Date(now.getTime() + 8 * 24 * 60 * 60000)
    expect(parseISO(actions[0].run_date!).getTime()).toEqual(tagFromNow.getTime())
    await deleteLogById(supabaseAdminClient, log.id!)
  })

})