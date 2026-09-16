import { Button } from "@/components/ui/button"
import { ShieldCheck, CheckCircle2, TrendingUp, Sparkles, MessageCircle } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: 'List Your PG | StaySure',
  description: 'List your PG on Bengaluru\'s most trusted zero-brokerage platform. Get verified tenant leads directly on your WhatsApp.',
}

export default function ListYourPGPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* Hero Section */}
      <section className="bg-indigo-600 pt-20 pb-24 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            100% Free for PG Owners
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Fill your PG faster with <br className="hidden md:block" /> StaySure verified leads.
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
            No brokers. No commissions. Connect directly with tenants looking for PGs in your area.
          </p>
          <div className="pt-4">
            <Link href="/auth">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-lg px-10 py-7 rounded-full shadow-xl">
                Create Owner Account Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Why list on StaySure?</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Zero Commission</h3>
            <p className="text-slate-500 leading-relaxed">
              We never charge any commission or brokerage from you or your tenants. Keep 100% of your rent.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Verified Tenants</h3>
            <p className="text-slate-500 leading-relaxed">
              Get inquiries from genuine students and working professionals looking for PGs in your exact locality.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Direct WhatsApp Leads</h3>
            <p className="text-slate-500 leading-relaxed">
              Tenants contact you directly on your WhatsApp or phone number. No middlemen involved in communication.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Listing is simple</h2>
          </div>
          
          <div className="space-y-6">
            {[
              "Create your free owner account.",
              "Add your PG details, amenities, pricing and rules.",
              "Upload minimum 3 clear photos of your property.",
              "Submit for physical verification by our field team.",
              "Once verified, your PG goes live and you start getting leads!"
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-indigo-600 shrink-0" />
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white mr-2">Step {i + 1}:</span>
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/auth">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg px-10 py-7 rounded-full shadow-lg shadow-indigo-500/20">
                Start Listing Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
