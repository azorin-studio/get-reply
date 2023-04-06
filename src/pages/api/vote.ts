import fetch from 'node-fetch'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async function (req: NextApiRequest, res: NextApiResponse) {
  const { vote, followups } = req.body

  if (!process.env.GRAPHJSON_API_KEY) {
    return res.status(500).json({ error: { message: 'GRAPHJSON_API_KEY not set.' } })
  }
  
  console.log(`Sending ratings packet to GRAPHJSON`)
  try {
    await fetch("https://api.graphjson.com/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.GRAPHJSON_API_KEY,
        collection: "ratings",
        json: JSON.stringify({
          vote,
          followups
        }),
        timestamp: Math.floor(new Date().getTime() / 1000),
      })
    })
  } catch (err: any) {
    console.error(err.message)
  }

  return res.status(201).json({ success:true })
}

export default handler