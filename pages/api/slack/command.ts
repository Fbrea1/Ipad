import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import axios from 'axios'

const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || ''
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || ''

function verifySlack(req: NextApiRequest) {
  const ts = req.headers['x-slack-request-timestamp'] as string
  const sig = req.headers['x-slack-signature'] as string
  if (!ts || !sig) return false
  const body = typeof req.body === 'string' ? req.body : new URLSearchParams(req.body).toString()
  const base = `v0:${ts}:${body}`
  const hash = 'v0=' + crypto.createHmac('sha256', SLACK_SIGNING_SECRET).update(base).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(sig))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!verifySlack(req)) return res.status(401).send('Bad signature')

  const text = (req.body.text || '').trim()
  const user_id = req.body.user_id

  // Basic demo: /plan today 5h
  let message = `Got it. Planning: ${text}`

  // Respond in-channel quickly
  res.setHeader('Content-Type','text/plain')
  return res.status(200).send(message)
}
