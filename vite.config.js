import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : ''
        if (url.startsWith('/api/')) {
          const endpoint = url.replace(/^\/api\//, '').replace(/\.js$/, '')
          const filePath = path.resolve(process.cwd(), 'api', `${endpoint}.js`)
          try {
            // Buffer request body for POST
            let body = {}
            if (req.method === 'POST') {
              const chunks = []
              for await (const chunk of req) {
                chunks.push(chunk)
              }
              const rawBody = Buffer.concat(chunks).toString('utf-8')
              if (rawBody) {
                try {
                  body = JSON.parse(rawBody)
                } catch {
                  body = {}
                }
              }
            }

            req.body = body

            // Response helpers matching Vercel/Express standard
            res.status = function (code) {
              res.statusCode = code
              return res
            }
            res.json = function (data) {
              if (!res.headersSent) {
                res.setHeader('Content-Type', 'application/json')
              }
              res.end(JSON.stringify(data))
              return res
            }

            const mod = await server.ssrLoadModule(filePath)
            const handler = mod.default || mod
            if (typeof handler === 'function') {
              await handler(req, res)
              return
            }
          } catch (err) {
            console.error(`[API Dev Server Error] ${url}:`, err)
            if (!res.writableEnded) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message || 'Internal server error in dev API' }))
            }
            return
          }
        }
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  // Inject into process.env so serverless functions in local dev see GROQ_API_KEY
  Object.assign(process.env, env)

  return {
    plugins: [react(), apiDevMiddleware()],
    envPrefix: ['VITE_', 'AI_']
  }
})

