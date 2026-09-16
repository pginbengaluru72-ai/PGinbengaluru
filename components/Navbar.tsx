"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Search, Menu, X, Building } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Don't show navbar on dashboard pages
  if (pathname.startsWith('/owner') || pathname.startsWith('/admin') || pathname.startsWith('/superadmin')) {
    return null
  }

  const isHome = pathname === '/'
  const navClass = isHome
    ? "fixed top-0 left-0 right-0 z-50 bg-transparent"
    : "sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50"

  const textClass = isHome ? "text-white" : "text-slate-900 dark:text-white"
  const linkHover = isHome ? "hover:text-indigo-300" : "hover:text-indigo-600 dark:hover:text-indigo-400"

  return (
    <>
      <nav className={navClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-extrabold tracking-tight ${textClass}`}>
                Stay<span className="text-indigo-500">Sure</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/search" className={`text-sm font-semibold ${textClass} ${linkHover} transition-colors`}>
                Browse PGs
              </Link>
              <Link href="/list-your-pg" className={`text-sm font-semibold ${textClass} ${linkHover} transition-colors`}>
                List Your PG
              </Link>
              <Link href="/about" className={`text-sm font-semibold ${textClass} ${linkHover} transition-colors`}>
                About
              </Link>
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link href="/auth" className="hidden md:block">
                <Button variant={isHome ? "outline" : "default"} size="sm"
                  className={isHome
                    ? "border-white/30 text-white hover:bg-white/10 backdrop-blur-sm rounded-full px-6"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
                  }
                >
                  Owner Login
                </Button>
              </Link>
              <button
                className={`md:hidden p-2 rounded-xl ${textClass}`}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="px-6 py-4 space-y-3">
              <Link href="/search" onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600">
                Browse PGs
              </Link>
              <Link href="/list-your-pg" onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600">
                List Your PG
              </Link>
              <Link href="/about" onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600">
                About
              </Link>
              <Link href="/auth" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl mt-2">
                  Owner Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
