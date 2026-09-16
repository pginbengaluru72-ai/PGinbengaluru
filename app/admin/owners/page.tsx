"use client"

import { useState, useEffect } from "react"
import { Users, Mail, Phone, MoreVertical, Building, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { adminApi } from "@/lib/apiClient"

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOwners()
  }, [])

  const fetchOwners = async () => {
    try {
      const res = await adminApi.getOwners()
      setOwners(res.owners)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'disable' : 'enable'} this owner account?`)) return
    try {
      await adminApi.toggleOwner(id)
      fetchOwners()
    } catch (e) {
      alert('Failed to toggle owner status')
    }
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Owner Accounts</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage PG owners registered on the platform.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20">
          Create Owner
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading owners...</div>
        ) : owners.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No owners found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Owner Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Properties</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {owners.map(owner => (
                  <tr key={owner.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white mb-1">{owner.name}</div>
                      <div className="text-xs text-slate-500">{new Date(owner.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center text-xs text-slate-600 dark:text-slate-400 font-medium">
                          <Mail className="w-3 h-3 mr-1.5 text-indigo-500" /> {owner.email}
                        </span>
                        {owner.phone && (
                          <span className="flex items-center text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <Phone className="w-3 h-3 mr-1.5 text-indigo-500" /> {owner.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300">
                        <Building className="w-4 h-4 mr-2 text-slate-400" />
                        {owner.propertyCount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {owner.isActive ? (
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
                        onClick={() => handleToggle(owner.id, owner.isActive)}
                        className={`h-8 rounded-lg ${owner.isActive ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                      >
                        {owner.isActive ? 'Disable' : 'Enable'}
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
