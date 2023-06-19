import fetch from 'isomorphic-fetch'

export const refreshAccessToken = async (refresh_token: string) => {
  const form = new URLSearchParams()
  form.append('client_id', process.env.AZURE_CLIENT_ID!)
  form.append('client_secret', process.env.AZURE_CLIENT_SECRET!)
  form.append('grant_type', 'refresh_token')
  form.append('refresh_token', refresh_token)
  form.append('scope', 'email openid')
  form.append('tenant', process.env.AZURE_TENANT!)

  const authResponse = await fetch(`${process.env.AZURE_TENANT}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString()
  })

  const newTokens = await authResponse.json()

  if (!authResponse.ok) {
    // should delete the token from the user so they can re-authenticate
    throw new Error(`Azure ${newTokens.error_description.toLowerCase()}`)
  }

  const tokens = {
    refresh_token: refresh_token,
    access_token: newTokens.access_token
  }

  return tokens
}

