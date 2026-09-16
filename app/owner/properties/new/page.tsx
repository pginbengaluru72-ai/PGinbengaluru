"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building, MapPin, IndianRupee, Image as ImageIcon, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ownerApi, publicApi } from "@/lib/apiClient"

export default function NewPropertyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    type: "BOYS",
    locality: "",
    city: "Bengaluru",
    address: "",
    pincode: "",
    whatsappNumber: "",
    description: "",
    startingPrice: "",
    listPublicly: false
  })

  // Basic step validation
  const canProceed = () => {
    if (step === 1) return formData.name && formData.type && formData.whatsappNumber
    if (step === 2) return formData.locality && formData.address && formData.pincode
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await ownerApi.createProperty({
        ...formData,
        amenities: { wifi: true, food: false, cctv: true }, // Defaults for now
        listPublicly: true // Always submit for verification for now
      })
      
      // Redirect to the property edit page (or dashboard) after creation
      router.push('/owner/properties')
    } catch (err: any) {
      alert(err.message || 'Failed to create property')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">List New Property</h1>
        <p className="text-slate-500 mt-1 text-sm">Add your PG details to start receiving leads.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex flex-col items-center flex-1 relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors ${
              step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
            <span className={`text-xs mt-2 font-bold ${step >= s ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
              {s === 1 ? 'Basic Details' : s === 2 ? 'Location' : 'Submit'}
            </span>
            {s < 3 && (
              <div className={`absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 ${
                step > s ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Building className="w-5 h-5" />
              <h3 className="font-bold text-lg">Basic Details</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Property Name *</Label>
                <Input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. StaySure Luxury PG"
                  className="mt-1.5 h-12 rounded-xl bg-slate-50 dark:bg-slate-950/50" 
                />
              </div>

              <div>
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Property Type *</Label>
                <div className="grid grid-cols-3 gap-3 mt-1.5">
                  {['BOYS', 'GIRLS', 'COLIVING'].map(type => (
                    <div 
                      key={type}
                      onClick={() => setFormData({...formData, type})}
                      className={`h-12 rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer border-2 transition-all ${
                        formData.type === type 
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {type === 'COLIVING' ? 'Co-Living' : type === 'BOYS' ? 'Boys' : 'Girls'}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">WhatsApp Number for Leads *</Label>
                <Input 
                  required
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={e => setFormData({...formData, whatsappNumber: e.target.value})}
                  placeholder="9876543210"
                  className="mt-1.5 h-12 rounded-xl bg-slate-50 dark:bg-slate-950/50" 
                />
                <p className="text-xs text-slate-500 mt-1">Tenants will contact you directly on this number.</p>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Starting Price / Month (₹)</Label>
                <Input 
                  type="number"
                  value={formData.startingPrice}
                  onChange={e => setFormData({...formData, startingPrice: e.target.value})}
                  placeholder="e.g. 5000"
                  className="mt-1.5 h-12 rounded-xl bg-slate-50 dark:bg-slate-950/50" 
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <MapPin className="w-5 h-5" />
              <h3 className="font-bold text-lg">Location Details</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Locality / Area *</Label>
                <Input 
                  required
                  value={formData.locality}
                  onChange={e => setFormData({...formData, locality: e.target.value})}
                  placeholder="e.g. HSR Layout Sector 2"
                  className="mt-1.5 h-12 rounded-xl bg-slate-50 dark:bg-slate-950/50" 
                />
              </div>

              <div>
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Full Address *</Label>
                <Textarea 
                  required
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Enter complete address..."
                  className="mt-1.5 min-h-[100px] rounded-xl bg-slate-50 dark:bg-slate-950/50" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">City</Label>
                  <Input disabled value="Bengaluru" className="mt-1.5 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500" />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Pincode *</Label>
                  <Input 
                    required
                    type="number"
                    value={formData.pincode}
                    onChange={e => setFormData({...formData, pincode: e.target.value})}
                    placeholder="e.g. 560102"
                    className="mt-1.5 h-12 rounded-xl bg-slate-50 dark:bg-slate-950/50" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center py-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Ready to Submit</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Your property "{formData.name}" is ready. After submission, you can add rooms and photos from the property management page.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-xl h-12 px-6 font-bold">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          ) : (
            <Link href="/owner/properties">
              <Button variant="ghost" className="rounded-xl h-12 px-6 font-bold text-slate-500">Cancel</Button>
            </Link>
          )}

          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-indigo-500/20">
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-emerald-500/20">
              {submitting ? 'Creating...' : 'Submit Property'} <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}
