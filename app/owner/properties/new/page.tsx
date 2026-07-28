"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MediaUpload } from "@/components/MediaUpload"
import { AppState, LocalityItem } from "@/lib/appState"

export default function AddPropertyPage() {
  const router = useRouter()
  const [localities, setLocalities] = useState<LocalityItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "boys" as "boys" | "girls" | "colive",
    whatsappNumber: "+91 98765 43210",
    locality: "Sector 2",
    sector: "Sector 2",
    address: "",
    city: "HSR Layout, Bengaluru"
  })

  useEffect(() => {
    // Get localities dynamically created by Super Admin
    const activeLocs = AppState.getLocalities().filter(l => l.isActive)
    setLocalities(activeLocs)
    if (activeLocs.length > 0) {
      setFormData(prev => ({ ...prev, locality: activeLocs[0].name }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.address) {
      alert("Please fill in all required fields (Name and Full Address)")
      return
    }

    setIsSubmitting(true)
    
    // Add to global shared appState (which triggers Super Admin Verification Queue update)
    AppState.addProperty({
      name: formData.name,
      type: formData.type,
      locality: formData.locality,
      city: formData.city,
      address: formData.address,
      whatsappNumber: formData.whatsappNumber,
      totalRooms: 10,
      availableBeds: 6,
      ownerName: "Ramesh Reddy",
      media: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" }]
    })

    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/owner/properties")
    }, 600)
  }

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      <div className="flex items-center gap-4">
        <Link href="/owner/properties" className="inline-flex items-center justify-center rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 h-10 w-10">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Add New Property</h2>
          <p className="text-muted-foreground text-sm">List your PG on HSRPG. Submitted properties go directly to Super Admin for verification.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Basic Details</CardTitle>
            <CardDescription className="text-xs">What is the name and category of your PG?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-bold text-xs">Property Name</Label>
              <Input id="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g., Sunrise Boys PG" className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="font-bold text-xs">Property Category</Label>
                <select id="type" value={formData.type} onChange={handleInputChange} className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 px-3 py-2 text-xs font-bold">
                  <option value="boys">Boys PG</option>
                  <option value="girls">Girls PG</option>
                  <option value="colive">Co-live / Unisex</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber" className="font-bold text-xs">Owner WhatsApp Number</Label>
                <Input id="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} placeholder="+91 98765 43210" className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Location & Address</CardTitle>
            <CardDescription className="text-xs">Select from active localities enabled by Super Admin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locality" className="font-bold text-xs">Super Admin Active Area</Label>
                <select 
                  id="locality" 
                  value={formData.locality}
                  onChange={handleInputChange}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 px-3 py-2 text-xs font-bold"
                >
                  {localities.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}, {loc.city}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector" className="font-bold text-xs">Sector / Landmark</Label>
                <Input id="sector" value={formData.sector} onChange={handleInputChange} placeholder="e.g., Near BDA Complex" className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="font-bold text-xs">Full House Address</Label>
              <Input id="address" required value={formData.address} onChange={handleInputChange} placeholder="House No, Street, Sector, Landmark" className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Photos & Media</CardTitle>
            <CardDescription className="text-xs">Upload photos for Super Admin verification check.</CardDescription>
          </CardHeader>
          <CardContent>
            <MediaUpload onFilesSelected={setSelectedFiles} maxFiles={5} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/owner/properties">
            <Button type="button" variant="outline" className="h-12 px-6 font-bold rounded-xl border-slate-200">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting to Super Admin...
              </>
            ) : (
              'Publish & Send for Approval'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
