import { NextResponse } from 'next/server'
import { eventBus } from '~/bus/event-list'

export const revalidate = 0

export async function POST () {
  return NextResponse.json(
    await eventBus.allReminders()
  )
}
