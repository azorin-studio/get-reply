const sample = {
  headers: [
    {
      key: 'received',
      value: 'from mail-pj1-x1044.google.com (2607:f8b0:4864:20::1044) by email.cloudflare.net (unknown) id mpyluNvnEtEh for <bot@getreply.app>; Sat, 22 Apr 2023 21:54:33 +0000'
    },
    {
      key: 'received-spf',
      value: 'pass (mx.cloudflare.net: domain of amonecho1@gmail.com designates 2607:f8b0:4864:20::1044 as permitted sender) helo="mail-pj1-x1044.google.com"; envelope-from="amonecho1@gmail.com";'
    },
    {
      key: 'authentication-results',
      value: 'mx.cloudflare.net; spf=pass; dkim=pass; dmarc=pass;'
    },
    {
      key: 'arc-seal',
      value: 'i=1; a=rsa-sha256; s=2022; d=email.cloudflare.net; cv=none; b=F9Kqn5DS/o1LaAJC0vJLSU6oYwJPNSknjy3rxfdTLACX31TeDmG5W0jyLTRRw19CbHbirDh4H +tUABnS8eZPNw7KhlAiiWQ4L/WYbS4wa3TVhs5i+Hwkq5l+YamcNgzMf2ccdC7RC8GNmkDNikxl Pg3Arlm9qOtVVulBhp3L4HkvVoUNWt3Uvbdyd+4qK3kTOo4k8NATuxp5VBUxDR/gNOHFCVm+nUF H60XW74v15UNoIEJEZOUJgnIt4iXYHoJvNXp0DeT+mtX77M4IytPB2MkK9XDjzM6ux07K1PaTu0 fDY06JF/aGpcX8T2Vrh/Y5VIQ/OgdJcoDv1VSvCxIvBg==;'
    },
    {
      key: 'arc-message-signature',
      value: 'i=1; a=rsa-sha256; s=2022; d=email.cloudflare.net; c=relaxed/relaxed; h=To:Subject:Date:From:reply-to:cc:resent-date:resent-from:resent-to :resent-cc:in-reply-to:references:list-id:list-help:list-unsubscribe :list-subscribe:list-post:list-owner:list-archive; t=1682200474; bh=HGMPgBf DtwBYokB8FZl4RF5biotKZBFyUcdsH0MsH1k=; b=F9WQc14ERaR2kchDJmMSS3Vhp/U7v+xu42 C4ICl5C2txJL3/EkAgNxai7IavKIQDtZT65dZFhNjC4Xhuatco14qJ9fqslaSlepG9vjiJvjkik Ix6ilUUxGuG40lOvOs7VfWViOCpnzHHmECpFPNO4mrFmRv8GEnRUEVD/a5OniEOv04/WNBQhnZw 9++LHT8OA6pvq7eY3UsQZSCz6PTwWlxOyaQGTrM3N6nEzGdC8bV48P3TBg06MeNOF5l9342EG4L ZLqV05L4liKUR+vy9xZd9rAifF0X7VEclrjlttrZzptiwi3v4EQWU9O+KaRmvC19dE3M1a/zgwu EpDIcDpg==;'
    },
    {
      key: 'arc-authentication-results',
      value: 'i=1; mx.cloudflare.net; dkim=pass header.d=gmail.com header.s=20221208 header.b=TK63f/WV; dmarc=pass header.from=gmail.com policy.dmarc=none; spf=none (mx.cloudflare.net: no SPF records found for postmaster@mail-pj1-x1044.google.com) smtp.helo=mail-pj1-x1044.google.com; spf=pass (mx.cloudflare.net: domain of amonecho1@gmail.com designates 2607:f8b0:4864:20::1044 as permitted sender) smtp.mailfrom=amonecho1@gmail.com; arc=none smtp.remote-ip=2607:f8b0:4864:20::1044'
    },
    {
      key: 'dkim-signature',
      value: 'v=1; a=rsa-sha256; s=2022; d=email.cloudflare.net; c=relaxed/relaxed; h=To:Subject:Date:From:reply-to:cc:resent-date:resent-from:resent-to :resent-cc:in-reply-to:references:list-id:list-help:list-unsubscribe :list-subscribe:list-post:list-owner:list-archive; t=1682200474; bh=HGMPgBf DtwBYokB8FZl4RF5biotKZBFyUcdsH0MsH1k=; b=QhBIrofAbggzdN2xblzWtX3o5sBDTwhmDS /7Kx0MCT8sO6j/14csIGcC9XzwxXuNi3SvfSk/HxQVvioDsKIvbEOU5Z1gu/mns2RJedH4wM5DU LcZqEt3bu2eiEbwpuXueEXfFrhNeOe/OIbuuhfztHupZyFPf8lixQb8of7zbcauIRdMs7daDv8v veLf1+7vl5RF7EDAhpcrd3EryVI+vuA1YB4BkFX5fxUfVTvyco/Uwj+UU5xNmiJSMgmoiVgpfdc tVYkmlVfGsFJgFVRE/phLhP+gf23nZyM/hYnnu7Kpib+TWNGbjqKQS7YTNDfMXilR75ZmlIrZVt 8tO7zu2A==;'
    },
    {
      key: 'received',
      value: 'by mail-pj1-x1044.google.com with SMTP id 98e67ed59e1d1-24b3451b2fcso2361701a91.3 for <bot@getreply.app>; Sat, 22 Apr 2023 14:54:33 -0700 (PDT)'
    },
    {
      key: 'dkim-signature',
      value: 'v=1; a=rsa-sha256; c=relaxed/relaxed; d=gmail.com; s=20221208; t=1682200473; x=1684792473; h=to:subject:message-id:date:from:mime-version:from:to:cc:subject :date:message-id:reply-to; bh=HGMPgBfDtwBYokB8FZl4RF5biotKZBFyUcdsH0MsH1k=; b=TK63f/WV7S0BKaZQjD07/LW9ACwtez/4a3KK0umJzjgTO1hu/q5pCBhzVDt5anCx34 wzQz8W6Nh0Sk+O10NqPkffXUac7jErL2LiOgkN3VwQW+1Nm52EN859crkXrqc8V8X2Yq 2TlrsOXJ7bQLKQS+rVyU3qxyi1w3L3drWw3XZGwacLgDVp2blkRepCqwQnDqwaGaNLcx llLuqcqFaOMZCE1XaFDfDygRbCZehXKABfaYIcttDK8MWdO0jYAK8+FjRGJ3S5KGHNyT lilPKT28yAT729dvzzl/LgLqOA0zoFM+rU8e47RPVQlRvKDy5RlzVIvuYB/QpAhpySat LCGA=='
    },
    {
      key: 'x-google-dkim-signature',
      value: 'v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20221208; t=1682200473; x=1684792473; h=to:subject:message-id:date:from:mime-version:x-gm-message-state :from:to:cc:subject:date:message-id:reply-to; bh=HGMPgBfDtwBYokB8FZl4RF5biotKZBFyUcdsH0MsH1k=; b=RoZj7CF+ukpXgvsr4GTVn4l+Ri4cRberBHGdxVQmu3LL4ELb6f+SFdsqB9bHNEnpJ5 t+ereNdOz2eGbV7IWifx+uPUnPC1ZseN+j67C5L5cPOoPwa9DL1EkTnt7ErpAI3+TthJ MzbnPQS4EkUKyNA61cK8zVc8rPT3F5Rl98I8vdyDWegP9v+HKOUDXrIvMR7omCpvv1XO xxXPYQoKPyqhFLqRjNM9bLTTYPR6XEMmS5WQUPlRf5bPadt4se941kC4PsbCN8ZB3WrE jCnPjRqlSaqLx74KRi8DtyPkdK+LSTXLWSCskxcHSy0K1UAqueYGfw5HbdBBv27fBXvf fwWw=='
    },
    {
      key: 'x-gm-message-state',
      value: 'AAQBX9fTGDyC1A3tc5XsrblE04eoZ7tYS4uzkO+DrhjvnADSGI/uCepP vzJPe7p+0ASnJ2jsQTr67abhfId6dycv4iOo3yFhqT1+HTdOZ8pFqFo='
    },
    {
      key: 'x-google-smtp-source',
      value: 'AKy350b02IGpaeerp82LLdFRGLF8CPhmiFH2dPf2fytq9oKJrNaKSFAbvfsNpd2iTvHqQEHOMG0lHOz9pdShgtp8Gl8='
    },
    {
      key: 'x-received',
      value: 'by 2002:a17:90a:2d8a:b0:24b:2e6a:24ed with SMTP id p10-20020a17090a2d8a00b0024b2e6a24edmr9803245pjd.37.1682200473459; Sat, 22 Apr 2023 14:54:33 -0700 (PDT)'
    },
    { key: 'mime-version', value: '1.0' },
    { key: 'from', value: 'Eoin Murray <amonecho1@gmail.com>' },
    { key: 'date', value: 'Sat, 22 Apr 2023 23:54:22 +0200' },
    {
      key: 'message-id',
      value: '<CAG9yPc1PBKOX+uVgKYu_E7ao=2zqap3C24C1iknJFd3O_E3cdQ@mail.gmail.com>'
    },
    { key: 'subject', value: 'Test' },
    { key: 'to', value: '"me@eoinmurray.eu" <me@eoinmurray.eu>' },
    {
      key: 'content-type',
      value: 'multipart/alternative; boundary="000000000000a95f6d05f9f3d18c"'
    },
    { key: 'bcc', value: 'bot@getreply.app' }
  ],
  from: { address: 'amonecho1@gmail.com', name: 'Eoin Murray' },
  to: [ { address: 'me@eoinmurray.eu', name: '' } ],
  bcc: [ { address: 'bot@getreply.app', name: '' } ],
  subject: 'Test',
  messageId: '<CAG9yPc1PBKOX+uVgKYu_E7ao=2zqap3C24C1iknJFd3O_E3cdQ@mail.gmail.com>',
  date: '2023-04-22T21:54:22.000Z',
  html: '<div dir="ltr">test1<br></div>\n\n',
  text: 'test1\n\n',
  attachments: []
}

export default sample