import { IncomingEmail } from "~/supabase/types"

interface ICreateTestEmail {
  fromAddress?: string,
  toAddresses?: string[],
  ccAddresses?: string[],
  bccAddresses?: string[],
  subject?: string,
  date?: string,
  text?: string  
}

export default function createTestEmail ({
  fromAddress = "amonecho1@gmail.com",
  toAddresses = ["reply@getreply.app"],
  ccAddresses = [],
  bccAddresses = [],
  subject = "Test: 4aw90",
  date = "Fri, 26 May 2023 03:36:23 -0700",
  text = "This is a test email"
}: ICreateTestEmail): IncomingEmail {
  const email = {
    headers: [
      {
        key: "received",
        value: `<${toAddresses[0]}>;` // when the email is sent to multiple at onces this header tells us which actual we are
      },
      {
        key: "received-spf",
        value: `pass (mx.cloudflare.net: domain of ${fromAddress} designates 2607:f8b0:4864:20::635 as permitted sender) helo=\"mail-pl1-x635.google.com\"; envelope-from=\"${fromAddress}\";`
      },
      {
        key: "authentication-results",
        value: "mx.cloudflare.net; spf=pass; dkim=pass; dmarc=pass;"
      },
      {
        key: "dkim-signature",
        value: "v=1; a=rsa-sha256; s=2022; d=email.cloudflare.net; c=relaxed/relaxed; h=To:Subject:Date:from:reply-to:cc:resent-date:resent-from:resent-to :resent-cc:in-reply-to:references:list-id:list-help:list-unsubscribe :list-subscribe:list-post:list-owner:list-archive; t=1685097384; bh=abSd98f Op3iZ86vW2QUcOJLhNm4/8CCGPCLVUIQfCxg=; b=f3ctSoQ6JqVLdZ2o2rh2r7LZlF5uCM4lzD 2P5Syllnt6OFYlSVdizNvRrEpW1yWQQeP4K3qPyyRp+kOsNAXaCCqHWZuDnxDSxnx1qc7NJxqlb CBVQcoTy42TaG2SsJNziOoc4InhvZrI6wLNgDNTq09nasaLFWtH5t5rLLkfcZH0I6Ld+l5gSBrc hs+tsL7GiCJu9fG9+4Xha18ZnNGJ7gixuWv1N9PW6T55+SuFaUoG6q2C1u4rAjQzku15bmDFHZ8 AzvwsKJu686t59Fir8OPc8fxT5G+8kthYdVpZjzWimwTBgXXcKE/FkUrOwqH1VnUaPXqQD2mQBV x1KwS9mg==;"
      },
      {
        key: "received",
        value: "by mail-pl1-x635.google.com with SMTP id d9443c01a7336-1b01aa5526fso1559865ad.2 for <reply@getreply.app>; Fri, 26 May 2023 03:36:24 -0700 (PDT)"
      },
      {
        key: "dkim-signature",
        value: "v=1; a=rsa-sha256; c=relaxed/relaxed; d=gmail.com; s=20221208; t=1685097384; x=1687689384; h=to:subject:message-id:date:from:mime-version:from:to:cc:subject :date:message-id:reply-to; bh=abSd98fOp3iZ86vW2QUcOJLhNm4/8CCGPCLVUIQfCxg=; b=sPz+Xcym45gOXeCyixjSoA5SwD7cVZ7yhr/zEMHDlA2W71nv/BKez4FAbiIqG3aqpi 7nw7+DIlK4utQCmlA+1tWcj1rHwRKTMWgLjGo25rFZX/T7jUYKDQSlJLmfmtaGuKNQl/ 4prTABcEzrrQzwZHKlg9XhFzkgQFI0WlE146hsgp1IeI5WNqpddeaCenabFl/W8L1mTv n3G8RlmLlfXZbaaKkvAChaY8XcXm5WTO4Vjxwt0h5vOM57u0TonPCOGKNuAntkv+Y8LA AxyXloJQXMZ8tnaKO5Tcn1kLZVxzhXz7zY6IIzZwluG2nbYcpuOZCZDLboQ+O4Wo98qW 3TXA=="
      },
      {
        key: "received",
        value: "from 643874583166 named unknown by gmailapi.google.com with HTTPREST; Fri, 26 May 2023 03:36:23 -0700"
      },
      {
        key: "received",
        value: "from 643874583166 named unknown by gmailapi.google.com with HTTPREST; Fri, 26 May 2023 03:36:23 -0700"
      },
      {
        key: "mime-version",
        value: "1.0"
      },
      {
        key: "from",
        value: "amonecho1@gmail.com"
      },
      {
        key: "date",
        value: "Fri, 26 May 2023 03:36:23 -0700"
      },
      {
        key: "message-id",
        value: "<CAG9yPc1=DJN4Wu=ygVueikSWiXg+zmrLG7Q3O6fyB3jdjwgGZw@mail.gmail.com>"
      },
      {
        key: "subject",
        value: "Test: 4aw90"
      },
      {
        key: "to",
        value: "reply@getreply.app"
      },
      {
        key: "content-type",
        value: "text/plain; charset=\"UTF-8\""
      }
    ],
    from: {
      address: fromAddress,
      name: ""
    },
    to: toAddresses.map(address => ({ address, name: "" })),
    cc: ccAddresses.map(address => ({ address, name: "" })),
    bcc: bccAddresses.map(address => ({ address, name: "" })),
    subject,
    messageId: "<CAG9yPc1=DJN4Wu=ygVueikSWiXg+zmrLG7Q3O6fyB3jdjwgGZw@mail.gmail.com>",
    date,
    text
  }

  return email
}