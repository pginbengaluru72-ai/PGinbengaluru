"use client"

import { useState, useEffect } from "react"
import { Shield, Key, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { adminApi, authApi } from "@/lib/apiClient"

export default function AdminSettingsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    authApi.getMe().then(res => setUser(res.user)).catch(console.error)
    adminApi.getAuditLogs(1)
      .then(res => setLogs(res.logs))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Settings & Security</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage security settings and view platform audit logs.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Key className="w-5 h-5" />
          <h3 className="font-bold text-lg">My Account</h3>
        </div>
        <div className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Name</label>
            <Input disabled value={user?.name || ''} className="h-11 rounded-xl bg-slate-100 dark:bg-slate-900" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email (Admin ID)</label>
            <Input disabled value={user?.email || ''} className="h-11 rounded-xl bg-slate-100 dark:bg-slate-900" />
          </div>
          <Button variant="outline" className="mt-4 rounded-xl font-bold">Change Password</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 text-slate-900 dark:text-white">
          <Shield className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-lg">System Audit Logs</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No logs recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950/50">
                <tr>
                  <th className="px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Time</th>
                  <th className="px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Actor</th>
                  <th className="px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Action</th>
                  <th className="px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Target Entity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-900 dark:text-slate-300">
                      {log.actorRole === 'SUPER_ADMIN' ? 'Admin' : 'Owner'} ({log.actorId.substring(0,8)})
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-indigo-600 dark:text-indigo-400">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {log.entityType}: {log.entityId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
