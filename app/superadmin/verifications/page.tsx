"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ShieldCheck, User, Building, MapPin, ExternalLink, CheckCircle2, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { AppState, PropertyItem } from "@/lib/appState"
import Link from "next/link"

const container: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function VerificationsPage() {
  const [properties, setProperties] = useState<PropertyItem[]>([])

  const syncState = () => {
    setProperties(AppState.getProperties())
  }

  useEffect(() => {
    syncState()
    window.addEventListener("hsrpg_state_change", syncState)
    return () => window.removeEventListener("hsrpg_state_change", syncState)
  }, [])

  const handleApprove = (id: string) => {
    AppState.verifyProperty(id, true)
    syncState()
  }

  const handleReject = (id: string) => {
    AppState.deleteProperty(id)
    syncState()
  }

  const pendingProps = properties.filter(p => !p.isVerified)
  const verifiedProps = properties.filter(p => p.isVerified)

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">KYC & Property Approvals</h2>
          <p className="text-muted-foreground mt-1 text-lg">Review and verify owner properties before they go live for tenants.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1 shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-black text-amber-500">{pendingProps.length}</CardTitle>
            <CardDescription className="font-semibold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">Pending PGs</CardDescription>
          </CardHeader>
        </Card>
        <Card className="col-span-1 shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-black text-blue-500">12</CardTitle>
            <CardDescription className="font-semibold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">Pending KYC</CardDescription>
          </CardHeader>
        </Card>
        <Card className="col-span-1 shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-black text-emerald-500">{verifiedProps.length}</CardTitle>
            <CardDescription className="font-semibold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">Verified & Active PGs</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="shadow-2xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" /> Pending Owner Submissions Queue ({pendingProps.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {pendingProps.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-75" />
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">No Pending Verification Requests</p>
              <p className="text-sm text-slate-500 mt-1">When property owners add new PGs, they will appear here for your review.</p>
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="divide-y divide-slate-200/50 dark:divide-slate-800/50"
            >
              {pendingProps.map((v) => (
                <motion.div key={v.id} variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-white/80 dark:hover:bg-slate-800/30 transition-colors gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {v.name}
                        <Badge variant="outline" className="bg-amber-100/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900 font-bold">
                          Pending Review
                        </Badge>
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium"><MapPin className="h-3.5 w-3.5 text-indigo-500" /> {v.locality}, {v.city}</span>
                        <span className="flex items-center gap-1 font-medium"><User className="h-3.5 w-3.5 text-indigo-500" /> Owner: {v.ownerName}</span>
                        <span className="text-xs opacity-75">{v.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button 
                      onClick={() => handleReject(v.id)}
                      variant="outline" 
                      className="w-full sm:w-auto rounded-xl border-slate-300 dark:border-slate-700 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-bold"
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" /> Reject
                    </Button>
                    <Button 
                      onClick={() => handleApprove(v.id)}
                      className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20"
                    >
                      <ShieldCheck className="mr-1.5 h-4 w-4" /> Approve Listing
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Verified List */}
      <Card className="shadow-xl border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Active Verified PGs ({verifiedProps.length})</CardTitle>
          <CardDescription className="text-xs">Properties currently active and visible to tenants on HSRPG.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {verifiedProps.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    {p.name}
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{p.locality}, {p.city} • {p.type.toUpperCase()}</p>
                </div>
                <Link href="/pg/1" target="_blank">
                  <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold border-slate-200">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Listing
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
