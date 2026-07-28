"use client"

import { useState, useEffect } from "react"
import { PageTransition } from "@/components/PageTransition"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Map, CheckCircle2, XCircle } from "lucide-react"

type Locality = {
  id: string
  name: string
  city: string
  isActive: boolean
  createdAt: string
}

export default function SuperAdminLocalitiesPage() {
  const [localities, setLocalities] = useState<Locality[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [newLocality, setNewLocality] = useState({ name: "", city: "Bengaluru" })

  const fetchLocalities = async () => {
    try {
      const res = await fetch("https://hsrpg-api.pginbengaluru72.workers.dev/api/superadmin/localities")
      if (res.ok) {
        const data = await res.json()
        setLocalities(data)
      }
    } catch (error) {
      console.error("Failed to fetch localities", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLocalities()
  }, [])

  const handleAddLocality = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLocality.name || !newLocality.city) return

    setIsSubmitting(true)
    try {
      const res = await fetch("https://hsrpg-api.pginbengaluru72.workers.dev/api/superadmin/localities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLocality)
      })
      if (res.ok) {
        setNewLocality({ name: "", city: "Bengaluru" })
        fetchLocalities() // Refresh list
      }
    } catch (error) {
      console.error("Failed to add locality", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleLocalityStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`https://hsrpg-api.pginbengaluru72.workers.dev/api/superadmin/localities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      if (res.ok) {
        fetchLocalities() // Refresh list
      }
    } catch (error) {
      console.error("Failed to toggle locality status", error)
    }
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Locality Management</h1>
          <p className="text-muted-foreground mt-2 font-medium">Control the active service areas across the city.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add New Locality Form */}
          <Card className="lg:col-span-1 bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl border-white dark:border-slate-800 shadow-xl shadow-indigo-100/50 dark:shadow-none rounded-3xl h-fit">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Add New Area</CardTitle>
                  <CardDescription className="font-medium mt-1">Expand HSRPG coverage.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddLocality} className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700 dark:text-slate-300">Area Name</Label>
                  <Input 
                    required 
                    placeholder="e.g. HSR Layout, Sector 1" 
                    value={newLocality.name}
                    onChange={(e) => setNewLocality({ ...newLocality, name: e.target.value })}
                    className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-indigo-500 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700 dark:text-slate-300">City</Label>
                  <Input 
                    required 
                    value={newLocality.city}
                    onChange={(e) => setNewLocality({ ...newLocality, city: e.target.value })}
                    className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-indigo-500 font-medium"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:-translate-y-0.5"
                >
                  {isSubmitting ? "Adding..." : (
                    <span className="flex items-center"><Plus className="mr-2 h-5 w-5" /> Add Locality</span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Localities List */}
          <Card className="lg:col-span-2 bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl border-white dark:border-slate-800 shadow-xl shadow-indigo-100/50 dark:shadow-none rounded-3xl">
            <CardHeader className="pb-4 border-b border-slate-100/50 dark:border-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                    <Map className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Active Coverage Zones</CardTitle>
                    <CardDescription className="font-medium mt-1">Manage where owners can list properties.</CardDescription>
                  </div>
                </div>
                <Badge className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 border-0 font-bold px-3 py-1 text-sm">
                  {localities.length} Areas
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading localities...</div>
              ) : localities.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-medium">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  No localities found. Expand the map!
                </div>
              ) : (
                <div className="divide-y divide-slate-100/50 dark:divide-slate-800/50 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {localities.map((loc) => (
                    <div key={loc.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors gap-4 sm:gap-0">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${loc.isActive ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
                          <MapPin className={`h-5 w-5 ${loc.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-900 dark:text-white">{loc.name}</h4>
                          <p className="text-sm font-medium text-slate-500">{loc.city}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        {loc.isActive ? (
                          <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 border-0 flex items-center gap-1.5 py-1 px-2.5 font-bold">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Active
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 border-0 flex items-center gap-1.5 py-1 px-2.5 font-bold">
                            <XCircle className="h-3.5 w-3.5" /> Paused
                          </Badge>
                        )}
                        
                        <Button 
                          variant={loc.isActive ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleLocalityStatus(loc.id, loc.isActive)}
                          className={`font-bold rounded-lg ${!loc.isActive ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                          {loc.isActive ? "Pause Area" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </PageTransition>
  )
}
