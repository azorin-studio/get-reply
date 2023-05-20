
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

    await fetch('https://laptop.azorin.studio/api/process-email', opts)
    await fetch('https://pc.azorin.studio/api/process-email', opts)
    // await fetch('https://getreply.app/api/process-email', opts)
  }
}

export default worker