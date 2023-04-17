import getUser from '~/lib/get-user'
import '@testing-library/jest-dom'

describe('Supabase', () => {
  test('gets user from supabase', async () => {
    // https://github.com/supabase/supabase/issues/347
    // https://github.com/vercel/nextjs-subscription-payments/blob/main/schema.sql#L1-L17
    const { profile } = await getUser()   
    console.log(JSON.stringify(profile, null, 2))
  })
})