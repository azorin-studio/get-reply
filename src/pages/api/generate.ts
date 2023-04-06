import type { NextApiRequest, NextApiResponse } from 'next'
import generate, { type Data } from "~/lib/generate"

const handler = async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  const payload = req.body.payload || ''
  if (payload.trim().length === 0) {
    res.status(400).json({ error: { message: "Please enter a valid payload" } })
    return
  }

  try {
    const data = await generate(payload)
    res.status(200).json(data)
  } catch(error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data)
    } else {
      res.status(500).json({ error: { message: error.message || 'An error occurred during your request.' } })
    }
  }
}

export default handler