import Link from 'next/link'
import { supabaseBrowser } from '../lib/supabaseClient'

export default function TopNav(){
  const logout = async ()=>{
    await supabaseBrowser().auth.signOut()
    window.location.href = '/'
  }
  return <div className="toolbar">
    <Link href="/">Today</Link>
    <Link href="/inbox">Inbox</Link>
    <Link href="/planner">Planner</Link>
    <div style={{marginLeft:'auto'}}></div>
    <button onClick={logout}>Sign out</button>
  </div>
}
