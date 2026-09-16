"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, MessageCircle, Mail, MapPin, CheckCircle, ArrowRight, ShieldCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { publicApi } from "@/lib/apiClient"

type ContactOwnerSheetProps = {
  propertyId: string
  propertyName: string
  whatsappNumber?: string | null
  ownerName?: string
  isOpen: boolean
  onClose: () => void
}

export function ContactOwnerSheet({ propertyId, propertyName, whatsappNumber, ownerName, isOpen, onClose }: ContactOwnerSheetProps) {
  const [step, setStep] = useState<'options' | 'form' | 'success'>('options')
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return

    setSubmitting(true)
    try {
      await publicApi.logLead({
        propertyId,
        source: 'CONTACT_FORM',
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email
      })
      setStep('success')
    } catch (err) {
      console.error('Failed to log lead', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDirectClick = async (source: 'WHATSAPP_CLICK' | 'PHONE_CLICK') => {
    // Log lead in background
    publicApi.logLead({
      propertyId,
      source,
    }).catch(console.error)

    if (source === 'WHATSAPP_CLICK' && whatsappNumber) {
      const message = encodeURIComponent(`Hi, I'm interested in your PG: ${propertyName}. Is it available?`)
      window.open(`https://wa.me/91${whatsappNumber}?text=${message}`, '_blank')
    } else if (source === 'PHONE_CLICK' && whatsappNumber) {
      window.open(`tel:+91${whatsappNumber}`, '_self')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] md:left-1/2 md:-translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Contact Owner</h3>
                <p className="text-xs text-slate-500 font-medium">{propertyName}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6">
              {step === 'options' && (
                <div className="space-y-4">
                  <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-4 flex items-start gap-3 mb-6 border border-indigo-100 dark:border-indigo-900">
                    <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Verified Owner</h4>
                      <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1 leading-relaxed">
                        You are connecting directly with the verified owner. No brokers or middlemen involved.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => handleDirectClick('WHATSAPP_CLICK')}
                      className="h-auto py-4 flex flex-col gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-green-500/20 rounded-xl"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span className="font-bold text-sm">WhatsApp</span>
                    </Button>
                    <Button 
                      onClick={() => handleDirectClick('PHONE_CLICK')}
                      className="h-auto py-4 flex flex-col gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 rounded-xl"
                    >
                      <Phone className="w-6 h-6" />
                      <span className="font-bold text-sm">Call Now</span>
                    </Button>
                  </div>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white dark:bg-slate-900 px-4 text-xs font-medium text-slate-500 uppercase tracking-widest">or</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={() => setStep('form')}
                    className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send an Inquiry
                  </Button>
                </div>
              )}

              {step === 'form' && (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name" className="text-xs font-bold uppercase text-slate-500">Your Name *</Label>
                      <Input 
                        id="name" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1.5 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="mt-1.5 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500">Email (Optional)</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="mt-1.5 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" 
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep('options')} className="flex-1 rounded-xl font-bold text-slate-600 dark:text-slate-400">
                      Back
                    </Button>
                    <Button type="submit" disabled={submitting} className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20">
                      {submitting ? 'Sending...' : 'Submit'}
                    </Button>
                  </div>
                </form>
              )}

              {step === 'success' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">Inquiry Sent!</h4>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                    The owner of {propertyName} has received your details and will contact you shortly.
                  </p>
                  <Button onClick={onClose} className="w-full mt-6 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-200">
                    Done
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
