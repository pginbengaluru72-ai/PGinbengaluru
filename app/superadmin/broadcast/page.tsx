"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Send, AlertTriangle, Info, BellRing } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

const container: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function BroadcastPage() {
  const [selectedAudience, setSelectedAudience] = useState("all")

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Global Broadcast</h2>
        <p className="text-muted-foreground mt-1 text-lg">Send system-wide alerts, maintenance notices, and important updates to all users.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card className="shadow-2xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Send className="h-5 w-5 text-indigo-500" /> Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Target Audience</label>
                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => setSelectedAudience("all")} className={`p-4 rounded-xl border-2 transition-all text-sm font-semibold flex flex-col items-center gap-2 ${selectedAudience === 'all' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-md' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                    <Activity className="h-6 w-6" /> All Users
                  </button>
                  <button onClick={() => setSelectedAudience("owners")} className={`p-4 rounded-xl border-2 transition-all text-sm font-semibold flex flex-col items-center gap-2 ${selectedAudience === 'owners' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-md' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                    <Building className="h-6 w-6" /> Owners Only
                  </button>
                  <button onClick={() => setSelectedAudience("tenants")} className={`p-4 rounded-xl border-2 transition-all text-sm font-semibold flex flex-col items-center gap-2 ${selectedAudience === 'tenants' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-md' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                    <Users className="h-6 w-6" /> Tenants Only
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Message Level</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="radio" name="level" className="accent-indigo-600 w-4 h-4" defaultChecked /> 
                    <Info className="h-4 w-4 text-blue-500" /> Standard Info
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="radio" name="level" className="accent-amber-600 w-4 h-4" /> 
                    <AlertTriangle className="h-4 w-4 text-amber-500" /> Warning Alert
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Broadcast Message</label>
                <textarea 
                  className="flex w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[160px] resize-none backdrop-blur-sm transition-all"
                  placeholder="Type your global announcement here..."
                />
              </div>

              <Button className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xl shadow-indigo-500/20 transition-all hover:-translate-y-1">
                <BellRing className="mr-2 h-5 w-5" /> Push Broadcast Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card className="shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-slate-400" /> Recent Broadcasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div key={i} variants={item} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Info</span>
                      <span className="text-xs text-slate-500 font-medium">To: All Users</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">System maintenance scheduled for tonight at 2 AM.</p>
                    <p className="text-xs text-slate-400 mt-2">Oct 26, 2026</p>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function Users(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
function Building(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
}
