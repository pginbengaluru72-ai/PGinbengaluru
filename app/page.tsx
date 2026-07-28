import { HeroSection } from "@/components/HeroSection"
import { FeaturedProperties } from "@/components/FeaturedProperties"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Subtle decorative background for the whole page */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none mix-blend-overlay" />
      
      <HeroSection />
      <FeaturedProperties />
    </main>
  )
}
