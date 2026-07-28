import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq, desc } from 'drizzle-orm'
import * as schema from '../db/schema'

type Bindings = {
  DB: D1Database
}

const tenantRouter = new Hono<{ Bindings: Bindings }>()

// Middleware to check tenant role (simplified for now)
// tenantRouter.use('*', async (c, next) => {
//   // Verify token and role here
//   await next()
// })

tenantRouter.get('/tickets', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  // In a real app, this would use the session userId
  const tenantId = "mock-tenant-id" // Replace with c.get('userId')
  
  const tenantTickets = await db.select().from(schema.tickets).where(eq(schema.tickets.tenantId, tenantId)).orderBy(desc(schema.tickets.createdAt))
  return c.json(tenantTickets)
})

tenantRouter.post('/tickets', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  const body = await c.req.json()
  const tenantId = "mock-tenant-id" // Replace with c.get('userId')
  
  const newTicket = await db.insert(schema.tickets).values({
    id: crypto.randomUUID(),
    tenantId,
    propertyId: body.propertyId || "mock-property-id", // The tenant's current property
    issueType: body.issueType,
    description: body.description,
    status: "open",
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning()

  return c.json(newTicket[0], 201)
})

export default tenantRouter
