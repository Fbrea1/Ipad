import AuthGate from '../components/AuthGate'
import TopNav from '../components/TopNav'
import Timeline from '../components/Timeline'
import { useEffect, useState } from 'react'
import { packTasksIntoDay, type Task, type BusyBlock } from '../lib/scheduling'

export default function Today(){
  return <AuthGate>
    <TopNav/>
    <TodayInner/>
  </AuthGate>
}

function TodayInner(){
  const [plan,setPlan] = useState<any[]>([])
  const [loading,setLoading] = useState(false)

  const makePlan = async ()=>{
    setLoading(true)
    try{
      const res = await fetch('/api/plan/today', { method:'POST' })
      const data = await res.json()
      setPlan(data.plan || [])
    } finally { setLoading(false) }
  }

  useEffect(()=>{ makePlan() },[])

  return <div className="container">
    <h1>Today</h1>
    <button className="card" onClick={makePlan} disabled={loading}>{loading ? 'Planning…' : 'Auto‑Plan Today'}</button>
    <Timeline items={plan}/>
  </div>
}
