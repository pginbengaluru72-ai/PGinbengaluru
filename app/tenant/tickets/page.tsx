"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Wrench, Plus, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { useState } from "react"

const mockTickets = [
  { id: "T-1029", issue: "AC not cooling in Room 204", status: "Open", date: "Oct 24, 2026", priority: "High" },
  { id: "T-1028", issue: "Leaking bathroom faucet", status: "In Progress", date: "Oct 22, 2026", priority: "Medium" },
  { id: "T-0982", issue: "WiFi dropping connection", status: "Resolved", date: "Sep 15, 2026", priority: "Low" },
]

export default function TenantTicketsPage() {
  const [tickets, setTickets] = useState(mockTickets)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Maintenance Hub</h2>
          <p className="text-muted-foreground mt-1 text-lg">Report issues and track repairs for your room.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
          <Plus className="mr-2 h-4 w-4" /> Raise Ticket
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="col-span-1 shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Wrench className="h-5 w-5" /> New Request
            </CardTitle>
            <CardDescription className="text-sm">Describe the issue you are facing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Issue Category</label>
              <select className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Electrical</option>
                <option>Plumbing</option>
                <option>Internet / WiFi</option>
                <option>Cleaning</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[120px]"
                placeholder="Please describe the issue in detail..."
              />
            </div>
            <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 rounded-xl h-11">
              Submit Ticket
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Ticket History</CardTitle>
            <CardDescription className="text-sm">Track the status of your past and current requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden bg-white/40 dark:bg-slate-950/40">
              <div className="grid grid-cols-5 bg-slate-100/50 dark:bg-slate-800/50 p-4 border-b border-slate-200/60 dark:border-slate-800/60 font-semibold text-sm text-slate-700 dark:text-slate-300">
                <div className="col-span-2">Issue</div>
                <div>Status</div>
                <div>Date</div>
                <div className="text-right">ID</div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="grid grid-cols-5 p-4 items-center text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <div className="col-span-2 font-medium flex items-center gap-2">
                      {ticket.priority === "High" ? <AlertCircle className="h-4 w-4 text-red-500 shrink-0" /> : <Wrench className="h-4 w-4 text-slate-400 shrink-0" />}
                      <span className="truncate">{ticket.issue}</span>
                    </div>
                    <div>
                      <Badge variant="outline" className={
                        ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' :
                        ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800' :
                        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800'
                      }>
                        {ticket.status === 'Resolved' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {ticket.status === 'In Progress' && <Clock className="mr-1 h-3 w-3" />}
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="text-slate-500">{ticket.date}</div>
                    <div className="text-right font-mono text-slate-400">{ticket.id}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
