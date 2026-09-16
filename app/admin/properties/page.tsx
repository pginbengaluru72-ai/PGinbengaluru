"use client"

import { useState, useEffect } from "react"
import { Building, MapPin, Eye, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { adminApi } from "@/lib/apiClient"
import Link from "next/link"

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    adminApi.getAllProperties()
      .then(res => setProperties(res.properties))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = properties.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.locality.toLowerCase().includes(search.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">All Properties</h1>
        <p className="text-slate-500 mt-1 text-sm">Platform-wide view of all listed PGs.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search properties or owners..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-slate-50 dark:bg-slate-950/50"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading properties...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Building className="w-10 h-10 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No properties found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Property</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Metrics</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        {p.name}
                        <Badge variant="outline" className="text-[10px] py-0">{p.type}</Badge>
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {p.locality}, {p.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{p.ownerName}</div>
                      <div className="text-xs text-slate-500">{p.ownerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={
                        p.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                        p.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-slate-500">
                        <span className="text-slate-900 dark:text-white font-bold">{p.availableBeds}/{p.totalBeds}</span> beds left
                      </div>
                      <div className="text-xs font-medium text-slate-500 mt-1">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{p.leadCount}</span> leads
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/pg/${p.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 hover:text-indigo-600">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
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
