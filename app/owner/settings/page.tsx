"use client"

import { useState, useEffect } from "react"
import { authApi } from "@/lib/apiClient"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Edit2, Gem, User, Lock, Users, Shield, HelpCircle, Share2, FileText, ChevronRight, Phone, Mail, MessageSquare, CheckCircle2, X, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState({
    name: "Loading...",
    email: "Loading...",
    phone: "Loading..."
  })
  
  // Modals state
  const [activeModal, setActiveModal] = useState<"none" | "profile" | "password" | "premium">("none")
  
  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" })

  const fetchUser = async () => {
    try {
      const res = await authApi.getMe()
      if (res?.user) {
        setProfile({
          name: res.user.name || "Owner",
          email: res.user.email || "",
          phone: res.user.phone || "No phone added"
        })
        setProfileForm({
          name: res.user.name || "",
          phone: res.user.phone || ""
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await authApi.updateProfile({ name: profileForm.name, phone: profileForm.phone })
      await fetchUser() // Refresh UI
      setActiveModal("none")
      alert("Profile updated successfully!")
    } catch (e: any) {
      alert(e.message || "Failed to update profile.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword.length < 8) {
      alert("New password must be at least 8 characters.")
      return
    }
    setIsSubmitting(true)
    try {
      await authApi.changePassword(passwordForm)
      setActiveModal("none")
      setPasswordForm({ currentPassword: "", newPassword: "" })
      alert("Password changed successfully!")
    } catch (e: any) {
      alert(e.message || "Failed to change password.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-28 relative">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
        
        {/* USER PROFILE HEADER CARD */}
        <Card className="bg-white dark:bg-slate-900 rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center gap-4">
            {/* Avatar with Camera Overlay */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 font-black text-white text-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                {profile.name !== "Loading..." ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>
              <button className="w-6 h-6 rounded-full bg-blue-600 text-white border-2 border-white dark:border-slate-900 flex items-center justify-center absolute -bottom-1 -right-1 shadow hover:scale-105 transition-transform">
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 space-y-0.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{profile.name}</h2>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Mail className="w-3 h-3" /> {profile.email}
              </p>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" /> {profile.phone}
              </p>
            </div>

            <button onClick={() => setActiveModal("profile")} className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* GO PREMIUM VIBRANT PURPLE BANNER */}
        <div onClick={() => setActiveModal("premium")} className="block cursor-pointer">
          <div className="p-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white rounded-3xl shadow-lg shadow-purple-500/20 flex items-center justify-between group hover:scale-[1.01] transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-yellow-300">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight">Remove Ads · Go Premium</p>
                <p className="text-xs text-purple-200 font-semibold">Only ₹99/month</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ACTION ITEMS MENU LIST */}
        <Card className="bg-white dark:bg-slate-900 rounded-3xl border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
          
          {/* Get Premium */}
          <button onClick={() => setActiveModal("premium")} className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                <Gem className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Get Premium</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Edit Profile */}
          <button onClick={() => setActiveModal("profile")} className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Edit Profile</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Change Password */}
          <button onClick={() => setActiveModal("password")} className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Change Password</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Staff Management */}
          <Link href="/owner/team" className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Staff Management</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Manage Team */}
          <Link href="/owner/team" className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Manage Team</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Help & Support with Quick Contact Buttons */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Help & Support</span>
            </div>

            {/* WhatsApp, Call, Email icons */}
            <div className="flex items-center gap-2">
              <a 
                href="https://wa.me/919019465897"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <a 
                href="tel:9019465897"
                className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a 
                href="mailto:support@staysure.in"
                className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 border border-red-200 dark:bg-red-950 dark:border-red-800 dark:text-red-400 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Card>

      </div>

      {/* --- MODALS --- */}
      
      {/* Edit Profile Modal */}
      {activeModal === "profile" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Edit Profile</h3>
              <button onClick={() => setActiveModal("none")} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold">Full Name</Label>
                <Input 
                  id="name" 
                  value={profileForm.name}
                  onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={profileForm.phone}
                  onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="pt-2">
                <Button disabled={isSubmitting} type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md">
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {activeModal === "password" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Change Password</h3>
              <button onClick={() => setActiveModal("none")} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currPass" className="text-xs font-bold">Current Password</Label>
                <Input 
                  id="currPass" 
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPass" className="text-xs font-bold">New Password</Label>
                <Input 
                  id="newPass" 
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="pt-2">
                <Button disabled={isSubmitting} type="submit" className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow-md">
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {activeModal === "premium" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800"></div>
            
            <div className="relative pt-8 px-6 pb-6 text-center space-y-6">
              <button onClick={() => setActiveModal("none")} className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md">
                <X className="w-4 h-4" />
              </button>

              <div className="w-20 h-20 mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                <Gem className="w-10 h-10 text-yellow-300" />
              </div>

              <div>
                <h3 className="font-black text-2xl text-slate-900 dark:text-white mt-4 tracking-tight">StaySure Premium</h3>
                <p className="text-sm text-slate-500 font-medium mt-2 max-w-[280px] mx-auto">Unlock advanced analytics, staff roles, automated billing & remove all ads.</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Advanced Occupancy Reports
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Add unlimited Staff & Managers
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> WhatsApp Integration
                </div>
              </div>

              <Button disabled className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/25">
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
