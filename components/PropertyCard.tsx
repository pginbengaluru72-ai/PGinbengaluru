"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, ShieldCheck, Wifi, Car, UtensilsCrossed } from "lucide-react"

type PropertyCardProps = {
  slug: string
  name: string
  type: string
  locality: string
  city: string
  startingPrice?: number | null
  availableBeds?: number
  totalBeds?: number
  amenities?: string | null
  primaryPhoto?: string | null
  verified?: boolean
}

export function PropertyCard({ slug, name, type, locality, city, startingPrice, availableBeds, totalBeds, amenities, primaryPhoto, verified }: PropertyCardProps) {
  const typeLabel = type === 'BOYS' ? 'Boys' : type === 'GIRLS' ? 'Girls' : 'Co-Living'
  const typeColor = type === 'BOYS' ? 'bg-blue-500' : type === 'GIRLS' ? 'bg-pink-500' : 'bg-purple-500'

  let parsedAmenities: any = {}
  try {
    parsedAmenities = amenities ? JSON.parse(amenities) : {}
  } catch {}

  const imageUrl = primaryPhoto
    ? `https://hsrpg-images.pginbengaluru72.workers.dev/${primaryPhoto}`
    : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"

  return (
    <Link href={`/pg/${slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-white dark:bg-slate-900 flex flex-col border border-slate-200/60 dark:border-slate-800">
        {/* Image */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-200 shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          {/* Type Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge className={`${typeColor} text-white border-0 py-1 px-2.5 rounded-lg font-bold text-xs shadow-lg`}>
              {typeLabel} PG
            </Badge>
          </div>
          {/* Verified Badge */}
          {verified && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-emerald-500 text-white border-0 py-1 px-2.5 rounded-lg font-bold text-xs shadow-lg flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            </div>
          )}
          {/* Price Overlay */}
          {startingPrice && startingPrice > 0 && (
            <div className="absolute bottom-3 right-3 z-10">
              <Badge className="bg-black/70 text-white backdrop-blur-md border-0 py-1.5 px-3 rounded-xl font-extrabold text-sm shadow-lg">
                ₹{startingPrice.toLocaleString('en-IN')}<span className="text-xs font-normal opacity-80">/mo</span>
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
            {name}
          </h3>
          <div className="flex items-center text-slate-500 text-xs font-medium mb-3">
            <MapPin className="h-3.5 w-3.5 mr-1 text-indigo-500 shrink-0" />
            <span className="line-clamp-1">{locality}, {city}</span>
          </div>

          {/* Quick Amenities */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {parsedAmenities.wifi && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                <Wifi className="w-3 h-3" /> WiFi
              </span>
            )}
            {parsedAmenities.food && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                <UtensilsCrossed className="w-3 h-3" /> Food
              </span>
            )}
            {parsedAmenities.parking && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                <Car className="w-3 h-3" /> Parking
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {availableBeds !== undefined && (
              <div className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-lg ${
                availableBeds > 0
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950'
                  : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950'
              }`}>
                <Bed className="h-3.5 w-3.5 mr-1" />
                {availableBeds > 0 ? `${availableBeds} Beds left` : 'Full'}
              </div>
            )}
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center">
              View Details →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
