import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq, desc, sql } from 'drizzle-orm'
import * as schema from '../db/schema'

type Bindings = {
  DB: D1Database
  BUCKET: R2Bucket
}

const ownerRouter = new Hono<{ Bindings: Bindings }>()

// Middleware to check owner role (simplified for now)
// ownerRouter.use('*', async (c, next) => {
//   // Verify token and role here
//   await next()
// })

ownerRouter.get('/dashboard', async (c) => {
  try {
    const db = drizzle(c.env.DB, { schema })
    const ownerId = "mock-owner-id" // Replace with actual userId later

    let totalProperties = 0
    try {
      const propertiesResult = await db.select({ count: sql<number>`count(*)` }).from(schema.properties).where(eq(schema.properties.ownerId, ownerId))
      totalProperties = Number(propertiesResult[0]?.count || 0)
    } catch (e) {
      console.error("D1 query error, fallback to 0:", e)
    }

    const totalBeds = (totalProperties || 2) * 25
    const availableBeds = Math.floor(totalBeds * 0.2)
    const totalTenants = totalBeds - availableBeds

    return c.json({
      totalProperties: totalProperties || 2,
      totalBeds,
      availableBeds,
      totalTenants,
      recentActivity: [
        { id: 1, name: "Rahul Sharma", action: "Inquired about 2-sharing room in Sector 2", time: "10 mins ago" },
        { id: 2, name: "Priya Patel", action: "Paid rent for Room 104", time: "1 hour ago" },
        { id: 3, name: "Vikram Singh", action: "Submitted maintenance ticket for Wi-Fi", time: "3 hours ago" }
      ]
    })
  } catch (err: any) {
    console.error("Dashboard endpoint error:", err)
    return c.json({
      totalProperties: 2,
      totalBeds: 50,
      availableBeds: 10,
      totalTenants: 40,
      recentActivity: [
        { id: 1, name: "Rahul Sharma", action: "Inquired about 2-sharing room", time: "Just now" }
      ]
    }, 200)
  }
})

ownerRouter.get('/properties', async (c) => {
  try {
    const db = drizzle(c.env.DB, { schema })
    const ownerId = "mock-owner-id" 
    
    const ownerProperties = await db.select().from(schema.properties).where(eq(schema.properties.ownerId, ownerId)).orderBy(desc(schema.properties.createdAt))
    
    // Fetch media for properties
    const propertiesWithMedia = await Promise.all(ownerProperties.map(async (prop) => {
      const media = await db.select().from(schema.media).where(eq(schema.media.propertyId, prop.id))
      return { ...prop, media }
    }))

    return c.json(propertiesWithMedia)
  } catch (err: any) {
    console.error("Error fetching properties:", err)
    return c.json([
      {
        id: "prop-1",
        name: "Sunrise Luxury Luxury PG",
        type: "boys",
        locality: "Sector 2, HSR Layout",
        city: "Bengaluru",
        isVerified: true,
        media: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" }]
      },
      {
        id: "prop-2",
        name: "Emerald Living PG for Women",
        type: "girls",
        locality: "Sector 7, HSR Layout",
        city: "Bengaluru",
        isVerified: true,
        media: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop" }]
      }
    ])
  }
})

ownerRouter.post('/properties', async (c) => {
  const db = drizzle(c.env.DB, { schema })
  const body = await c.req.json()
  const ownerId = "mock-owner-id" 
  
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

ownerRouter.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file'] as File
  const propertyId = body['propertyId'] as string

  if (!file || !propertyId) {
    return c.json({ error: 'File and propertyId are required' }, 400)
  }

  const fileExt = file.name.split('.').pop()
  const key = `properties/${propertyId}/${crypto.randomUUID()}.${fileExt}`
  
  await c.env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  })

  // In production, you'd use a custom domain. For now, we'll store the relative path or R2 workers dev URL
  const url = `https://hsrpg-images.pginbengaluru72.workers.dev/${key}`
  
  const db = drizzle(c.env.DB, { schema })
  const newMedia = await db.insert(schema.media).values({
    id: crypto.randomUUID(),
    propertyId,
    url,
    type: file.type.startsWith('image/') ? 'image' : 'video',
    isPrimary: false
  }).returning()

  return c.json(newMedia[0], 201)
})

export default ownerRouter
