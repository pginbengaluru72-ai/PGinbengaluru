import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getAuth } from './auth'
import superadminRouter from './routes/superadmin'
import ownerRouter from './routes/owner'
import tenantRouter from './routes/tenant'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS for cross-domain API calls
app.use('*', cors({
  origin: ['https://pginbengaluru.pages.dev', 'http://localhost:3000'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-client-info', 'x-better-auth-timezone'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  credentials: true,
}))

// Basic health check route
app.get('/', (c) => {
  return c.text('HSRPG API is running!')
})

// Better Auth endpoints
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  const auth = getAuth(c.env)
  return auth.handler(c.req.raw)
})

// Super Admin endpoints
app.route('/api/superadmin', superadminRouter)

// Owner endpoints
app.route('/api/owner', ownerRouter)

// Tenant endpoints
app.route('/api/tenant', tenantRouter)

export default app
