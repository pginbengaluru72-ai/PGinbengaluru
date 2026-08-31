"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Send, AlertTriangle, Info, BellRing, Building, Users, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function BroadcastPage() {
  const [broadcasts, setBroadcasts] = useState<any[]>([
    { id: '1', level: 'warning', target: 'all', message: 'Platform maintenance scheduled for tonight at 2 AM.', createdAt: 'Just now' },
    { id: '2', level: 'info', target: 'owners', message: 'New property verification process is now live.', createdAt: 'Yesterday' }
  ])
  const [selectedAudience, setSelectedAudience] = useState<"all" | "owners" | "tenants">("all")
  const [level, setLevel] = useState<"info" | "warning">("info")
  const [message, setMessage] = useState("")
  const [sentNotice, setSentNotice] = useState(false)

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newBroadcast = {
      id: Date.now().toString(),
      level,
      target: selectedAudience,
      message: message.trim(),
      createdAt: 'Just now'
    }

    setBroadcasts(prev => [newBroadcast, ...prev])
    setMessage("")
    setSentNotice(true)
    setTimeout(() => setSentNotice(false), 3000)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Global Broadcast Center</h2>
        <p className="text-muted-foreground mt-1 text-lg">Send real-time alerts, maintenance notices, and platform updates to all users.</p>
      </div>

      {sentNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          Broadcast pushed live! All online Owners & Tenants will see your message immediately.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card className="shadow-2xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl">
            <CardHeader className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Send className="h-5 w-5 text-indigo-500" /> Compose Platform Announcement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSendBroadcast} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Target Audience</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      type="button"
                      onClick={() => setSelectedAudience("all")} 
                      className={`p-3.5 rounded-xl border-2 transition-all text-xs font-bold flex flex-col items-center gap-2 ${selectedAudience === 'all' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'}`}
                    >
                      <Activity className="h-5 w-5" /> All Users
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedAudience("owners")} 
                      className={`p-3.5 rounded-xl border-2 transition-all text-xs font-bold flex flex-col items-center gap-2 ${selectedAudience === 'owners' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'}`}
                    >
                      <Building className="h-5 w-5" /> Owners Only
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedAudience("tenants")} 
                      className={`p-3.5 rounded-xl border-2 transition-all text-xs font-bold flex flex-col items-center gap-2 ${selectedAudience === 'tenants' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'}`}
                    >
                      <Users className="h-5 w-5" /> Tenants Only
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Message Severity</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer text-blue-700 dark:text-blue-300">
                      <input 
                        type="radio" 
                        name="level" 
                        checked={level === "info"}
                        onChange={() => setLevel("info")}
                        className="accent-blue-600 w-4 h-4" 
                      /> 
                      <Info className="h-4 w-4 text-blue-500" /> Standard Info
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer text-amber-700 dark:text-amber-300">
                      <input 
                        type="radio" 
                        name="level" 
                        checked={level === "warning"}
                        onChange={() => setLevel("warning")}
                        className="accent-amber-600 w-4 h-4" 
                      /> 
                      <AlertTriangle className="h-4 w-4 text-amber-500" /> Urgent Warning
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Broadcast Content</label>
                  <textarea 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    className="flex w-full rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[140px] resize-none font-medium"
                    placeholder="Type your platform-wide notification here..."
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20">
                  <BellRing className="mr-2 h-5 w-5" /> Push Broadcast Now
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card className="shadow-xl border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-500" /> Active System Broadcasts ({broadcasts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {broadcasts.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.level === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {b.level}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Target: {b.target}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{b.message}</p>
                    <p className="text-[10px] text-slate-400">{b.createdAt}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
