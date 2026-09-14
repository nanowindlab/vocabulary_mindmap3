import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function AuthGate() {
  const [state, setState] = useState({ status: 'loading', user: null, error: '' })
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('session_unavailable')
        return response.json()
      })
      .then(({ user }) => {
        if (user) setState({ status: 'ready', user, error: '' })
        else window.location.replace('/login.html')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ status: 'error', user: null, error: '로그인 상태를 확인하지 못했습니다.' })
      })
    return () => controller.abort()
  }, [])

  async function logout() {
    setLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
      if (!response.ok) throw new Error('logout_failed')
      window.location.replace('/login.html')
    } catch {
      setState((current) => ({ ...current, error: '로그아웃하지 못했습니다. 다시 시도해 주세요.' }))
      setLoggingOut(false)
    }
  }

  if (state.status !== 'ready') {
    return <main className="welcome-screen" role="status">
      <div>
        <h1>어휘 마인드맵</h1>
        <p>{state.status === 'error' ? state.error : '로그인 상태를 확인 중입니다.'}</p>
        {state.status === 'error' && <button type="button" onClick={() => window.location.reload()}>다시 시도</button>}
      </div>
    </main>
  }

  return <App authUser={state.user} onLogout={logout} loggingOut={loggingOut} authError={state.error} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthGate />
  </StrictMode>,
)
