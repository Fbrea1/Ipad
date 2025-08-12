import { useEffect, useState } from 'react'
import { supabaseBrowser } from '../lib/supabaseClient'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready,setReady] = useState(false)
  const [user,setUser] = useState<any>(null)

  useEffect(()=>{
    const sb = supabaseBrowser()
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setReady(true)
    })
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return ()=>{ sub.subscription.unsubscribe() }
  },[])

  if (!ready) return <div className="container">Loading…</div>
  if (!user) return <Login />
  return <>{children}</>
}

function Login(){
  const login = async () => {
    const sb = supabaseBrowser()
    await sb.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'offline_access openid profile email Calendars.ReadWrite',
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
      }
    })
  }
  return <div className="container">
    <div className="space"></div>
    <h1>Sign in</h1>
    <p>Use Microsoft to enable Outlook Calendar access.</p>
    <button onClick={login} className="card">Sign in with Microsoft</button>
  </div>
}
