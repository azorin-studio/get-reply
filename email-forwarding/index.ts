
import PostalMime from 'postal-mime';

export interface Env {
  GETREPLY_BOT_AUTH_TOKEN: string;
  GETREPLY_URL: string;
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
      console.log(`Sending to ${env.GETREPLY_URL}`)
      const r = await fetch(env.GETREPLY_URL, opts)
      console.log(r.status)
      console.log(await r.text())
    } catch (e) {
      console.log(e)
    }
  }
}

export default worker