
import PostalMime from 'postal-mime';

export interface Env {
  GETREPLY_BOT_AUTH_TOKEN: string;
}

const worker = {
	async email(message: any, env: Env, ctx: any): Promise<void> {
    const parser = new PostalMime()

    const rawEmail = new Response(message.raw)
    const email = await parser.parse(await rawEmail.arrayBuffer())
  
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GETREPLY_BOT_AUTH_TOKEN}`
      },
      body: JSON.stringify(email)
    }

    try {
      console.log('Sending to https://laptop.azorin.studio/api/process-email')
      const r = await fetch('https://laptop.azorin.studio/api/process-email', opts)
      console.log(r.status)
      console.log(await r.json())
    } catch (e) {
      console.log(e)
    }

    // try {
    //   const r = await fetch('https://pc.azorin.studio/api/process-email', opts)
    //   console.log(r.status)
    //   console.log(await r.json())
    // } catch (e) {
    //   console.log(e)
    // }
    
    // try {
    //   const r = await fetch('https://getreply.app/api/process-email', opts)
    //   console.log(r.status)
    //   console.log(await r.json())
    // } catch (e) {
    //   console.log(e)
    // }
  }
}

export default worker