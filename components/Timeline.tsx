type Item = { start: string; end: string; title?: string }
export default function Timeline({ items }: { items: Item[] }){
  return <div className="timeline">
    {items.map((i,idx)=>(
      <div key={idx} className="card" style={{margin:'8px 0'}}>
        <div style={{fontWeight:600}}>{i.title || 'Block'}</div>
        <div className="badge">{new Date(i.start).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}–{new Date(i.end).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
      </div>
    ))}
  </div>
}
