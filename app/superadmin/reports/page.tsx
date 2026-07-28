"use client"

import { useState } from "react"
import PageTransition from "@/components/PageTransition"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ShieldOff, Ban, CheckCircle2, UserX } from "lucide-react"

export default function ReportsPage() {
  const [reports, setReports] = useState([
    { id: "rep-1", reporter: "Tenant Rahul S.", target: "Property: HSR Boys Stay #2", reason: "Deposit refund delayed by 15 days", severity: "High", status: "Under Review" },
    { id: "rep-2", reporter: "Super Admin AI Guard", target: "Owner: Ramesh Reddy", reason: "Duplicate PG photos detected", severity: "Medium", status: "Resolved" }
  ])

  const resolveReport = (id: string) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: "Resolved" } : r))
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Reports & Platform Bans</h1>
          <p className="text-muted-foreground mt-2 font-medium">Review tenant complaints, fake listings, and ban offending owner/tenant accounts.</p>
        </div>

        <Card className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl border-white dark:border-slate-800 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Flagged Violations</CardTitle>
                <CardDescription>Escalated tickets requiring Super Admin moderation.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
            {reports.map((rep) => (
              <div key={rep.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-0 font-bold text-xs">
                      {rep.severity} Severity
                    </Badge>
                    <span className="text-xs font-bold text-slate-400">• Reported by {rep.reporter}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{rep.target}</h3>
                  <p className="text-sm font-medium text-slate-500">{rep.reason}</p>
                </div>

                <div className="flex items-center gap-3">
                  {rep.status === 'Resolved' ? (
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-0 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Resolved
                    </Badge>
                  ) : (
                    <>
                      <Button onClick={() => resolveReport(rep.id)} variant="outline" className="font-bold rounded-xl text-xs border-slate-200">
                        Dismiss
                      </Button>
                      <Button onClick={() => resolveReport(rep.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md">
                        <Ban className="w-3.5 h-3.5 mr-1" /> Issue Warning / Ban
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
