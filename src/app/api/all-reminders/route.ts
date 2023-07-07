import { NextResponse } from 'next/server'
import { eventBus } from '~/bus/event-list'

export const revalidate = 0

export async function POST () {
  console.log(`+ ${new Date().toISOString()} all-reminders`)
  const r = await eventBus.allReminders()
  console.log(`- ${new Date().toISOString()} all-reminders`)
  return NextResponse.json(r)
}
