"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Search, Heart, UserCircle2 } from "lucide-react"
import Link from "next/link"

// Routes that should NOT show the public Navbar/Footer/Mobile Nav
const DASHBOARD_PREFIXES = ["/admin", "/owner"]

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = DASHBOARD_PREFIXES.some(prefix => pathname.startsWith(prefix))

  if (isDashboard) {
    // Dashboard routes: render children directly without public chrome
    return <>{children}</>
  }

  // Public routes: render full public layout
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex items-center justify-around py-3 z-50 pb-safe">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#FF385C]">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Explore</span>
        </Link>
        <Link href="/wishlist" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900">
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Wishlists</span>
        </Link>
        <Link href="/auth" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900">
          <UserCircle2 className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Log in</span>
        </Link>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  )
}
