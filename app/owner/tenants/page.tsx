"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Plus, Phone, MessageSquare, ShieldCheck, Search, X, CheckCircle2, Clock } from "lucide-react"

type Tenant = {
  id: string
  name: string
  phone: string
  property: string
  room: string
  rent: number
  joiningDate: string
  status: "paid" | "pending" | "overdue"
}

const INITIAL_TENANTS: Tenant[] = [
  {
    id: "t-1",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    property: "Sunrise Luxury PG",
    room: "Room 101 - Bed 2",
    rent: 10500,
    joiningDate: "01 Jan 2026",
    status: "paid"
  },
  {
    id: "t-2",
    name: "Amit Kumar",
    phone: "+91 98123 45678",
    property: "Sunrise Luxury PG",
    room: "Room 102 - Bed 3",
    rent: 8500,
    joiningDate: "15 Jan 2026",
    status: "pending"
  },
  {
    id: "t-3",
    name: "Anjali Sharma",
    phone: "+91 99887 76655",
    property: "Emerald Living PG",
    room: "Room 201 - Bed 1",
    rent: 14000,
    joiningDate: "10 Feb 2026",
    status: "paid"
  }
]

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTenant, setNewTenant] = useState({
    name: "",
    phone: "",
    property: "Sunrise Luxury PG",
    room: "Room 103 - Bed 1",
    rent: "9500"
  })

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.phone.includes(searchTerm)
  )

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTenant.name || !newTenant.phone) return

    const created: Tenant = {
      id: `t-${Date.now()}`,
      name: newTenant.name,
      phone: newTenant.phone,
      property: newTenant.property,
      room: newTenant.room,
      rent: parseInt(newTenant.rent) || 9000,
      joiningDate: "Today",
      status: "pending"
    }

    setTenants([created, ...tenants])
    setIsModalOpen(false)
    setNewTenant({ name: "", phone: "", property: "Sunrise Luxury PG", room: "Room 103 - Bed 1", rent: "9500" })
  }

  const toggleRentStatus = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== id) return t
      return {
        ...t,
        status: t.status === "paid" ? "pending" : "paid"
      }
    }))
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Tenants Management</h2>
          <p className="text-muted-foreground text-sm">Track active occupants, room allocations, and rent payment status.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search tenant name, room, or phone number..."
            className="pl-9 h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold flex items-center justify-center text-sm">
                    {tenant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">{tenant.name}</CardTitle>
                    <CardDescription className="text-xs text-slate-500">{tenant.phone}</CardDescription>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  tenant.status === 'paid' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {tenant.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Property:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{tenant.property}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Allocated Room:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{tenant.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Rent:</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">₹{tenant.rent.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Joined On:</span>
                  <span className="font-medium text-slate-600 dark:text-slate-400">{tenant.joiningDate}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button 
                  size="sm"
                  variant="outline" 
                  onClick={() => toggleRentStatus(tenant.id)}
                  className="flex-1 text-xs font-bold rounded-xl h-9 border-slate-200"
                >
                  {tenant.status === "paid" ? "Mark Rent Due" : "Mark Paid"}
                </Button>
                <a 
                  href={`https://wa.me/${tenant.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(tenant.name)},%20this%20is%20a%20friendly%20reminder%20regarding%20your%20rent%20payment%20for%20${encodeURIComponent(tenant.room)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 transition-colors border border-emerald-200/80"
                  title="Send WhatsApp Reminder"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Tenant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Add New Tenant</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleAddTenant} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="tname" className="text-xs font-bold">Tenant Full Name</Label>
                <Input 
                  id="tname" 
                  required
                  value={newTenant.name}
                  onChange={e => setNewTenant({...newTenant, name: e.target.value})}
                  placeholder="e.g. Vikram Singh" 
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tphone" className="text-xs font-bold">Mobile / WhatsApp Number</Label>
                <Input 
                  id="tphone" 
                  required
                  value={newTenant.phone}
                  onChange={e => setNewTenant({...newTenant, phone: e.target.value})}
                  placeholder="+91 98765 43210" 
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="troom" className="text-xs font-bold">Assign Room</Label>
                  <Input 
                    id="troom"
                    value={newTenant.room}
                    onChange={e => setNewTenant({...newTenant, room: e.target.value})}
                    placeholder="Room 103 - Bed 1" 
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="trent" className="text-xs font-bold">Rent Amount (₹)</Label>
                  <Input 
                    id="trent"
                    type="number"
                    value={newTenant.rent}
                    onChange={e => setNewTenant({...newTenant, rent: e.target.value})}
                    placeholder="9500" 
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl h-10 font-bold text-xs">Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 font-bold text-xs shadow-md">Add Tenant</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
