"use client"

import { useState, useEffect } from "react"
import { Save, User, Lock, Phone, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from "@/lib/apiClient"

export default function OwnerSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const [profileData, setProfileData] = useState({ name: "", phone: "" })
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" })

  useEffect(() => {
    authApi.getMe()
      .then(res => {
        setUser(res.user)
        setProfileData({ name: res.user.name || "", phone: res.user.phone || "" })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await authApi.updateProfile(profileData)
      alert("Profile updated successfully")
    } catch (e: any) {
      alert(e.message || "Failed to update profile")
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingPassword(true)
    try {
      await authApi.changePassword(passwordData)
      alert("Password changed successfully")
      setPasswordData({ currentPassword: "", newPassword: "" })
    } catch (e: any) {
      alert(e.message || "Failed to change password")
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) return <div className="p-8 text-slate-500">Loading settings...</div>

  return (
    <div className="max-w-3xl space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your owner profile and security preferences.</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <User className="w-5 h-5" />
          <h3 className="font-bold text-lg">Profile Information</h3>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Full Name</Label>
              <Input 
                value={profileData.name} 
                onChange={e => setProfileData({...profileData, name: e.target.value})}
                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950/50" 
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email Address</Label>
              <Input 
                disabled 
                value={user?.email} 
                className="h-11 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500" 
              />
              <p className="text-[10px] text-slate-500 mt-1">Email cannot be changed.</p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Contact Phone</Label>
              <Input 
                value={profileData.phone} 
                onChange={e => setProfileData({...profileData, phone: e.target.value})}
                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950/50" 
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={savingProfile} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-indigo-500/20">
              <Save className="w-4 h-4 mr-2" />
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>

      {/* Password Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Lock className="w-5 h-5" />
          <h3 className="font-bold text-lg">Change Password</h3>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div className="space-y-1">
            <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Current Password</Label>
            <Input 
              type="password"
              required
              value={passwordData.currentPassword} 
              onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950/50 max-w-md" 
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">New Password</Label>
            <Input 
              type="password"
              required
              minLength={8}
              value={passwordData.newPassword} 
              onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
              className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950/50 max-w-md" 
            />
          </div>
          
          <div className="flex justify-start pt-4">
            <Button type="submit" disabled={savingPassword} variant="outline" className="border-slate-300 text-slate-700 font-bold rounded-xl h-11 px-6">
              <Save className="w-4 h-4 mr-2" />
              {savingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
