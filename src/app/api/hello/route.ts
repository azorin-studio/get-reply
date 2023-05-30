import { NextResponse } from 'next/server'
import { inngest } from '~/inngest/client'

export const revalidate = 0

export async function GET (request: Request) {
  await inngest.send({
    name: "test/hello.world",
    data: {
      email: "test@example.com",
    },
  });

  return NextResponse.json({ name: "Hello Inngest!" })
}
