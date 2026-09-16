"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Star, Image as ImageIcon, MapPin } from "lucide-react"

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

// Generate a consistent vibrant gradient based on the slug string length
const getGradient = (slug: string) => {
  const gradients = [
    'from-pink-500 to-rose-400',
    'from-indigo-500 to-purple-500',
    'from-cyan-400 to-blue-500',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-teal-500',
    'from-fuchsia-500 to-pink-500',
  ]
  const index = slug.length % gradients.length
  return gradients[index]
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
  const [imageError, setImageError] = useState(false)
  
  // High-quality fallback image (we use gradient if no photo is provided or if it errors)
  const hasPhoto = Boolean(primaryPhoto && !imageError)
  const photoUrl = hasPhoto ? `https://hsrpg-images.pginbengaluru72.workers.dev/${primaryPhoto}` : ''
  const gradientClass = getGradient(slug)

  return (
    <Link href={`/pg/${slug}`} className="group flex flex-col cursor-pointer pb-2">
      <div className="relative aspect-square overflow-hidden rounded-[16px] mb-3 bg-slate-100 flex items-center justify-center">
        {hasPhoto ? (
          <img 
            src={photoUrl} 
            alt={name}
            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${gradientClass} text-white group-hover:scale-105 transition-transform duration-500 ease-out`}>
            <div className="w-full h-full absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            <MapPin className="w-12 h-12 mb-2 opacity-90 drop-shadow-md z-10" />
            <span className="text-[14px] font-bold opacity-90 drop-shadow-md z-10 px-4 text-center leading-tight">{name}</span>
          </div>
        )}
        
        {/* Heart Icon (top right) */}
        <div className="absolute top-3 right-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-10">
          <Heart className="w-[26px] h-[26px] stroke-white stroke-[2px] hover:fill-red-500 hover:stroke-red-500 hover:scale-110 transition-all active:scale-90 fill-black/20" />
        </div>

        {/* Guest Favorite Badge */}
        {verified && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md shadow-md px-2.5 py-1 rounded-full flex items-center gap-1.5 z-10">
            <span className="font-semibold text-[13px] text-slate-900 tracking-tight">Guest favourite</span>
          </div>
        )}
        
        {/* Fake Pagination Dots (Airbnb Style) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-100 shadow-sm"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50 shadow-sm"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50 shadow-sm"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50 shadow-sm"></div>
          <div className="w-1 h-1 rounded-full bg-white opacity-50 shadow-sm"></div>
        </div>
      </div>

      <div className="flex flex-col gap-[1px]">
        <div className="flex justify-between items-start mt-1">
          <h3 className="font-bold text-[#222222] text-[15px] leading-snug truncate pr-4">
            {locality}, {city}
          </h3>
          <div className="flex items-center gap-[3px] text-[15px] text-[#222222] shrink-0">
            <Star className="w-3.5 h-3.5 fill-[#222222] stroke-[#222222]" />
            <span className="font-light">4.9</span>
          </div>
        </div>
        
        <p className="text-[15px] text-[#717171] leading-snug truncate font-light mt-0.5">
          {type === 'BOYS' ? 'Boys PG' : type === 'GIRLS' ? 'Girls PG' : 'Co-Living Space'} • {availableBeds} beds available
        </p>
        
        <p className="text-[15px] text-[#717171] leading-snug truncate font-light">
          {name}
        </p>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-bold text-[#222222] text-[15px]">₹{startingPrice.toLocaleString()}</span>
          <span className="text-[15px] text-[#222222] font-light">month</span>
        </div>
      </div>
    </Link>
  )
}
