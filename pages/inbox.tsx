import AuthGate from '../components/AuthGate'
import TopNav from '../components/TopNav'
import { useEffect, useState, useCallback } from 'react'
import { newId } from '../lib/newId'

type Task = {
  id: string
  title: string
  minutes: number
  priority: 'low' | 'medium' | 'high'
  due?: string
}

export default function Inbox() {
  return (
    <AuthGate>
      <TopNav />
      <InboxInner />
    </AuthGate>
  )
}

function InboxInner() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')
  const [hydrated, setHydrated] = useState(false) // true after we know we're on client

  // Hydration flag to avoid mismatches
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Load from localStorage (client only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem('inboxTasks')
      if (raw) {
        const parsed = JSON.parse(raw) as Task[]
        if (Array.isArray(parsed)) setTasks(parsed)
      }
    } catch {
      // ignore bad data
    }
  }, [])

  // Persist to localStorage (client only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem('inboxTasks', JSON.stringify(tasks))
    } catch {
      // storage might be unavailable; ignore
    }
  }, [tasks])

  const add = useCallback(() => {
    const title = input.trim()
    if (!title) return
    setTasks(prev => [{ id: newId(), title, minutes: 30, priority: 'medium' }, ...prev])
    setInput('')
  }, [input])

  const remove = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  // Avoid rendering client-only UI until hydrated (prevents client-side exception during SSR)
  if (!hydrated) {
    return (
      <div className="container">
        <h1>Inbox</h1>
        <div className="card">Loading…</div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Inbox</h1>

      <div className="flex">
        <input
          className="input"
          placeholder='e.g., "Order fryer parts, 25m, High, Fri"'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button className="card" onClick={add}>Add</button>
      </div>

      <div className="space" />

      {tasks.length === 0 ? (
        <div className="card">No tasks yet. Add your first one above.</div>
      ) : (
        tasks.map((t) => (
          <div key={t.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1 }}>{t.title}</div>
            <span className="badge">{t.priority}</span>
            <span className="badge">{t.minutes}m</span>
            <button onClick={() => remove(t.id)}>✕</button>
          </div>
        ))
      )}
    </div>
  )
}
