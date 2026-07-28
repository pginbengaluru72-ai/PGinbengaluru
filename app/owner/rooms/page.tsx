"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bed, Plus, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react"

type BedItem = {
  id: string
  number: number
  isAvailable: boolean
  tenantName?: string
}

type Room = {
  id: string
  roomNumber: string
  propertyName: string
  sharingType: string
  isAc: boolean
  price: number
  beds: BedItem[]
}

const INITIAL_ROOMS: Room[] = [
  {
    id: "room-101",
    roomNumber: "Room 101",
    propertyName: "Sunrise Luxury PG",
    sharingType: "2 Sharing",
    isAc: true,
    price: 10500,
    beds: [
      { id: "b1", number: 1, isAvailable: true },
      { id: "b2", number: 2, isAvailable: false, tenantName: "Rahul Sharma" }
    ]
  },
  {
    id: "room-102",
    roomNumber: "Room 102",
    propertyName: "Sunrise Luxury PG",
    sharingType: "3 Sharing",
    isAc: false,
    price: 8500,
    beds: [
      { id: "b3", number: 1, isAvailable: true },
      { id: "b4", number: 2, isAvailable: true },
      { id: "b5", number: 3, isAvailable: false, tenantName: "Amit Kumar" }
    ]
  },
  {
    id: "room-201",
    roomNumber: "Room 201",
    propertyName: "Emerald Living PG",
    sharingType: "Single Sharing",
    isAc: true,
    price: 14000,
    beds: [
      { id: "b6", number: 1, isAvailable: false, tenantName: "Anjali Sharma" }
    ]
  }
]

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  // New Room Form State
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    propertyName: "Sunrise Luxury PG",
    sharingType: "2 Sharing",
    isAc: true,
    price: "9500",
    bedCount: "2"
  })

  // Toggle Bed Availability Handler
  const toggleBedStatus = (roomId: string, bedId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id !== roomId) return room
      return {
        ...room,
        beds: room.beds.map(bed => {
          if (bed.id !== bedId) return bed
          const nextAvailable = !bed.isAvailable
          return {
            ...bed,
            isAvailable: nextAvailable,
            tenantName: nextAvailable ? undefined : (bed.tenantName || "Assigned Tenant")
          }
        })
      }
    }))
  }

  // Add Room Handler
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoom.roomNumber) return

    const numBeds = parseInt(newRoom.bedCount) || 2
    const createdBeds: BedItem[] = Array.from({ length: numBeds }).map((_, idx) => ({
      id: `b-${Date.now()}-${idx}`,
      number: idx + 1,
      isAvailable: true
    }))

    const createdRoom: Room = {
      id: `room-${Date.now()}`,
      roomNumber: newRoom.roomNumber,
      propertyName: newRoom.propertyName,
      sharingType: newRoom.sharingType,
      isAc: newRoom.isAc,
      price: parseInt(newRoom.price) || 9000,
      beds: createdBeds
    }

    setRooms([createdRoom, ...rooms])
    setIsAddModalOpen(false)
    setNewRoom({
      roomNumber: "",
      propertyName: "Sunrise Luxury PG",
      sharingType: "2 Sharing",
      isAc: true,
      price: "9500",
      bedCount: "2"
    })
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Rooms & Beds</h2>
          <p className="text-muted-foreground text-sm">Manage room inventory and toggle live bed availability for tenants.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md font-bold">
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => {
          const availableBeds = room.beds.filter(b => b.isAvailable).length
          return (
            <Card key={room.id} className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">{room.roomNumber}</CardTitle>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${room.isAc ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'}`}>
                    {room.isAc ? 'AC Room' : 'Non-AC'}
                  </span>
                </div>
                <CardDescription className="text-xs text-slate-500 font-medium">{room.propertyName} • {room.sharingType}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                  <span className="text-xs font-semibold text-slate-500">Rent / Bed</span>
                  <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">₹{room.price.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/mo</span></span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Beds Status</h4>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded">
                      {availableBeds} / {room.beds.length} Available
                    </span>
                  </div>
                  
                  <div className="space-y-2.5">
                    {room.beds.map((bed) => (
                      <div 
                        key={bed.id} 
                        className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                          bed.isAvailable 
                            ? 'bg-emerald-50/60 border-emerald-200/80 dark:bg-emerald-950/20 dark:border-emerald-900/50' 
                            : 'bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${bed.isAvailable ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'}`}>
                            <Bed className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Bed {bed.number}</p>
                            <p className="text-[11px] font-medium text-slate-500">
                              {bed.isAvailable ? (
                                <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Ready for Booking
                                </span>
                              ) : (
                                <span>Occupied by {bed.tenantName}</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant={bed.isAvailable ? "default" : "outline"}
                          onClick={() => toggleBedStatus(room.id, bed.id)}
                          className={`h-8 text-xs font-bold rounded-lg transition-all ${
                            bed.isAvailable 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                              : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {bed.isAvailable ? 'Mark Occupied' : 'Mark Available'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Room Dialog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Add New Room</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleAddRoom} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="roomNumber" className="text-xs font-bold">Room Number / Name</Label>
                <Input 
                  id="roomNumber" 
                  required
                  value={newRoom.roomNumber}
                  onChange={e => setNewRoom({...newRoom, roomNumber: e.target.value})}
                  placeholder="e.g. Room 103" 
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sharingType" className="text-xs font-bold">Sharing Type</Label>
                  <select 
                    id="sharingType"
                    value={newRoom.sharingType}
                    onChange={e => setNewRoom({...newRoom, sharingType: e.target.value})}
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Single Sharing">Single Sharing</option>
                    <option value="2 Sharing">2 Sharing</option>
                    <option value="3 Sharing">3 Sharing</option>
                    <option value="4 Sharing">4 Sharing</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bedCount" className="text-xs font-bold">Total Beds</Label>
                  <Input 
                    id="bedCount"
                    type="number"
                    min="1"
                    max="6"
                    value={newRoom.bedCount}
                    onChange={e => setNewRoom({...newRoom, bedCount: e.target.value})}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price" className="text-xs font-bold">Monthly Rent / Bed (₹)</Label>
                  <Input 
                    id="price" 
                    type="number"
                    value={newRoom.price}
                    onChange={e => setNewRoom({...newRoom, price: e.target.value})}
                    placeholder="9500" 
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="acStatus" className="text-xs font-bold">AC Availability</Label>
                  <select 
                    id="acStatus"
                    value={newRoom.isAc ? "ac" : "non-ac"}
                    onChange={e => setNewRoom({...newRoom, isAc: e.target.value === "ac"})}
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ac">AC Room</option>
                    <option value="non-ac">Non-AC Room</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="rounded-xl h-10 font-bold text-xs">Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 font-bold text-xs shadow-md">Create Room</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
