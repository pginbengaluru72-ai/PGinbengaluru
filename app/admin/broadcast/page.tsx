"use client"

import { useState } from "react"
import { Megaphone, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { adminApi } from "@/lib/apiClient"

export default function AdminBroadcastPage() {
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setSubmitting(true)
    setSuccess(false)
    try {
      await adminApi.sendBroadcast({ message: message.trim(), level: 'info', target: 'all' })
      setMessage("")
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (e: any) {
      alert(e.message || 'Failed to send broadcast')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Global Broadcast</h1>
        <p className="text-slate-500 mt-1 text-sm">Send a platform-wide message to all users visiting the site.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Megaphone className="w-5 h-5" />
          <h3 className="font-bold text-lg">New Broadcast Message</h3>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Broadcast message published successfully!
          </div>
        )}

        <form onSubmit={handleBroadcast} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Announcement Text</label>
            <Textarea 
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="e.g. Welcome to StaySure! We are currently undergoing scheduled maintenance..."
              className="min-h-[150px] rounded-2xl bg-slate-50 dark:bg-slate-950/50 p-4"
            />
            <p className="text-xs text-slate-500">This message will appear as a banner at the top of the public website.</p>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={submitting || !message.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-12 px-8 shadow-lg shadow-indigo-500/20">
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'Publishing...' : 'Publish Broadcast'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
