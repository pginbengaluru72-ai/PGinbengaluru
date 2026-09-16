"use client"

import { useState } from "react"
import { MapPin, Bed, ShieldCheck, Wifi, UtensilsCrossed, Car, User, Share2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ContactOwnerSheet } from "@/components/ContactOwnerSheet"
import Link from "next/link"

export default function PropertyDetailClient({ initialData }: { initialData: any }) {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const { property: pg, photos, rooms, ownerName } = initialData
  
  const primaryPhoto = photos?.find((p: any) => p.isPrimary) || photos?.[0]
  const otherPhotos = photos?.filter((p: any) => p.id !== primaryPhoto?.id) || []

  let parsedAmenities: any = {}
  let parsedPolicies: any = {}
  try { parsedAmenities = pg.amenities ? JSON.parse(pg.amenities) : {} } catch {}
  try { parsedPolicies = pg.policies ? JSON.parse(pg.policies) : {} } catch {}

  const typeLabel = pg.type === 'BOYS' ? 'Boys' : pg.type === 'GIRLS' ? 'Girls' : 'Co-Living'
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pg.name,
        text: `Check out this ${typeLabel} PG in ${pg.locality}`,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Navbar spacer */}
      <div className="h-16 md:h-20 bg-white/80 dark:bg-slate-950/80 sticky top-0 z-40 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center px-4 sm:px-6 max-w-7xl mx-auto">
         <Link href="/search" className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
           <ArrowLeft className="w-4 h-4" /> Back to Search
         </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-indigo-500 text-white hover:bg-indigo-600 border-0">{typeLabel} PG</Badge>
              {pg.verifiedAt && (
                <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-0 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{pg.name}</h1>
            <p className="flex items-center text-slate-500 font-medium mt-2">
              <MapPin className="w-4 h-4 text-indigo-500 mr-1 shrink-0" />
              {pg.address}, {pg.locality}, {pg.city} {pg.pincode}
            </p>
          </div>
          
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 sm:gap-4 shrink-0">
            <div className="text-left md:text-right">
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Starting at</p>
              <p className="text-2xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                ₹{pg.startingPrice?.toLocaleString('en-IN')}<span className="text-sm text-slate-500 font-medium">/mo</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleShare} className="h-11 rounded-xl hidden sm:flex">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-10 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 md:row-span-2 h-64 md:h-[400px]">
            <img 
              src={primaryPhoto ? `https://hsrpg-images.pginbengaluru72.workers.dev/${primaryPhoto.r2Key}` : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'} 
              alt="Primary photo" 
              className="w-full h-full object-cover"
            />
          </div>
          {otherPhotos.slice(0, 4).map((photo: any, i: number) => (
            <div key={photo.id} className={`hidden md:block h-[196px] ${otherPhotos.length < 4 && i === otherPhotos.length - 1 ? 'md:col-span-2' : ''}`}>
              <img 
                src={`https://hsrpg-images.pginbengaluru72.workers.dev/${photo.r2Key}`} 
                alt={`PG photo ${i+1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <section>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4">About this PG</h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                {pg.description ? (
                  <p>{pg.description}</p>
                ) : (
                  <p>A premium {typeLabel.toLowerCase()} paying guest accommodation located in the heart of {pg.locality}. Offers standard amenities and a safe environment for students and professionals.</p>
                )}
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {parsedAmenities.wifi && <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium"><Wifi className="w-5 h-5 text-indigo-500" /> High-speed WiFi</div>}
                {parsedAmenities.food && <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium"><UtensilsCrossed className="w-5 h-5 text-indigo-500" /> Daily Meals</div>}
                {parsedAmenities.parking && <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium"><Car className="w-5 h-5 text-indigo-500" /> Parking Available</div>}
                {parsedAmenities.laundry && <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium"><span className="w-5 h-5 text-indigo-500 flex items-center justify-center font-bold">L</span> Laundry Service</div>}
                {parsedAmenities.cctv && <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium"><ShieldCheck className="w-5 h-5 text-indigo-500" /> CCTV Security</div>}
              </div>
            </section>

            {/* Rooms & Pricing */}
            <section>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4">Room Availability & Pricing</h2>
              {rooms && rooms.length > 0 ? (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Sharing Type</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Amenities</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Price/mo</th>
                        <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {rooms.map((room: any) => (
                        <tr key={room.id} className="bg-white dark:bg-slate-950">
                          <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">
                            {room.sharingType === 1 ? 'Single Sharing' : `${room.sharingType} Sharing`}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-500">
                            {room.hasAc ? 'AC' : 'Non-AC'}{room.hasAttachedBathroom ? ' • Attached Washroom' : ''}
                          </td>
                          <td className="px-4 py-4 font-extrabold text-indigo-600 dark:text-indigo-400">
                            ₹{room.monthlyRent.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-4">
                            {room.availableBeds > 0 ? (
                              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">{room.availableBeds} beds left</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">Full</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 italic">No room details provided by owner yet.</p>
              )}
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
                  <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Listed By Owner</p>
                    <p className="font-extrabold text-slate-900 dark:text-white text-lg">{ownerName}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={() => setIsContactOpen(true)} 
                    className="w-full h-14 rounded-xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                  >
                    Contact Owner
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 mt-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    No Brokerage. No Hidden Fees.
                  </div>
                </div>

              </div>

              {/* Policies Card */}
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                <h3 className="font-extrabold text-slate-900 dark:text-white mb-4">House Rules</h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {parsedPolicies.gateClosing ? <li>• Gate closes at {parsedPolicies.gateClosing}</li> : <li>• No gate closing time mentioned</li>}
                  {parsedPolicies.visitors ? <li>• Visitors {parsedPolicies.visitors}</li> : <li>• Visitors policy not specified</li>}
                  {parsedPolicies.smoking ? <li>• Smoking {parsedPolicies.smoking}</li> : <li>• Smoking prohibited</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Contact CTA (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 md:hidden z-40">
        <Button 
          onClick={() => setIsContactOpen(true)} 
          className="w-full h-14 rounded-xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
        >
          Contact Owner
        </Button>
      </div>

      <ContactOwnerSheet 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)}
        propertyId={pg.publicId}
        propertyName={pg.name}
        whatsappNumber={pg.whatsappNumber}
        ownerName={ownerName}
      />
    </div>
  )
}
