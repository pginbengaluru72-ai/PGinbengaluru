import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq, desc } from 'drizzle-orm'
import * as schema from '../db/schema'

type Bindings = {
  DB: D1Database
}

const superadminRouter = new Hono<{ Bindings: Bindings }>()

// Middleware to check superadmin role (simplified for now)
// superadminRouter.use('*', async (c, next) => {
//   // Verify token and role here
//   await next()
// })

// Localities Endpoints
superadminRouter.get('/localities', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  const localities = await db.select().from(schema.localities).orderBy(desc(schema.localities.createdAt))
  return c.json(localities)
})

superadminRouter.post('/localities', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  const body = await c.req.json()
  
  if (!body.name || !body.city) {
    return c.json({ error: 'Name and city are required' }, 400)
  }

  const newLocality = await db.insert(schema.localities).values({
    id: crypto.randomUUID(),
    name: body.name,
    city: body.city,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning()

  return c.json(newLocality[0], 201)
})

superadminRouter.patch('/localities/:id', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  const id = c.req.param('id')
  const body = await c.req.json()

  const updatedLocality = await db.update(schema.localities)
    .set({ isActive: body.isActive, updatedAt: new Date() })
    .where(eq(schema.localities.id, id))
    .returning()

  if (!updatedLocality.length) return c.json({ error: 'Not found' }, 404)
  return c.json(updatedLocality[0])
})

// Verifications Endpoints
superadminRouter.get('/verifications', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  // In a real app, we'd join properties with owners and check isVerified
  const pendingProperties = await db.select().from(schema.properties).where(eq(schema.properties.isVerified, false))
  
  return c.json({
    properties: pendingProperties,
    kyc: [] // Placeholder for tenant KYC
  })
})

export default superadminRouter
