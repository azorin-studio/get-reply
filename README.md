# GetReply 

## Service and Environment variables

### Email routing

Using modifiers +pc and +laptop as a postfix for emails allows us to choose where to send email too

```
- EMAIL_ROUTING_TAG
```

### Test gmail user
We automate tests using gmail, so use the email address of an account we can use to send and receive test emails

```
- TEST_GMAIL_USER
```

### Supabase

Needed to connect to supabase, get the keys at https://app.supabase.com/account/tokens

```
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_KEY
```

### Google

Needed for login, and increased scopes needed for testing

```
- GOOGLE_REDIRECT_URL
- GOOGLE_CLIENT_SECRET
- GOOGLE_CLIENT_ID
```

### Inngest

These are not referenced in GetReply code, but are used by the Inngest client library

```
- INNGEST_EVENT_KEY
- INNGEST_SIGNING_KEY
```

### Email routing bot

Needed to securely connect with the email router, needs to be a random string

```
- GETREPLY_BOT_AUTH_TOKEN
```

### OpenAI

Needed for generations, get the key at https://platform.openai.com/account/api-keys

```
- OPENAI_API_KEY
```

### Site url

Url of site so that auth links can redirect back

```
- NEXT_PUBLIC_SITE_URL
```

### Microsoft (Azure)

For login with Microsoft

```
- AZURE_TENANT
- AZURE_CLIENT_SECRET
- AZURE_CLIENT_ID
```

### Postmark

For sending email

```
- POSTMARK_API_KEY
```

