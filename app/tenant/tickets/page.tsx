"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wrench, CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react"
import { customerApi } from "@/lib/apiClient"

export default function TenantTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [category, setCategory] = useState("Electrical")
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High")
  const [issue, setIssue] = useState("")
  const [submittedNotice, setSubmittedNotice] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchTickets = async () => {
    try {
      const res = await customerApi.getTickets()
      if (res?.tickets) setTickets(res.tickets)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!issue.trim()) return

    setSubmitting(true)
    try {
      await customerApi.createTicket({
        subject: `${category} - ${priority}`,
        description: issue.trim()
      })
      setIssue("")
      setSubmittedNotice(true)
      setTimeout(() => setSubmittedNotice(false), 3000)
      fetchTickets() // Refresh the list
    } catch (e: any) {
      alert(e.message || "Failed to submit ticket")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Maintenance Hub</h2>
          <p className="text-muted-foreground mt-1 text-sm">Report issues directly to your PG owner and track repair progress.</p>
        </div>
      </div>

      {submittedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          Maintenance ticket raised! Your PG owner has received the ticket in their dashboard queue.
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="col-span-1 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Wrench className="h-5 w-5" /> Raise New Ticket
            </CardTitle>
            <CardDescription className="text-xs">Describe the room issue for owner action.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold">Issue Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-bold transition-all focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Electrical">Electrical / AC</option>
                  <option value="Plumbing">Plumbing / Tap</option>
                  <option value="Internet / WiFi">Wi-Fi & Internet</option>
                  <option value="Cleaning">Housekeeping & Cleaning</option>
                  <option value="Furniture">Bed & Furniture</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold">Urgency Priority</label>
                <select 
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="flex h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-bold transition-all focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="High">High Urgency</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low / Minor</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold">Issue Description</label>
                <textarea 
                  value={issue}
                  onChange={e => setIssue(e.target.value)}
                  required
                  className="flex w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs min-h-[100px] font-medium resize-none transition-all focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. AC remote is not working and fan speed is stuck..."
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-10 text-xs shadow-md shadow-indigo-500/20 transition-all">
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Maintenance Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Live Ticket Status</CardTitle>
            <CardDescription className="text-xs">Track real-time status updates as your PG owner works on repairs.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No tickets raised yet.
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                <div className="grid grid-cols-5 bg-slate-100 dark:bg-slate-950 p-3.5 font-bold text-xs text-slate-600 dark:text-slate-400">
                  <div className="col-span-3">Issue Description</div>
                  <div>Status</div>
                  <div className="text-right">Ticket ID</div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="grid grid-cols-5 p-3.5 items-center text-xs hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-colors">
                      <div className="col-span-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {ticket.subject.includes("High") ? <AlertCircle className="h-4 w-4 text-red-500 shrink-0" /> : <Wrench className="h-4 w-4 text-slate-400 shrink-0" />}
                        <span className="truncate">{ticket.description}</span>
                      </div>
                      <div>
                        <Badge variant="outline" className={
                          ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 font-bold' :
                          ticket.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 font-bold' :
                          'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 font-bold'
                        }>
                          {ticket.status === 'RESOLVED' && <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" />}
                          {ticket.status === 'IN_PROGRESS' && <Clock className="mr-1 h-3 w-3 text-amber-500" />}
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="text-right font-mono text-slate-400 font-bold">{ticket.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
