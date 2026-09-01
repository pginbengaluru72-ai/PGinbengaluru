"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Plus, Phone, MessageSquare, ShieldCheck, Search, X, CheckCircle2, Clock, Loader2, Building, Mail, Copy, Send } from "lucide-react"
import { ownerApi } from "@/lib/apiClient"
import { motion, AnimatePresence } from "framer-motion"

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<{ email: string, password: string } | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', propertyId: '' })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [tRes, pRes] = await Promise.all([
        ownerApi.getTenants(),
        ownerApi.getProperties()
      ])
      setTenants(tRes?.tenants || [])
      setProperties(pRes?.properties || [])
      if (pRes?.properties?.length > 0) {
        setFormData(prev => ({ ...prev, propertyId: pRes.properties[0].id }))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredTenants = tenants.filter(t => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.propertyName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await ownerApi.createTenant(formData)
      setSuccessData({ email: formData.email, password: res.generatedPassword })
      fetchData() // Refresh list
    } catch (e: any) {
      alert(e.message || "Failed to create tenant.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = () => {
    if (!successData) return
    const text = `Hi ${formData.name},\n\nYour PG portal account has been created!\n\nLogin URL: https://pginbengaluru.pages.dev/login\nEmail: ${successData.email}\nPassword: ${successData.password}\n\nPlease log in and change your password.`
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <div className="space-y-6 pb-12 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Tenant Management</h2>
          <p className="text-muted-foreground text-sm">View active tenants and provision new portal accounts.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-indigo-500/20">
          <Plus className="w-5 h-5 mr-2" /> Onboard New Tenant
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search tenant name, email, or property..."
            className="pl-9 h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && <div className="text-slate-500 font-bold p-4 col-span-full">Loading tenants...</div>}
        
        {!loading && filteredTenants.length === 0 && (
          <div className="col-span-full text-slate-500 font-bold p-8 bg-slate-50 dark:bg-slate-900 border rounded-2xl border-dashed border-slate-300 dark:border-slate-800 text-center">
            No tenants found in your properties yet.
          </div>
        )}

        {filteredTenants.map((tenant) => (
          <Card key={tenant.userId} className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold flex items-center justify-center text-sm">
                    {tenant.name ? tenant.name.charAt(0).toUpperCase() : 'T'}
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">{tenant.name}</CardTitle>
                    <CardDescription className="text-xs text-slate-500">{tenant.phone || 'No phone provided'}</CardDescription>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">
                  Active
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{tenant.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{tenant.propertyName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-600 dark:text-slate-400">Room {tenant.roomNumber} - Bed {tenant.bedIdentifier}</span>
              </div>

              <div className="pt-2 flex gap-2">
                <a 
                  href={`https://wa.me/${tenant.phone?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center text-xs font-bold rounded-xl h-9 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" /> WhatsApp
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => { if (!successData) setIsModalOpen(false) }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white">Onboard Tenant</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Generate portal access for a new tenant.</p>
                </div>
                {!successData && (
                  <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white dark:bg-slate-900 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                )}
              </div>
              
              <div className="p-6">
                {successData ? (
                  <div className="space-y-6 text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 mb-2">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl text-slate-900 dark:text-white">Account Created!</h3>
                      <p className="font-medium text-slate-500 mt-2">Send these details to your tenant so they can log in.</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{successData.email}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generated Password</span>
                        <p className="font-mono font-black text-lg text-indigo-600 dark:text-indigo-400">{successData.password}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={copyToClipboard} variant="outline" className="flex-1 font-bold rounded-xl h-12">
                        <Copy className="w-4 h-4 mr-2" /> Copy Details
                      </Button>
                      <Button 
                        onClick={() => {
                          setSuccessData(null)
                          setIsModalOpen(false)
                          setFormData({ name: '', email: '', phone: '', propertyId: properties[0]?.id || '' })
                        }} 
                        className="flex-1 font-bold rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Property</label>
                      <select 
                        required
                        value={formData.propertyId}
                        onChange={e => setFormData({...formData, propertyId: e.target.value})}
                        className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium text-slate-900 dark:text-slate-100"
                      >
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                      <input 
                        required type="text" placeholder="John Doe"
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address (Used for Login)</label>
                      <input 
                        required type="email" placeholder="john@example.com"
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">WhatsApp / Phone Number</label>
                      <input 
                        required type="tel" placeholder="+91 98765 43210"
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium" 
                      />
                    </div>

                    <div className="pt-2">
                      <Button 
                        type="submit" disabled={isSubmitting}
                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center"><Loader2 className="animate-spin h-5 w-5 mr-2" /> Generating Account...</span>
                        ) : (
                          <span className="flex items-center"><Plus className="mr-2 h-5 w-5" /> Generate Tenant Password</span>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
