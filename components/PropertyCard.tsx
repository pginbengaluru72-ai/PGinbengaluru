"use client"

import Link from "next/link"
import { Heart, Star } from "lucide-react"

interface PropertyCardProps {
  slug: string
  name: string
  type: string
  locality: string
  city: string
  startingPrice: number
  availableBeds: number
  totalBeds: number
  amenities?: Record<string, boolean>
  primaryPhoto?: string
  verified?: boolean
}

export function PropertyCard({ 
  slug, 
  name, 
  type, 
  locality, 
  city, 
  startingPrice,
  availableBeds,
  primaryPhoto,
  verified
}: PropertyCardProps) {
  
  // A placeholder if no photo
  const photoUrl = primaryPhoto 
    ? `https://hsrpg-images.pginbengaluru72.workers.dev/${primaryPhoto}` 
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'

  return (
    <Link href={`/pg/${slug}`} className="group flex flex-col cursor-pointer pb-2">
      <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl mb-3">
        <img 
          src={photoUrl} 
          alt={name}
          className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
        />
        
        {/* Heart Icon (top right) */}
        <div className="absolute top-3 right-3 text-white drop-shadow-md">
          <Heart className="w-6 h-6 stroke-white stroke-[1.5px] hover:fill-black/30 transition active:scale-95" />
        </div>

        {/* Guest Favorite Badge */}
        {verified && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm shadow-md px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="font-bold text-xs text-slate-800">Guest favourite</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5 px-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-slate-900 text-[15px] leading-tight truncate pr-4">
            {locality}, {city}
          </h3>
          <div className="flex items-center gap-1 text-[14px] text-slate-800 shrink-0">
            <Star className="w-3.5 h-3.5 fill-slate-800" />
            <span>4.9</span>
          </div>
        </div>
        
        <p className="text-[14px] text-slate-500 truncate">
          {type === 'BOYS' ? 'Boys PG' : type === 'GIRLS' ? 'Girls PG' : 'Co-Living Space'} • {availableBeds} beds available
        </p>
        
        <p className="text-[14px] text-slate-500 truncate">
          {name}
        </p>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-bold text-slate-900 text-[15px]">₹{startingPrice.toLocaleString()}</span>
          <span className="text-[14px] text-slate-500">month</span>
        </div>
      </div>
    </Link>
  )
}
