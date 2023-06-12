import getProfileFromEmail from '~/db-admin/get-profile-from-email'
import { Profile } from '~/db-admin/types'
import { createGmailDraftInThread, getThreadById, sendDraft } from '~/google'

describe('e2e', () => {
  let profile: Profile
  
  beforeAll(async () => {
    profile = await getProfileFromEmail('amonecho1@gmail.com')
    if (!profile) {
      throw new Error('No profile found')
    }
  })

  it.only('check-reply', async () => {
    const messageId = '<CAG9yPc2oiid6KhmRp=2w6Sqi-_hV4k95=Kxu_Sbj7Mi=2tU3eg@mail.gmail.com>'
    const threadId = '188afabc31ce312e'

    const thread = await getThreadById(threadId, profile.google_refresh_token!)
    const { messages } = thread.data

    console.log(JSON.stringify(messages, null, 2))

    const replyMessage = messages.find((message: any) => {
      return message.payload.headers.find((header: any) => {
        console.log(header.name, header.value, messageId, header.name === 'In-Reply-To', header.value === messageId)
        return header.name === 'In-Reply-To' && header.value === messageId
      })
    })

    console.log({ replyMessage })
  })

  it('should use gmail to hit haiku sequence then check for response within 5 minutes', async () => {
    const r = Math.random().toString(36).slice(2, 7)

    const draft = await createGmailDraftInThread(
      [{ address: 'haiku@getreply.app', name: '' }], 
      { address: 'amonecho1@gmail.com', name: '' },
      `${r}`, 
      `Write me a haiku!`, 
      null,
      profile.google_refresh_token!
    )

    const { data } = await sendDraft(draft.id!, profile.google_refresh_token!)
    const message = data
    
    if (!message.threadId) {
      throw new Error('Cant find thread after sending draft.')
    }

    const thread = await getThreadById(message.threadId, profile.google_refresh_token!)
    const { messages } = thread.data

    const selfMessage = messages.find((m: any) => m.id === message.id)

    if (!selfMessage) {
      throw new Error('Cant find message in thread after sending draft.')
    }

    console.log(JSON.stringify(message, null, 2))
    console.log(JSON.stringify(messages, null, 2))
  })
})
