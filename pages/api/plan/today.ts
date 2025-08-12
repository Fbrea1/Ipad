import type { NextApiRequest, NextApiResponse } from 'next'
import { packTasksIntoDay, type Task, type BusyBlock } from '../../../lib/scheduling'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  // MVP: read tasks from localStorage is client-only.
  // Here we just demo with placeholder tasks and busy times.
  const now = new Date()
  const start = new Date(now); start.setHours(9,0,0,0)
  const end = new Date(now); end.setHours(18,0,0,0)

  // TODO: replace with Microsoft Graph freeBusy (after OAuth through Supabase)
  const busy: BusyBlock[] = [
    { start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0).toISOString(),
      end:   new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0, 0).toISOString() },
    { start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0, 0).toISOString(),
      end:   new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 30, 0).toISOString() },
  ]

  const tasks: Task[] = [
    { id:'1', title:'Review sales numbers', minutes:60, priority:'high' },
    { id:'2', title:'Order fryer parts', minutes:25, priority:'medium' },
    { id:'3', title:'Write schedule draft', minutes:90, priority:'high' },
  ]

  const plan = packTasksIntoDay(tasks, busy, start.toISOString(), end.toISOString())
  res.status(200).json({ plan })
}
