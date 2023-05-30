import appendToAction from "~/db-admin/append-to-action"
import getActionById from '~/db-admin/get-action-by-id'
import { Action } from '~/db-admin/types'
import { inngest } from '~/queue/inngest-client'

export default async function schedule (action_id: string) {
  let action: Action | null = await getActionById(action_id)

  if (!action) {
    throw new Error(`Action ${action_id} not found`)
  }

  action = await appendToAction(action, {
    status: 'scheduling'
  })

  // turn run date into ms from now
  // https://stackoverflow.com/questions/14980014/how-can-i-calculate-the-time-between-2-dates-in-typescript
  const delay = new Date(action.run_date as string).getTime() - new Date().getTime()
  console.log('delay', delay)

  if (action.name === 'send' || action.name === 'reply') {
    await inngest.send({ name: 'queue/send', data: { action_id: action.id } })
  }

  if (action.name === 'draft') {
    await inngest.send({ name: 'queue/draft', data: { action_id: action.id } })
  }

  action = await appendToAction(action, {
    status: 'scheduled'
  })

  return action
}
