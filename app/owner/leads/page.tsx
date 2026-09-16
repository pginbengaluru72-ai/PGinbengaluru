"use client"

import { useState, useEffect } from "react"
import { Users, Phone, Mail, Clock, MapPin, Building, Calendar, MessageCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ownerApi } from "@/lib/apiClient"

export default function OwnerLeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ownerApi.getLeads()
      .then(res => setLeads(res.leads))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Tenant Leads</h1>
        <p className="text-slate-500 mt-1 text-sm">People who have contacted you directly from your listings.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No leads yet</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              When tenants click on WhatsApp or call you, their details will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Tenant Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Property Inquiry</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Source</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Time</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white mb-1">
                        {lead.customerName || 'Anonymous Visitor'}
                      </div>
                      <div className="flex flex-col gap-1 mt-2">
                        {lead.customerPhone && (
                          <span className="flex items-center text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <Phone className="w-3 h-3 mr-1.5 text-indigo-500" /> {lead.customerPhone}
                          </span>
                        )}
                        {lead.customerEmail && (
                          <span className="flex items-center text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <Mail className="w-3 h-3 mr-1.5 text-indigo-500" /> {lead.customerEmail}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300">
                        <Building className="w-4 h-4 mr-2 text-slate-400" />
                        {lead.propertyName}
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
                    <td className="px-6 py-4 text-right">
                      {lead.customerPhone ? (
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="h-8 rounded-lg border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                            onClick={() => window.open(`https://wa.me/91${lead.customerPhone}`, '_blank')}
                          >
                            <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Reply
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No contact provided</span>
                      )}
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
