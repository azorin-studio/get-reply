import appendToAction from "~/db-admin/append-to-action"
import getActionById from '~/db-admin/get-action-by-id'
import { Action } from '~/db-admin/types'
import { queue } from '~/queue/queue'

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
  const delay = new Date(action.run_date).getTime() - new Date().getTime()
  console.log('delay', delay)

  if (action.name === 'send' || action.name === 'reply') {
    await queue.add('send', { actionId: action.id }, { delay })
  }

  if (action.name === 'draft') {
    await queue.add('draft', { actionId: action.id }, { delay })
  }

  action = await appendToAction(action, {
    status: 'scheduled'
  })

  return action
}
