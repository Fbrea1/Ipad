import AuthGate from '../components/AuthGate'
import TopNav from '../components/TopNav'
import { useEffect, useState } from 'react'
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

  // Load tasks from localStorage on first render (client only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem('inboxTasks')
    if (saved) {
      try {
        setTasks(JSON.parse(saved))
      } catch {
        // ignore bad data
      }
    }
  }, [])

  // Persist tasks whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('inboxTasks', JSON.stringify(tasks))
  }, [tasks])

  const add = () => {
    const title = input.trim()
    if (!title) return
    setTasks([{ id: newId(), title, minutes: 30, priority: 'medium' }, ...tasks])
    setInput('')
  }

  const remove = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
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

      {tasks.map((t) => (
        <div key={t.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1 }}>{t.title}</div>
          <span className="badge">{t.priority}</span>
          <span className="badge">{t.minutes}m</span>
          <button onClick={() => remove(t.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}
