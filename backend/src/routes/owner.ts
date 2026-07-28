import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq, desc } from 'drizzle-orm'
import * as schema from '../db/schema'

type Bindings = {
  DB: D1Database
}

const ownerRouter = new Hono<{ Bindings: Bindings }>()

// Middleware to check owner role (simplified for now)
// ownerRouter.use('*', async (c, next) => {
//   // Verify token and role here
//   await next()
// })

ownerRouter.get('/properties', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  // In a real app, this would use the session userId
  const ownerId = "mock-owner-id" // Replace with c.get('userId')
  
  const ownerProperties = await db.select().from(schema.properties).where(eq(schema.properties.ownerId, ownerId)).orderBy(desc(schema.properties.createdAt))
  return c.json(ownerProperties)
})

ownerRouter.post('/properties', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  const body = await c.req.json()
  const ownerId = "mock-owner-id" // Replace with c.get('userId')
  
  const newProperty = await db.insert(schema.properties).values({
    id: crypto.randomUUID(),
    ownerId,
    name: body.name,
    type: body.type,
    address: body.address,
    locality: body.locality,
    city: body.city || "Bengaluru",
    whatsappNumber: body.whatsappNumber,
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning()

  return c.json(newProperty[0], 201)
})

ownerRouter.get('/rooms/:propertyId', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  const propertyId = c.req.param('propertyId')
  
  const propertyRooms = await db.select().from(schema.rooms).where(eq(schema.rooms.propertyId, propertyId))
  return c.json(propertyRooms)
})

export default ownerRouter
