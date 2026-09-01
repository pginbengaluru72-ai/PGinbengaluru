"use client"

import { useState, useEffect } from "react"
import PageTransition from "@/components/PageTransition"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, User, ShieldCheck, Settings, AlertTriangle, ShieldAlert } from "lucide-react"
import { adminApi } from "@/lib/apiClient"

export default function ReportsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getAuditLogs()
      .then(res => setLogs(res?.logs || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const getActionIcon = (action: string) => {
    if (action.includes("VERIFIED")) return <ShieldCheck className="w-4 h-4" />
    if (action.includes("CREATED")) return <User className="w-4 h-4" />
    if (action.includes("REJECTED")) return <ShieldAlert className="w-4 h-4 text-red-500" />
    return <Settings className="w-4 h-4" />
  }

  const getActionColor = (action: string) => {
    if (action.includes("VERIFIED")) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
    if (action.includes("CREATED")) return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
    if (action.includes("REJECTED")) return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
    return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Audit Logs</h1>
          <p className="text-muted-foreground mt-2 font-medium">Review platform activity, owner verifications, and system modifications.</p>
        </div>

        <Card className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl border-white dark:border-slate-800 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Recent Administrative Actions</CardTitle>
                <CardDescription>Live feed of security and moderation events.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <div className="p-8 text-center font-medium text-slate-500">Loading audit logs...</div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center font-medium text-slate-500">No recent activity.</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getActionColor(log.action)} border-0 font-bold text-xs flex items-center gap-1.5`}>
                        {getActionIcon(log.action)}
                        {log.action.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{log.actorRole}</span> 
                      performed action on <span className="font-bold">{log.entityType}</span> (ID: {log.entityId.slice(0,8)}...)
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
