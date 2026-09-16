"use client"

import { useState, useEffect } from "react"
import { MapPin, Plus, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { adminApi } from "@/lib/apiClient"

export default function AdminLocalitiesPage() {
  const [localities, setLocalities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newLocality, setNewLocality] = useState({ name: "", area: "", city: "Bengaluru" })

  useEffect(() => {
    fetchLocalities()
  }, [])

  const fetchLocalities = async () => {
    try {
      const res = await adminApi.getLocalities()
      setLocalities(res.localities)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLocality.name || !newLocality.area) return
    try {
      await adminApi.createLocality(newLocality)
      setNewLocality({ name: "", area: "", city: "Bengaluru" })
      setShowAdd(false)
      fetchLocalities()
    } catch (e: any) {
      alert(e.message || 'Failed to add locality')
    }
  }

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      await adminApi.updateLocality(id, { isActive: !current })
      fetchLocalities()
    } catch (e) {
      alert('Failed to update locality')
    }
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Localities</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage the areas where PGs can be listed.</p>
        </div>
        <Button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Locality
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Locality Name</label>
            <Input required value={newLocality.name} onChange={e => setNewLocality({...newLocality, name: e.target.value})} placeholder="e.g. Sector 2" className="h-11 rounded-xl" />
          </div>
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Master Area</label>
            <Input required value={newLocality.area} onChange={e => setNewLocality({...newLocality, area: e.target.value})} placeholder="e.g. HSR Layout" className="h-11 rounded-xl" />
          </div>
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">City</label>
            <Input required value={newLocality.city} onChange={e => setNewLocality({...newLocality, city: e.target.value})} className="h-11 rounded-xl" />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button type="button" variant="ghost" onClick={() => setShowAdd(false)} className="h-11 rounded-xl w-full md:w-auto">Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl w-full md:w-auto">Save</Button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading localities...</div>
        ) : localities.length === 0 ? (
          <div className="p-12 text-center">
            <MapPin className="w-10 h-10 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No localities defined.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Locality</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">City</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {localities.map(loc => (
                  <tr key={loc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white mb-1">{loc.area}</div>
                      <div className="text-xs text-slate-500">{loc.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{loc.city}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{loc.slug}</td>
                    <td className="px-6 py-4">
                      {loc.isActive ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
                          <CheckCircle className="w-3 h-3 mr-1" /> Active
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
                          <XCircle className="w-3 h-3 mr-1" /> Disabled
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleStatus(loc.id, loc.isActive)}
                        className={`h-8 rounded-lg ${loc.isActive ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                      >
                        {loc.isActive ? 'Disable' : 'Enable'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
