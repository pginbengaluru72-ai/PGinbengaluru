"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bed, Plus, CheckCircle2, AlertCircle, X, Sparkles, Loader2 } from "lucide-react"
import { ownerApi } from "@/lib/apiClient"

export default function RoomsPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("")
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // New Room Form State
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    sharingType: "2 Sharing",
    isAc: true,
    price: "9500",
    bedCount: "2"
  })

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    if (selectedPropertyId) {
      fetchRooms(selectedPropertyId)
    } else {
      setRooms([])
    }
  }, [selectedPropertyId])

  const fetchProperties = async () => {
    try {
      const res = await ownerApi.getProperties()
      const props = res?.properties || []
      setProperties(props)
      if (props.length > 0) {
        setSelectedPropertyId(props[0].id)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchRooms = async (propertyId: string) => {
    setLoading(true)
    try {
      const res = await ownerApi.getRooms(propertyId)
      // For now, the API only returns rooms without beds joined. 
      // In a real app we'd fetch beds per room, but let's mock the beds for visual completeness 
      // or map the rooms as empty beds until the bed creation API is called.
      // Since the backend doesn't return beds in the rooms API currently, we'll just show the room details.
      setRooms(res?.rooms || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Add Room Handler
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoom.roomNumber || !selectedPropertyId) return

    setIsSubmitting(true)
    try {
      const res = await ownerApi.createRoom(selectedPropertyId, {
        roomNumber: newRoom.roomNumber,
        sharingType: newRoom.sharingType,
        hasAc: newRoom.isAc,
        hasAttachedBathroom: true
      })

      // Try to create beds
      const numBeds = parseInt(newRoom.bedCount) || 2
      for (let i = 0; i < numBeds; i++) {
        await ownerApi.createBed(res.roomId, {
          label: `Bed ${i + 1}`,
          monthlyRent: parseInt(newRoom.price) || 9000
        })
      }

      setIsAddModalOpen(false)
      setNewRoom({
        roomNumber: "",
        sharingType: "2 Sharing",
        isAc: true,
        price: "9500",
        bedCount: "2"
      })
      fetchRooms(selectedPropertyId)
    } catch (e: any) {
      alert(e.message || "Failed to create room")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Rooms & Beds</h2>
          <p className="text-muted-foreground text-sm">Manage room inventory and pricing.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
          >
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            {properties.length === 0 && <option value="">No properties available</option>}
          </select>

          <Button disabled={!selectedPropertyId} onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md font-bold">
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && <div className="text-slate-500 font-bold p-4 col-span-full">Loading rooms...</div>}
        
        {!loading && rooms.length === 0 && selectedPropertyId && (
          <div className="col-span-full text-slate-500 font-bold p-8 bg-slate-50 dark:bg-slate-900 border rounded-2xl border-dashed border-slate-300 dark:border-slate-800 text-center">
            No rooms created for this property yet.
          </div>
        )}

        {rooms.map((room) => {
          return (
            <Card key={room.id} className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">{room.roomNumber}</CardTitle>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${room.hasAc ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'}`}>
                    {room.hasAc ? 'AC Room' : 'Non-AC'}
                  </span>
                </div>
                <CardDescription className="text-xs text-slate-500 font-medium">{room.sharingType}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                  <span className="text-xs font-semibold text-slate-500">Status</span>
                  <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Configured
                  </span>
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
                <Button disabled={isSubmitting} type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="rounded-xl h-10 font-bold text-xs">Cancel</Button>
                <Button disabled={isSubmitting} type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 font-bold text-xs shadow-md">
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Create Room
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
