"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, XCircle, CheckCircle, Clock, Building, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { adminApi } from "@/lib/apiClient"
import Link from "next/link"

export default function AdminVerificationsPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchVerifications()
  }, [])

  const fetchVerifications = async () => {
    try {
      const res = await adminApi.getVerifications()
      setProperties(res.properties)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (id: string) => {
    if (!confirm('Mark this property as verified and publish it?')) return
    setProcessingId(id)
    try {
      await adminApi.verifyProperty(id)
      setProperties(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      alert('Failed to verify property')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Enter reason for rejection:')
    if (reason === null) return // Cancelled
    setProcessingId(id)
    try {
      await adminApi.rejectProperty(id, reason)
      setProperties(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      alert('Failed to reject property')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Property Verifications</h1>
        <p className="text-slate-500 mt-1 text-sm">Review properties submitted by owners before they go live on the platform.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading queue...</div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Queue is Empty</h3>
            <p className="text-slate-500 text-sm">All submitted properties have been reviewed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Property</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Submitted</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {properties.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        {p.name}
                        <Badge variant="outline" className="text-[10px] py-0">{p.type}</Badge>
                      </div>
                      <div className="text-xs text-slate-500">
                        {p.locality}, {p.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{p.ownerName}</div>
                      <div className="text-xs text-slate-500">{p.ownerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs font-medium text-slate-500">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        {new Date(p.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/pg/${p.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="h-8 rounded-lg">
                          <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                        </Button>
                      </Link>
                      
                      <Button 
                        onClick={() => handleVerify(p.id)} 
                        disabled={processingId === p.id}
                        size="sm" 
                        className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Verify
                      </Button>

                      <Button 
                        onClick={() => handleReject(p.id)} 
                        disabled={processingId === p.id}
                        variant="ghost" 
                        size="sm" 
                        className="h-8 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <XCircle className="w-3.5 h-3.5" />
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
