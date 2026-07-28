// Central shared platform store connecting Super Admin, Owner, and Tenant dashboards

export type PropertyItem = {
  id: string
  name: string
  type: "boys" | "girls" | "colive"
  locality: string
  city: string
  address?: string
  isVerified: boolean
  whatsappNumber: string
  totalRooms: number
  availableBeds: number
  ownerName: string
  submittedAt: string
  media: { url: string }[]
}

export type LocalityItem = {
  id: string
  name: string
  city: string
  isActive: boolean
  createdAt: string
}

export type BroadcastItem = {
  id: string
  target: "all" | "owners" | "tenants"
  level: "info" | "warning"
  message: string
  createdAt: string
}

export type MaintenanceTicket = {
  id: string
  tenantName: string
  room: string
  category: string
  issue: string
  status: "Open" | "In Progress" | "Resolved"
  priority: "High" | "Medium" | "Low"
  createdAt: string
}

const INITIAL_PROPERTIES: PropertyItem[] = [
  {
    id: "prop-1",
    name: "Sunrise Luxury PG for Men",
    type: "boys",
    locality: "Sector 2",
    city: "HSR Layout, Bengaluru",
    address: "House 14, 27th Main Road, Sector 2",
    isVerified: true,
    whatsappNumber: "+91 98765 43210",
    totalRooms: 12,
    availableBeds: 5,
    ownerName: "Ramesh Reddy",
    submittedAt: "25 Oct 2026",
    media: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" }]
  },
  {
    id: "prop-2",
    name: "Emerald Stay PG for Women",
    type: "girls",
    locality: "Sector 7",
    city: "HSR Layout, Bengaluru",
    address: "Plot 88, 19th Cross, Sector 7",
    isVerified: true,
    whatsappNumber: "+91 99887 76655",
    totalRooms: 8,
    availableBeds: 2,
    ownerName: "Sita Sharma",
    submittedAt: "26 Oct 2026",
    media: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop" }]
  },
  {
    id: "prop-3",
    name: "Star Boys PG",
    type: "boys",
    locality: "Sector 2",
    city: "HSR Layout, Bengaluru",
    address: "Building 42, Sector 2",
    isVerified: false,
    whatsappNumber: "+91 98123 45678",
    totalRooms: 10,
    availableBeds: 8,
    ownerName: "Ramesh Reddy",
    submittedAt: "Today, 10:45 AM",
    media: [{ url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop" }]
  }
]

const INITIAL_LOCALITIES: LocalityItem[] = [
  { id: "loc-1", name: "Sector 1", city: "HSR Layout, Bengaluru", isActive: true, createdAt: "2026-01-01" },
  { id: "loc-2", name: "Sector 2", city: "HSR Layout, Bengaluru", isActive: true, createdAt: "2026-01-01" },
  { id: "loc-3", name: "Sector 3", city: "HSR Layout, Bengaluru", isActive: true, createdAt: "2026-01-01" },
  { id: "loc-4", name: "Sector 4", city: "HSR Layout, Bengaluru", isActive: true, createdAt: "2026-01-01" },
  { id: "loc-5", name: "Sector 5", city: "HSR Layout, Bengaluru", isActive: true, createdAt: "2026-01-01" },
  { id: "loc-6", name: "Sector 6", city: "HSR Layout, Bengaluru", isActive: true, createdAt: "2026-01-01" },
  { id: "loc-7", name: "Sector 7", city: "HSR Layout, Bengaluru", isActive: true, createdAt: "2026-01-01" },
  { id: "loc-8", name: "5th Block", city: "Koramangala, Bengaluru", isActive: true, createdAt: "2026-02-01" }
]

const INITIAL_BROADCASTS: BroadcastItem[] = [
  {
    id: "bc-1",
    target: "all",
    level: "info",
    message: "System Maintenance: Direct UPI settlements will undergo brief maintenance on Sunday 2 AM - 4 AM.",
    createdAt: "Today"
  }
]

const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: "T-1029",
    tenantName: "Rahul Sharma",
    room: "Room 101",
    category: "Electrical",
    issue: "AC remote display flickering & cooling slow",
    status: "Open",
    priority: "High",
    createdAt: "Today, 09:30 AM"
  },
  {
    id: "T-1028",
    tenantName: "Amit Kumar",
    room: "Room 102",
    category: "Plumbing",
    issue: "Leaking washroom tap",
    status: "In Progress",
    priority: "Medium",
    createdAt: "Yesterday"
  }
]

// Helper for LocalStorage Persistence
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(`hsrpg_${key}`)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`hsrpg_${key}`, JSON.stringify(value))
    window.dispatchEvent(new Event("hsrpg_state_change"))
  } catch (e) {}
}

export const AppState = {
  // --- PROPERTIES ---
  getProperties(): PropertyItem[] {
    return getStored("properties", INITIAL_PROPERTIES)
  },
  
  addProperty(property: Omit<PropertyItem, "id" | "isVerified" | "submittedAt">): PropertyItem {
    const props = this.getProperties()
    const newProp: PropertyItem = {
      ...property,
      id: `prop-${Date.now()}`,
      isVerified: false, // Must be approved by Super Admin!
      submittedAt: "Just now"
    }
    const updated = [newProp, ...props]
    setStored("properties", updated)
    return newProp
  },

  verifyProperty(id: string, isVerified: boolean): void {
    const props = this.getProperties()
    const updated = props.map(p => p.id === id ? { ...p, isVerified } : p)
    setStored("properties", updated)
  },

  deleteProperty(id: string): void {
    const props = this.getProperties()
    const updated = props.filter(p => p.id !== id)
    setStored("properties", updated)
  },

  // --- LOCALITIES ---
  getLocalities(): LocalityItem[] {
    return getStored("localities", INITIAL_LOCALITIES)
  },

  addLocality(name: string, city: string): LocalityItem {
    const locs = this.getLocalities()
    const newLoc: LocalityItem = {
      id: `loc-${Date.now()}`,
      name,
      city,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0]
    }
    const updated = [newLoc, ...locs]
    setStored("localities", updated)
    return newLoc
  },

  toggleLocality(id: string): void {
    const locs = this.getLocalities()
    const updated = locs.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l)
    setStored("localities", updated)
  },

  // --- BROADCASTS ---
  getBroadcasts(): BroadcastItem[] {
    return getStored("broadcasts", INITIAL_BROADCASTS)
  },

  addBroadcast(target: "all" | "owners" | "tenants", level: "info" | "warning", message: string): BroadcastItem {
    const bcs = this.getBroadcasts()
    const newBc: BroadcastItem = {
      id: `bc-${Date.now()}`,
      target,
      level,
      message,
      createdAt: "Just now"
    }
    const updated = [newBc, ...bcs]
    setStored("broadcasts", updated)
    return newBc
  },

  // --- TICKETS ---
  getTickets(): MaintenanceTicket[] {
    return getStored("tickets", INITIAL_TICKETS)
  },

  addTicket(tenantName: string, room: string, category: string, issue: string, priority: "High" | "Medium" | "Low"): MaintenanceTicket {
    const tickets = this.getTickets()
    const newTicket: MaintenanceTicket = {
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      tenantName,
      room,
      category,
      issue,
      status: "Open",
      priority,
      createdAt: "Just now"
    }
    const updated = [newTicket, ...tickets]
    setStored("tickets", updated)
    return newTicket
  },

  updateTicketStatus(id: string, status: "Open" | "In Progress" | "Resolved"): void {
    const tickets = this.getTickets()
    const updated = tickets.map(t => t.id === id ? { ...t, status } : t)
    setStored("tickets", updated)
  }
}
