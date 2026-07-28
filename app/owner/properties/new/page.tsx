"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UploadCloud } from "lucide-react"
import Link from "next/link"

type Locality = {
  id: string
  name: string
  city: string
  isActive: boolean
}

export default function AddPropertyPage() {
  const [localities, setLocalities] = useState<Locality[]>([])
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(true)

  useEffect(() => {
    const fetchLocalities = async () => {
      try {
        const res = await fetch("https://hsrpg-api.pginbengaluru72.workers.dev/api/superadmin/localities")
        if (res.ok) {
          const data = await res.json()
          // Only show active localities to owners
          setLocalities(data.filter((l: Locality) => l.isActive))
        }
      } catch (error) {
        console.error("Failed to fetch localities", error)
      } finally {
        setIsLoadingLocalities(false)
      }
    }
    fetchLocalities()
  }, [])

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/owner/properties" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 w-10">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add New Property</h2>
          <p className="text-muted-foreground">Enter the details of your PG to list it on HSRPG.</p>
        </div>
      </div>

      <Card className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border-white dark:border-slate-800 shadow-xl shadow-indigo-100/50 dark:shadow-none">
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
          <CardDescription>What is the name and type of your PG?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold">Property Name</Label>
            <Input id="name" placeholder="e.g., Sunrise Boys PG" className="h-11 bg-slate-50 dark:bg-slate-950" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="font-bold">Property Type</Label>
              <select id="type" className="flex h-11 w-full rounded-md border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 font-medium">
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="colive">Co-live</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="font-bold">Owner WhatsApp Number</Label>
              <Input id="whatsapp" placeholder="+91 98765 43210" className="h-11 bg-slate-50 dark:bg-slate-950" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border-white dark:border-slate-800 shadow-xl shadow-indigo-100/50 dark:shadow-none">
        <CardHeader>
          <CardTitle>Location</CardTitle>
          <CardDescription>Where exactly is this PG located?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="locality" className="font-bold">Locality</Label>
              <select 
                id="locality" 
                className="flex h-11 w-full rounded-md border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 font-medium"
                disabled={isLoadingLocalities}
              >
                {isLoadingLocalities ? (
                  <option>Loading active areas...</option>
                ) : localities.length > 0 ? (
                  localities.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}, {loc.city}</option>
                  ))
                ) : (
                  <option disabled>No active areas available</option>
                )}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sector" className="font-bold">Sector / Block</Label>
              <Input id="sector" placeholder="e.g., Sector 2" className="h-11 bg-slate-50 dark:bg-slate-950" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="font-bold">Full Address</Label>
            <Input id="address" placeholder="House No, Street, Landmark" className="h-11 bg-slate-50 dark:bg-slate-950" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border-white dark:border-slate-800 shadow-xl shadow-indigo-100/50 dark:shadow-none">
        <CardHeader>
          <CardTitle>Photos & Videos</CardTitle>
          <CardDescription>Upload high-quality media for physical verification (Requires R2 Integration).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center hover:bg-indigo-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-950/50">
            <UploadCloud className="mx-auto h-10 w-10 text-indigo-500 mb-4" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">SVG, PNG, JPG or MP4 (max. 800x400px)</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" className="h-12 px-6 font-bold rounded-xl border-slate-200">Save as Draft</Button>
        <Button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:-translate-y-0.5">Publish Property</Button>
      </div>
    </div>
  )
}
