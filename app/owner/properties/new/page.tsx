"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Plus, Star, Search, Check, Sparkles, MapPin, Building, Shield, Wifi, Car, Utensils, Shirt, Video, Zap, Droplets, Dumbbell, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ownerApi } from "@/lib/apiClient"

export default function AddPropertyPage() {
  const router = useRouter()
  const [localities, setLocalities] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<{file: File, previewUrl: string}[]>([])
  
  // Facilities state with switches
  const [facilities, setFacilities] = useState({
    wifi: true,
    parking: false,
    food: true,
    laundry: true,
    cleaning: true,
    security: true,
    cctv: true,
    powerBackup: false,
    waterSupply: true,
    gym: false
  })

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "colive" as "boys" | "girls" | "colive",
    startingPrice: "8500",
    listPublicly: true,
    totalRooms: "12",
    contactPhone: "+91 98765 43210",
    country: "India",
    state: "Karnataka",
    city: "Bengaluru",
    streetAddress: "",
    pincode: "560102",
    verifiedLocation: "",
    description: "",
    locality: "Sector 2"
  })

  useEffect(() => {
    // Hardcoded localities for now since there's no public localities API yet
    const activeLocs = [{ id: '1', name: 'Sector 2', city: 'Bengaluru, Karnataka', isActive: true }]
    setLocalities(activeLocs)
    if (activeLocs.length > 0) {
      setFormData(prev => ({ ...prev, locality: activeLocs[0].name }))
    }
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleFacility = (facilityKey: keyof typeof facilities) => {
    setFacilities(prev => ({ ...prev, [facilityKey]: !prev[facilityKey] }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 10 - images.length);
      const newImages = newFiles.map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].previewUrl);
      newImages.splice(index, 1);
      return newImages;
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      alert("Please enter Property Name")
      return
    }

    setIsSubmitting(true)
    
    try {
      const propertyType = formData.type.toUpperCase() === 'COLIVE' ? 'COLIVING' : formData.type.toUpperCase();
      const res = await ownerApi.createProperty({
        name: formData.name,
        type: propertyType,
        locality: formData.locality,
        city: formData.city,
        address: formData.streetAddress || `${formData.locality}, ${formData.city}`,
        whatsappNumber: formData.contactPhone,
        startingPrice: parseInt(formData.startingPrice) || 0,
        pincode: formData.pincode,
        amenities: facilities,
        listPublicly: formData.listPublicly
      })

      // Upload actual images
      if (res?.property) {
        for (const img of images) {
          try {
            await ownerApi.uploadMedia(res.property.id, img.file);
          } catch (err) {
            console.error("Failed to upload image", err);
          }
        }
        await ownerApi.submitProperty(res.property.id)
      }

      router.push("/owner/properties")
    } catch (e: any) {
      alert(e.message || "Failed to create property")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-28">
      
      {/* Mobile-first Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3.5 flex items-center gap-3">
        <Link href="/owner/properties" className="p-2 text-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Add New Property</h1>
          <p className="text-xs text-slate-500 font-medium">Fill in property details</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* PROPERTY IMAGES SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                Property Images <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-bold text-slate-500">{images.length}/10</span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Minimum 2 images required</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Add Image Card */}
              <label 
                className="h-36 rounded-2xl border-2 border-dashed border-blue-400 dark:border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors group"
              >
                <input 
                  type="file" 
                  multiple 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-2">Add Image</span>
              </label>

              {/* Uploaded Images */}
              {images.map((img, i) => (
                <div key={i} className="h-36 rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800 group shadow-sm">
                  <img src={img.previewUrl} alt={`Property ${i}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                  {i === 0 && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-slate-900" /> Cover
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-100/70 dark:bg-slate-900/60 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <span>💡</span> Tap ⭐ to set cover image • Long press image for options
            </div>
          </div>

          {/* BASIC INFORMATION */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">BASIC INFORMATION</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Property Name *</label>
              <Input 
                required 
                value={formData.name}
                onChange={e => handleInputChange("name", e.target.value)}
                placeholder="e.g. Sunrise Boys PG"
                className="h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm"
              />
            </div>

            {/* PG Type Segmented Buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">PG Type *</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange("type", "boys")}
                  className={`h-12 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    formData.type === 'boys' 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  ♂ Boys
                </button>

                <button
                  type="button"
                  onClick={() => handleInputChange("type", "girls")}
                  className={`h-12 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    formData.type === 'girls' 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  ♀ Girls
                </button>

                <button
                  type="button"
                  onClick={() => handleInputChange("type", "COLIVING")}
                  className={`h-12 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    formData.type === 'colive' || formData.type === 'COLIVING'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  👥 Co-ed
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Starting Price (₹/month)</label>
              <Input 
                type="number"
                value={formData.startingPrice}
                onChange={e => handleInputChange("startingPrice", e.target.value)}
                placeholder="8500"
                className="h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm"
              />
            </div>

            {/* Toggle Switch: List Publicly */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">List Publicly</span>
                <span className="text-[11px] text-slate-500">Show this property in tenant search engine</span>
              </div>
              <input 
                type="checkbox"
                checked={formData.listPublicly}
                onChange={e => handleInputChange("listPublicly", e.target.checked)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Rooms</label>
                <Input 
                  value={formData.totalRooms}
                  onChange={e => handleInputChange("totalRooms", e.target.value)}
                  placeholder="12"
                  className="h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Phone</label>
                <Input 
                  value={formData.contactPhone}
                  onChange={e => handleInputChange("contactPhone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* LOCATION DETAILS */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">LOCATION DETAILS</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Country *</label>
                <select 
                  value={formData.country}
                  onChange={e => handleInputChange("country", e.target.value)}
                  className="w-full h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm"
                >
                  <option value="India">India</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">State *</label>
                <select 
                  value={formData.state}
                  onChange={e => handleInputChange("state", e.target.value)}
                  className="w-full h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm"
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City *</label>
                <Input 
                  required
                  value={formData.city}
                  onChange={e => handleInputChange("city", e.target.value)}
                  placeholder="Bengaluru"
                  className="h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Pincode *</label>
                <Input 
                  value={formData.pincode}
                  onChange={e => handleInputChange("pincode", e.target.value)}
                  placeholder="560102"
                  className="h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Street Address *</label>
              <Input 
                required
                value={formData.streetAddress}
                onChange={e => handleInputChange("streetAddress", e.target.value)}
                placeholder="House 14, 27th Main Road, Sector 2, HSR Layout"
                className="h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm"
              />
            </div>

            {/* Google Maps Search Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Verify Location</span>
                <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <p className="text-[11px] text-slate-500">Search to verify your property exists on Google Maps</p>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                <Input 
                  value={formData.verifiedLocation}
                  onChange={e => handleInputChange("verifiedLocation", e.target.value)}
                  placeholder="Search landmark or place on Google Maps..."
                  className="h-12 pl-10 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
              <textarea 
                value={formData.description}
                onChange={e => handleInputChange("description", e.target.value)}
                placeholder="Write a brief description of amenities, atmosphere, rules..."
                className="w-full min-h-[90px] rounded-2xl p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* FACILITIES */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">FACILITIES</h3>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 shadow-sm overflow-hidden">
              {[
                { key: "wifi", label: "Wifi", icon: Wifi },
                { key: "parking", label: "Parking", icon: Car },
                { key: "food", label: "Food", icon: Utensils },
                { key: "laundry", label: "Laundry", icon: Shirt },
                { key: "cleaning", label: "Cleaning", icon: Sparkles },
                { key: "security", label: "Security", icon: Shield },
                { key: "cctv", label: "Cctv", icon: Video },
                { key: "powerBackup", label: "Power Backup", icon: Zap },
                { key: "waterSupply", label: "Water Supply", icon: Droplets },
                { key: "gym", label: "Gym", icon: Dumbbell }
              ].map((f) => {
                const IconComponent = f.icon
                const isChecked = facilities[f.key as keyof typeof facilities]
                return (
                  <div 
                    key={f.key}
                    onClick={() => toggleFacility(f.key as any)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isChecked ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{f.label}</span>
                    </div>

                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Handled by div container
                      className="w-5 h-5 accent-blue-600 cursor-pointer rounded"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sticky Bottom Bar CTA */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-4">
            <div className="max-w-2xl mx-auto">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-13 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-2xl shadow-xl shadow-blue-500/25 transition-transform active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding Property...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" /> Add Property
                  </>
                )}
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
