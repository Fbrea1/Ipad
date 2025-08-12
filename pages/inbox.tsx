import AuthGate from '../components/AuthGate'
import TopNav from '../components/TopNav'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Task = { id:string; title:string; minutes:number; priority:'low'|'medium'|'high'; due?:string }

export default function Inbox(){
  return <AuthGate>
    <TopNav/>
    <InboxInner/>
  </AuthGate>
}

export function InboxInner(){
  const [tasks,setTasks] = useState<Task[]>([])
  const [input,setInput] = useState('')

  useEffect(()=>{
    // load from localStorage for MVP
    const saved = localStorage.getItem('inboxTasks')
    if (saved) setTasks(JSON.parse(saved))
  },[])

  useEffect(()=>{
    localStorage.setItem('inboxTasks', JSON.stringify(tasks))
  },[tasks])

  const add = ()=>{
    if (!input.trim()) return
    setTasks([{ id: uuidv4(), title: input.trim(), minutes: 30, priority: 'medium' }, ...tasks])
    setInput('')
  }

  const remove = (id:string)=> setTasks(tasks.filter(t=>t.id!==id))

  return <div className="container">
    <h1>Inbox</h1>
    <div className="flex">
      <input className="input" placeholder="e.g., Order fryer parts, 25m, High, Fri" value={input} onChange={e=>setInput(e.target.value)} />
      <button className="card" onClick={add}>Add</button>
    </div>
    <div className="space"></div>
    {tasks.map(t=>(
      <div key={t.id} className="card" style={{display:'flex', alignItems:'center', gap:8}}>
        <div style={{flex:1}}>{t.title}</div>
        <span className="badge">{t.priority}</span>
        <span className="badge">{t.minutes}m</span>
        <button onClick={()=>remove(t.id)}>✕</button>
      </div>
    ))}
  </div>
}
