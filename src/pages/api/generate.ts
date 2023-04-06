import type { NextApiRequest, NextApiResponse } from 'next'
import generate, { type Data } from "~/lib/generate"

const handler = async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  const payload = req.body.payload || ''
  if (payload.trim().length === 0) {
    res.status(400).json({ error: { message: "Please enter a valid payload" } })
    return
  }

  const userPrompt = req.body.userPrompt || ''

  try {
    const { data, prompt } = await generate(payload, userPrompt)
    res.status(200).json({ data })

    if (process.env.GRAPHJSON_API_KEY) {
      console.log(`Sending generations packet to GRAPHJSON`)
      try {
        await fetch("https://api.graphjson.com/api/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.GRAPHJSON_API_KEY,
            collection: "generations",
            json: JSON.stringify({
              followups: data,
              prompt
            }),
            timestamp: Math.floor(new Date().getTime() / 1000),
          })
        })  
      } catch (err: any) {
        console.error(err.message)
      }

    }
  

  } catch(error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data)
    } else {
      res.status(500).json({ error: { message: error.message || 'An error occurred during your request.' } })
    }
  }
}

export default handler