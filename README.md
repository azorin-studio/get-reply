# Get Reply Website and App

Services:

- 1. Vercel for the app
- 2. Supabase for auth and data
- 3. Cloudflare for email processing

TODO: 

- Run this with token obtained upon login https://developers.google.com/gmail/api/quickstart/nodejs

create table
  public.logs_duplicate (
    
    prompt text null,
    threadId text null,
    status text not null,
    error_message text null,
    headers array not null,
    from jsonb not null,
    to array null,
    bcc array null,
    cc array null,
    subject text not null,
    messageId text not null,
    date timestamp with time zone not null,
    html text not null,
    text text not null,
    provider text not null,
  ) tablespace pg_default;
