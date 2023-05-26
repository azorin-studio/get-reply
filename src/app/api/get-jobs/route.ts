import { NextResponse } from 'next/server'
import getJobs from '~/queue/get-jobs'

export const revalidate = 0

export async function POST () {
  if (process.env.NODE_ENV === 'production' && 'Authorization' !== `Bearer ${process.env.GETREPLY_BOT_AUTH_TOKEN}`) {
    return NextResponse.json({ error: 'Auth failed' })
  }

  try {
    const jobs = await getJobs()
    return NextResponse.json(jobs)
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
