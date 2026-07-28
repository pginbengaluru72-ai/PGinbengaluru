"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ShieldCheck, User, Building, MapPin, ExternalLink, XCircle } from "lucide-react"
import { motion } from "framer-motion"

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

const mockVerifications = [
  { id: "V-901", type: "PG", name: "Star Boys PG", location: "Sector 2, HSR Layout", status: "Pending Review", date: "Today, 10:45 AM", owner: "Ramesh Reddy" },
  { id: "V-902", type: "KYC", name: "Anjali Sharma", location: "Tenant Application", status: "Action Required", date: "Yesterday", owner: "Self" },
  { id: "V-903", type: "PG", name: "Premium Stay Co.", location: "5th Block, Koramangala", status: "Pending Review", date: "Oct 25, 2026", owner: "Syed Ali" },
]

export default function VerificationsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">KYC & Approvals</h2>
          <p className="text-muted-foreground mt-1 text-lg">Review and verify properties and tenants before they go live.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1 shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-black text-amber-500">8</CardTitle>
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
            <CardTitle className="text-4xl font-black text-emerald-500">2,045</CardTitle>
            <CardDescription className="font-semibold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">Total Verified</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="shadow-2xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" /> Action Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="divide-y divide-slate-200/50 dark:divide-slate-800/50"
          >
            {mockVerifications.map((v) => (
              <motion.div key={v.id} variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-white/80 dark:hover:bg-slate-800/30 transition-colors gap-4">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${v.type === 'PG' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'}`}>
                    {v.type === 'PG' ? <Building className="h-6 w-6" /> : <User className="h-6 w-6" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {v.name}
                      <Badge variant="outline" className={v.status === 'Pending Review' ? 'bg-amber-100/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900' : 'bg-red-100/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900'}>
                        {v.status}
                      </Badge>
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.location}</span>
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {v.owner}</span>
                      <span className="text-xs opacity-75">{v.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Docs
                  </Button>
                  <Button className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                    <ShieldCheck className="mr-2 h-4 w-4" /> Approve
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}
