"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Building, LayoutDashboard, Menu, X, LogOut, Settings, Users, ShieldCheck, List, Megaphone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/apiClient"

const ADMIN_NAV = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
  { name: "Owners", href: "/admin/owners", icon: Users },
  { name: "All Properties", href: "/admin/properties", icon: Building },
  { name: "All Leads", href: "/admin/leads", icon: List },
  { name: "Localities", href: "/admin/localities", icon: MapPin },
  { name: "Broadcasts", href: "/admin/broadcast", icon: Megaphone },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authApi.getMe()
      .then(res => {
        if (res.user.role !== 'SUPER_ADMIN') {
          router.replace('/')
        } else {
          setUser(res.user)
        }
      })
      .catch(() => router.replace('/auth'))
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    try {
      await authApi.logout()
      router.push('/auth')
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white flex items-center justify-between p-4 sticky top-0 z-50">
        <div className="flex items-center gap-2 font-extrabold text-xl">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          StaySure Admin
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${mobileMenuOpen ? 'fixed inset-0 z-40 bg-white dark:bg-slate-900 pt-16' : 'hidden'} 
        md:block md:sticky md:top-0 md:h-screen md:w-64 md:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex-col
      `}>
        <div className="hidden md:flex h-16 items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <Link href="/admin" className="flex items-center gap-2 font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            StaySure Admin
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="mb-4 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Super Admin</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
          </div>

          <div className="space-y-1">
            {ADMIN_NAV.map(item => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive 
                      ? 'bg-slate-900 dark:bg-slate-800 text-white' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
