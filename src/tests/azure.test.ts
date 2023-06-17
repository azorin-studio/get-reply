import 'isomorphic-fetch'
import * as graph from '@microsoft/microsoft-graph-client'
import getProfileFromEmail from '~/db-admin/get-profile-from-email'
import { Profile } from '~/db-admin/types'
import { refreshAccessToken } from '~/azure'

const from = 'eoin@kyso.io'

describe('azure', () => {
  it.only('should use office', async () => {
    const profile: Profile = await getProfileFromEmail(from)
    if (!profile) {
      throw new Error('No profile found')
    }

    const { access_token } = await refreshAccessToken(profile.refresh_token!)

    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, access_token)
      }
    })
    try {
      await client.api('/me').get()
    } catch (err) {
      console.log(err)
    }
    
  })
})