
import PostalMime from 'postal-mime';
import { IncomingEmail } from '~/db-admin/types';
import parseSequenceName from '~/lib/parse-sequence-name';

export interface Env {
  GETREPLY_BOT_AUTH_TOKEN: string;
}

const worker = {
	async email(message: any, env: Env, ctx: any): Promise<void> {
    const parser = new PostalMime()

    const rawEmail = new Response(message.raw)
    const email = await parser.parse(await rawEmail.arrayBuffer()) as IncomingEmail
  
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GETREPLY_BOT_AUTH_TOKEN}`
      },
      body: JSON.stringify(email)
    }
    
    const { tags } = parseSequenceName(email)

    // if pc is in the tags send the email to https://pc.azorin.studio
    // if laptop is in the tags send the email to https://laptop.azorin.studio
    // otherwise send to https://getreply.app
    try {
      if (tags.includes('pc')) {
        console.log(`Sending to https://pc.azorin.studio/api/process-email`)
        const r = await fetch(`https://pc.azorin.studio/api/process-email`, opts)

        console.log(r.status)
        console.log(await r.text())
        return
      }

      if (tags.includes('laptop')) {
        console.log(`Sending to https://laptop.azorin.studio/api/process-email`)
        const r = await fetch(`https://laptop.azorin.studio/api/process-email`, opts)

        console.log(r.status)
        console.log(await r.text())
        return
      }

      console.log(`Sending to https://getreply.app/api/process-email`)
      const r = await fetch('https://getreply.app/api/process-email', opts)
      console.log(r.status)
      console.log(await r.text())
      return
    } catch (e) {
      console.log(e)
      return
    }
  }
}

export default worker