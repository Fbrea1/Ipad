import AuthGate from '../components/AuthGate'
import TopNav from '../components/TopNav'

export default function Planner(){
  return <AuthGate>
    <TopNav/>
    <div className="container">
      <h1>Planner</h1>
      <p>This is the weekly grid. (Drag‑and‑drop coming next.)</p>
      <div className="grid">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>(
          <div key={d} className="card" style={{minHeight:200}}><strong>{d}</strong></div>
        ))}
      </div>
    </div>
  </AuthGate>
}
