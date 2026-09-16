"use client"

import Link from "next/link"
import { Building, Search, Menu, UserCircle2, Globe, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="hidden md:flex max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 items-center justify-between h-20">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-[#FF385C] font-bold text-xl shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#FF385C] flex items-center justify-center">
            <Building className="w-4 h-4 text-white" />
          </div>
          <span className="hidden lg:block">StaySure</span>
        </Link>

        {/* Desktop Search Pill */}
        <div className="hidden md:flex items-center justify-center flex-1 mx-6">
          <div className="flex items-center border shadow-sm hover:shadow-md transition cursor-pointer rounded-full p-2 pl-6 bg-white gap-4">
            <div className="text-sm font-semibold px-2">Anywhere</div>
            <div className="h-6 border-l border-slate-300"></div>
            <div className="text-sm font-semibold px-2">Any week</div>
            <div className="h-6 border-l border-slate-300"></div>
            <div className="text-sm text-slate-500 font-light flex items-center gap-3 pl-2">
              Add guests
              <div className="bg-[#FF385C] p-2 rounded-full text-white">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/list-your-pg">
            <div className="hidden lg:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-slate-100 transition cursor-pointer">
              List your PG
            </div>
          </Link>
          <div className="hidden lg:flex p-3 hover:bg-slate-100 rounded-full cursor-pointer transition">
            <Globe className="w-4 h-4 text-slate-700" />
          </div>
          <Link href="/auth">
            <div className="p-2 md:py-1 md:px-2 border-[1px] border-slate-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
              <Menu className="w-4 h-4 ml-1 text-slate-600" />
              <div className="hidden md:block">
                <UserCircle2 className="w-8 h-8 text-slate-400" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Search Pill - Shows only on small screens */}
      <div className="md:hidden px-4 py-4 bg-white flex justify-center">
        <Link href="/search" className="w-full">
          <div className="w-full flex items-center bg-white border border-slate-200 shadow-[0_3px_10px_rgb(0,0,0,0.1)] rounded-full px-4 py-3 gap-4">
            <Search className="w-5 h-5 text-slate-800" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800 leading-none">Where to?</span>
              <span className="text-xs text-slate-500 mt-1">Anywhere • Any week • Add guests</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Categories Bar (Desktop only, mobile will be handled in page.tsx for layout flow) */}
    </div>
  )
}
