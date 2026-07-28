"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, QrCode, Phone, Bell, Save, CheckCircle2 } from "lucide-react"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    name: "Ramesh Reddy",
    email: "ramesh.reddy@hsrpg.in",
    phone: "+91 98765 43210",
    upiId: "rameshreddy@upi",
    whatsappAlerts: true,
    autoReminders: true
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Owner Settings</h2>
        <p className="text-muted-foreground text-sm">Configure your personal details, UPI payment receiving ID, and notification alerts.</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Personal & Contact Info</CardTitle>
            <CardDescription>This information is used for tenant communication and lead inquiries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sName" className="font-bold">Full Name</Label>
              <Input 
                id="sName" 
                value={profile.name} 
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sEmail" className="font-bold">Email Address</Label>
                <Input 
                  id="sEmail" 
                  type="email"
                  value={profile.email} 
                  onChange={e => setProfile({...profile, email: e.target.value})}
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sPhone" className="font-bold">WhatsApp / Contact Number</Label>
                <Input 
                  id="sPhone" 
                  value={profile.phone} 
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <QrCode className="w-5 h-5 text-indigo-600" />
              Direct Rent Payment Gateway (UPI)
            </CardTitle>
            <CardDescription>Enter your Google Pay / PhonePe UPI ID to receive 0% brokerage rent directly into your bank.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sUpi" className="font-bold">UPI VPA (Virtual Payment Address)</Label>
              <Input 
                id="sUpi" 
                value={profile.upiId} 
                onChange={e => setProfile({...profile, upiId: e.target.value})}
                placeholder="e.g. yourname@okicici"
                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 font-medium"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              Automated Notifications
            </CardTitle>
            <CardDescription>Manage how you receive tenant inquiries and rent alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">WhatsApp Instant Inquiry Alerts</p>
                <p className="text-xs text-slate-500">Receive instant WhatsApp alerts whenever a prospective tenant sends an inquiry.</p>
              </div>
              <input 
                type="checkbox" 
                checked={profile.whatsappAlerts}
                onChange={e => setProfile({...profile, whatsappAlerts: e.target.checked})}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Automatic Rent Due Reminders</p>
                <p className="text-xs text-slate-500">Automatically ping tenants on the 1st of every month via WhatsApp.</p>
              </div>
              <input 
                type="checkbox" 
                checked={profile.autoReminders}
                onChange={e => setProfile({...profile, autoReminders: e.target.checked})}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-indigo-200 dark:shadow-none">
            <Save className="mr-2 h-4 w-4" /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
