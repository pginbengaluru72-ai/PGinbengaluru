"use client"

import Link from "next/link"
import { Building, Search, Menu, UserCircle2, Globe } from "lucide-react"

export function Navbar() {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="hidden md:flex max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 items-center justify-between h-[80px]">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-[#FF385C] font-bold text-[22px] shrink-0 tracking-tight transition">
          <Building className="w-8 h-8 text-[#FF385C]" />
          <span className="hidden lg:block text-[#FF385C]">StaySure</span>
        </Link>

        {/* Desktop Search Pill */}
        <div className="hidden md:flex items-center justify-center flex-1 mx-6">
          <div className="flex items-center border border-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.18)] transition-shadow duration-200 cursor-pointer rounded-full p-2 pl-6 bg-white gap-2 h-[48px]">
            <div className="text-[14px] font-semibold text-slate-800 px-3 truncate">Search area</div>
            <div className="h-6 w-[1px] bg-slate-300 mx-1"></div>
            <div className="text-[14px] font-semibold text-slate-800 px-3 truncate">Move-in date</div>
            <div className="h-6 w-[1px] bg-slate-300 mx-1"></div>
            <div className="text-[14px] text-slate-500 flex items-center gap-3 pl-3 pr-0.5">
              Gender
              <div className="bg-[#FF385C] p-[9px] rounded-full text-white ml-2">
                <Search className="w-3.5 h-3.5 stroke-[3px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Menu */}
        <div className="flex items-center justify-end gap-1 shrink-0 w-[250px]">
          <Link href="/list-your-pg">
            <div className="hidden lg:block text-[14px] font-semibold text-slate-800 py-3 px-4 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
              List your PG
            </div>
          </Link>
          <div className="hidden lg:flex p-3 hover:bg-slate-100 rounded-full cursor-pointer transition-colors mx-1">
            <Globe className="w-[18px] h-[18px] text-slate-800" />
          </div>
          <Link href="/auth">
            <div className="py-[5px] pl-[12px] pr-[5px] border border-slate-300 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition-shadow bg-white ml-2">
              <Menu className="w-[18px] h-[18px] text-slate-800" />
              <div className="hidden md:block">
                <div className="w-[30px] h-[30px] rounded-full bg-[#717171] flex items-center justify-center overflow-hidden">
                  <UserCircle2 className="w-[30px] h-[30px] text-white scale-[1.1] mt-[3px]" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Search Pill - Shows only on small screens */}
      <div className="md:hidden px-4 py-3 flex justify-center border-b border-slate-200">
        <Link href="/search" className="w-full">
          <div className="w-full flex items-center bg-white border border-slate-300 shadow-[0_3px_10px_rgb(0,0,0,0.1)] rounded-full px-4 py-[10px] gap-4">
            <Search className="w-[20px] h-[20px] text-slate-800 stroke-[2.5px]" />
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-slate-800 leading-tight">Where to?</span>
              <span className="text-[12px] text-slate-500 leading-tight mt-0.5">Search area • Move-in date • Gender</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
