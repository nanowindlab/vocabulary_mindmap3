import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleStart, handleCallback, handleSession, handleLogout } from '../api/auth/_core.mjs'

function localAuthApi() {
  let env = process.env
  const handlers = {
    '/api/auth/start': handleStart,
    '/api/auth/callback': handleCallback,
    '/api/auth/session': handleSession,
    '/api/auth/logout': handleLogout,
  }

  return {
    name: 'local-auth-api',
    apply: 'serve',
    configResolved(config) {
      env = { ...loadEnv(config.mode, config.root, ''), ...process.env }
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = request.url?.split('?')[0]
        if (process.env.MM3_AUTH_TEST_MODE === '1' && path === '/api/auth/session') {
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.setHeader('Cache-Control', 'no-store')
          response.end(JSON.stringify({ configured: true, user: {
            id: 'test-user', email: 'test@gmail.com',
          } }))
          return
        }
        const handler = handlers[path]
        if (!handler) return next()
        Promise.resolve(handler(request, response, { env })).catch(next)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localAuthApi()],
})
