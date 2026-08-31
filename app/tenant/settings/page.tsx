"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldCheck, UploadCloud, User, FileText, CheckCircle2, Loader2 } from "lucide-react"
import { authApi } from "@/lib/apiClient"

export default function TenantSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    authApi.getMe()
      .then(res => {
        if (res?.user) {
          setUser(res.user)
          setName(res.user.name || "")
          setPhone(res.user.phone || "")
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await authApi.updateProfile({ name, phone })
      alert("Profile updated successfully")
    } catch (e: any) {
      alert(e.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-12 text-center text-slate-500 font-medium">Loading profile...</div>

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile & KYC</h2>
        <p className="text-muted-foreground mt-1 text-lg">Manage your personal details and upload verification documents.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="col-span-1 shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-500" /> Personal Details
            </CardTitle>
            <CardDescription className="text-sm">Your basic contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl h-11 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input value={user?.email || ""} disabled className="rounded-xl h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} className="rounded-xl h-11 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
            </div>
            <div className="pt-2">
              <Button onClick={handleSaveProfile} disabled={saving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 shadow-md shadow-indigo-500/20 font-bold transition-all">
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-xl shadow-slate-200/50 dark:shadow-none border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="h-5 w-5" /> KYC Verification
            </CardTitle>
            <CardDescription className="text-sm">Mandatory for booking verified PGs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">Aadhaar Verified</h4>
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-500 mt-1">Your identity has been verified securely.</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center justify-between">
                Upload New Document
                <span className="text-xs text-muted-foreground">PDF, JPG up to 5MB</span>
              </label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                <UploadCloud className="h-8 w-8 text-indigo-500" />
                <span className="text-sm font-medium">Click to upload Government ID</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
