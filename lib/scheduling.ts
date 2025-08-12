import { addMinutes, isBefore, max as maxDate, parseISO } from 'date-fns'

export type Task = {
  id: string
  title: string
  minutes: number
  due?: string // ISO
  priority: 'low' | 'medium' | 'high'
  pinned?: boolean
}

export type BusyBlock = { start: string; end: string } // ISO

export type PlanBlock = BusyBlock & { taskId?: string; title?: string }

function byPriority(a: Task, b: Task) {
  const order = { high: 0, medium: 1, low: 2 } as const
  return order[a.priority] - order[b.priority]
}

/** Greedy packing into free windows */
export function packTasksIntoDay(tasks: Task[], busy: BusyBlock[], dayStartISO: string, dayEndISO: string): PlanBlock[] {
  const plan: PlanBlock[] = []
  const cursor = new Date(dayStartISO)
  const dayEnd = new Date(dayEndISO)

  // sort busy
  const b = busy
    .map(x => ({ start: new Date(x.start), end: new Date(x.end) }))
  b.sort((x,y) => x.start.getTime() - y.start.getTime())

  // Build free windows
  const free: BusyBlock[] = []
  let current = cursor
  for (const block of b) {
    if (isBefore(current, block.start)) {
      free.push({ start: current.toISOString(), end: block.start.toISOString() })
    }
    current = maxDate([current, block.end])
  }
  if (isBefore(current, dayEnd)) {
    free.push({ start: current.toISOString(), end: dayEnd.toISOString() })
  }

  // sort tasks by priority then due date proximity
  tasks.sort((a,b)=>{
    const p = byPriority(a,b)
    if (p!==0) return p
    const da = a.due ? parseISO(a.due).getTime() : Infinity
    const db = b.due ? parseISO(b.due).getTime() : Infinity
    return da - db
  })

  for (const task of tasks) {
    let remaining = task.minutes
    for (const window of free) {
      const ws = new Date(window.start)
      const we = new Date(window.end)
      const freeMin = Math.max(0, Math.round((we.getTime()-ws.getTime())/60000))
      if (freeMin <= 0) continue
      if (remaining <= 0) break

      const slotMin = Math.min(remaining, freeMin)
      const slotEnd = addMinutes(ws, slotMin)

      plan.push({ start: ws.toISOString(), end: slotEnd.toISOString(), taskId: task.id, title: task.title })
      // shrink window
      window.start = slotEnd.toISOString()
      remaining -= slotMin
    }
  }
  // Include busy blocks as-is (for rendering)
  for (const block of busy) plan.push({ ...block, title: 'Busy' })
  // sort final
  plan.sort((a,b)=> new Date(a.start).getTime() - new Date(b.start).getTime())
  return plan
}
