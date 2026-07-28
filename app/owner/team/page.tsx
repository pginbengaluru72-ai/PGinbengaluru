"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Info, Eye, EyeOff, LayoutGrid, Building, Users, CreditCard, Shield, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function TeamManagementPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  })

  const [modules, setModules] = useState({
    dashboard: true,
    properties: false,
    tenants: true,
    billing: false
  })

  const handleToggleModule = (key: keyof typeof modules) => {
    setModules(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-28">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3.5 flex items-center gap-3">
        <Link href="/owner/settings" className="p-2 text-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Add Team Member</h1>
          <p className="text-xs text-slate-500 font-medium">Manage staff credentials & module permissions</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
        
        {/* Info Banner */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200 font-semibold shadow-sm">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span>Team members login with their own credentials and see only the modules you enable.</span>
        </div>

        {isSaved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Team member added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* PERSONAL DETAILS */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">PERSONAL DETAILS</h3>

            <Card className="bg-white dark:bg-slate-900 rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <Input 
                  required
                  value={form.fullName}
                  onChange={e => setForm({...form, fullName: e.target.value})}
                  placeholder="e.g. Rahul Sharma"
                  className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <Input 
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="rahul@example.com"
                  className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                <Input 
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="10-digit mobile number"
                  className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    placeholder="Min. 6 characters"
                    className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs font-medium pr-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">They can change this from their profile after logging in.</p>
              </div>
            </Card>
          </div>

          {/* MODULE ACCESS */}
          <div className="space-y-3.5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">MODULE ACCESS</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Choose what this team member can see and do</p>
            </div>

            <Card className="bg-white dark:bg-slate-900 rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Dashboard Module */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Dashboard</p>
                    <p className="text-xs text-slate-400 font-medium">{modules.dashboard ? 'Full access' : 'No access'}</p>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={modules.dashboard}
                  onChange={() => handleToggleModule("dashboard")}
                  className="w-5 h-5 accent-blue-600 cursor-pointer rounded"
                />
              </div>

              {/* Properties Module */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Properties</p>
                    <p className="text-xs text-slate-400 font-medium">{modules.properties ? 'Full access' : 'No access'}</p>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={modules.properties}
                  onChange={() => handleToggleModule("properties")}
                  className="w-5 h-5 accent-indigo-600 cursor-pointer rounded"
                />
              </div>

              {/* Tenants Module */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Tenants</p>
                    <p className="text-xs text-slate-400 font-medium">{modules.tenants ? 'Add · Edit' : 'No access'}</p>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={modules.tenants}
                  onChange={() => handleToggleModule("tenants")}
                  className="w-5 h-5 accent-purple-600 cursor-pointer rounded"
                />
              </div>

              {/* Billing Module */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Billing & Financials</p>
                    <p className="text-xs text-slate-400 font-medium">{modules.billing ? 'Full access' : 'No access'}</p>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={modules.billing}
                  onChange={() => handleToggleModule("billing")}
                  className="w-5 h-5 accent-emerald-600 cursor-pointer rounded"
                />
              </div>

            </Card>
          </div>

          <Button type="submit" className="w-full h-13 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/25">
            Save Team Member
          </Button>

        </form>
      </div>
    </div>
  )
}
