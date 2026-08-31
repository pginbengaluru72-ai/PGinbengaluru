"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Plus, Phone, MessageSquare, ShieldCheck, Search, X, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { ownerApi } from "@/lib/apiClient"

export default function TenantsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const res = await ownerApi.getApplications()
      setApplications(res?.applications || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const filteredApps = applications.filter(t => 
    t.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.propertyName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAccept = async (id: string) => {
    try {
      await ownerApi.acceptApplication(id)
      fetchApplications()
    } catch (e: any) {
      alert(e.message || "Failed to accept application")
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Applications</h2>
          <p className="text-muted-foreground text-sm">Review and accept pending booking applications.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search applicant name, email, or property..."
            className="pl-9 h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && <div className="text-slate-500 font-bold p-4 col-span-full">Loading applications...</div>}
        
        {!loading && filteredApps.length === 0 && (
          <div className="col-span-full text-slate-500 font-bold p-8 bg-slate-50 dark:bg-slate-900 border rounded-2xl border-dashed border-slate-300 dark:border-slate-800 text-center">
            No pending applications found.
          </div>
        )}

        {filteredApps.map((app) => (
          <Card key={app.id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold flex items-center justify-center text-sm">
                    {app.customerName ? app.customerName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">{app.customerName}</CardTitle>
                    <CardDescription className="text-xs text-slate-500">{app.customerEmail}</CardDescription>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300">
                  {app.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Property:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{app.propertyName}</span>
                </div>
                {app.preferredRoomType && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Preferred Room:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{app.preferredRoomType}</span>
                  </div>
                )}
                {app.preferredMoveIn && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Move-in Date:</span>
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      {new Date(app.preferredMoveIn).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {app.message && (
                  <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 italic block mb-1">Message:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{app.message}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => handleAccept(app.publicId)}
                  className="flex-1 text-xs font-bold rounded-xl h-9 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
                </Button>
                <a 
                  href={`mailto:${app.customerEmail}?subject=Regarding your StaySure PG application`}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                  title="Send Email"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
