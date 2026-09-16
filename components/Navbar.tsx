"use client"

import Link from "next/link"
import { Building, Search, Menu, UserCircle2, Globe } from "lucide-react"

export function Navbar() {
  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
      <div className="hidden md:flex max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 items-center justify-between h-20">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-[#FF385C] font-bold text-[22px] shrink-0 tracking-tight hover:opacity-90 transition">
          <div className="w-8 h-8 rounded-full bg-[#FF385C] flex items-center justify-center shadow-sm">
            <Building className="w-4 h-4 text-white" />
          </div>
          <span className="hidden lg:block">StaySure</span>
        </Link>

        {/* Desktop Search Pill */}
        <div className="hidden md:flex items-center justify-center flex-1 mx-6">
          <div className="flex items-center border border-slate-200 shadow-[0_2px_8px_rgb(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgb(0,0,0,0.12)] transition-all duration-300 ease-out cursor-pointer rounded-full p-2 pl-6 bg-white gap-2">
            <div className="text-[14px] font-semibold text-slate-800 px-3 hover:text-slate-500 transition">Search area</div>
            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
            <div className="text-[14px] font-semibold text-slate-800 px-3 hover:text-slate-500 transition">Move-in date</div>
            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
            <div className="text-[14px] text-slate-500 font-light flex items-center gap-3 pl-3 pr-1">
              Gender
              <div className="bg-[#FF385C] hover:bg-[#e03150] transition-colors p-2.5 rounded-full text-white">
                <Search className="w-4 h-4 stroke-[2.5px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-1 shrink-0">
          <Link href="/list-your-pg">
            <div className="hidden lg:block text-[14px] font-semibold text-slate-800 py-2.5 px-4 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
              List your PG
            </div>
          </Link>
          <div className="hidden lg:flex p-3 hover:bg-slate-100 rounded-full cursor-pointer transition-colors mx-1">
            <Globe className="w-[18px] h-[18px] text-slate-700" />
          </div>
          <Link href="/auth">
            <div className="p-2 md:py-1.5 md:pl-3 md:pr-1.5 border border-slate-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition-shadow bg-white ml-2">
              <Menu className="w-[18px] h-[18px] text-slate-600" />
              <div className="hidden md:block">
                <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center overflow-hidden">
                  <UserCircle2 className="w-8 h-8 text-white scale-[1.2] mt-1" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Search Pill - Shows only on small screens */}
      <div className="md:hidden px-4 py-4 flex justify-center pb-5">
        <Link href="/search" className="w-full">
          <div className="w-full flex items-center bg-white border border-slate-200 shadow-[0_3px_12px_rgb(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgb(0,0,0,0.12)] transition-shadow rounded-full px-5 py-3.5 gap-4">
            <Search className="w-[22px] h-[22px] text-slate-800 stroke-[2.5px]" />
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-slate-800 leading-none mb-1">Where to?</span>
              <span className="text-[13px] text-slate-500 leading-none">Search area • Move-in date • Gender</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
