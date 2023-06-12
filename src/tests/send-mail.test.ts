import getProfileFromEmail from '~/db-admin/get-profile-from-email'
import { Profile } from '~/db-admin/types'
import sendMail from '~/send-mail'

describe('sendMail', () => {
  let profile: Profile
  
  beforeAll(async () => {
    profile = await getProfileFromEmail('amonecho1@gmail.com')
    if (!profile) {
      throw new Error('No profile found')
    }
  })

  it('check-reply', async () => {
    const messageId = '<CAG9yPc2VUpMRoPBi6oQ4_Eg7bfEgKhWUwVkVSAbxP2+w4oKbUw@mail.gmail.com>'
    await sendMail({
      from: 'reply@getreply.app',
      to: 'amonecho1@gmail.com',
      subject: 'Re: Test',
      textBody: 'Test',
      messageId
    })
  })
})
