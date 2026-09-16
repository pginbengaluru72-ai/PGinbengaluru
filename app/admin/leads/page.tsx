"use client"

import { useState, useEffect } from "react"
import { Users, Phone, Mail, Clock, Building, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { adminApi } from "@/lib/apiClient"

export default function AdminLeadsPage() {
  const [leadsData, setLeadsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getAllLeads()
      .then(res => setLeadsData(res))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return <div className="p-8 text-slate-500">Loading leads...</div>

  const leads = leadsData?.leads || []

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Platform Leads</h1>
        <p className="text-slate-500 mt-1 text-sm">Monitor lead generation activity across all properties.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {leads.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No leads generated yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Tenant</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Property & Owner</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Source</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white mb-1">
                        {lead.customerName || 'Anonymous Visitor'}
                      </div>
                      <div className="flex flex-col gap-1 mt-1">
                        {lead.customerPhone && (
                          <span className="flex items-center text-xs text-slate-500 font-medium">
                            <Phone className="w-3 h-3 mr-1.5" /> {lead.customerPhone}
                          </span>
                        )}
                        {lead.customerEmail && (
                          <span className="flex items-center text-xs text-slate-500 font-medium">
                            <Mail className="w-3 h-3 mr-1.5" /> {lead.customerEmail}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                        <Building className="w-4 h-4 mr-1.5 text-slate-400" />
                        {lead.propertyName}
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <User className="w-3 h-3 mr-1.5" />
                        Owner: {lead.ownerName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={
                        lead.source === 'WHATSAPP_CLICK' ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20' :
                        lead.source === 'PHONE_CLICK' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                        'bg-slate-100 text-slate-700'
                      }>
                        {lead.source === 'WHATSAPP_CLICK' ? 'WhatsApp' : 
                         lead.source === 'PHONE_CLICK' ? 'Direct Call' : 'Contact Form'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs font-medium text-slate-500">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        {formatDate(lead.createdAt)}
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
