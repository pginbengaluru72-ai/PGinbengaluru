import Link from "next/link"
import { Building, MapPin, Phone, Mail } from "lucide-react"

const LOCALITIES = [
  { name: "HSR Layout", slug: "hsr-layout" },
  { name: "Koramangala", slug: "koramangala" },
  { name: "BTM Layout", slug: "btm-layout" },
  { name: "Marathahalli", slug: "marathahalli" },
  { name: "Electronic City", slug: "electronic-city" },
  { name: "Whitefield", slug: "whitefield" },
]

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Stay<span className="text-indigo-400">Sure</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Bengaluru&apos;s most trusted zero-brokerage PG marketplace. Every listing is physically verified by our team.
            </p>
          </div>

          {/* Popular Localities */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Popular Areas</h4>
            <ul className="space-y-2.5">
              {LOCALITIES.map(loc => (
                <li key={loc.slug}>
                  <Link href={`/area/${loc.slug}`} className="flex items-center gap-2 text-sm hover:text-indigo-400 transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    PGs in {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/search" className="text-sm hover:text-indigo-400 transition-colors">Browse All PGs</Link>
              </li>
              <li>
                <Link href="/list-your-pg" className="text-sm hover:text-indigo-400 transition-colors">List Your PG</Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-indigo-400 transition-colors">About StaySure</Link>
              </li>
              <li>
                <Link href="/auth" className="text-sm hover:text-indigo-400 transition-colors">Owner Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                hello@staysure.in
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                HSR Layout, Bengaluru, Karnataka 560102
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} StaySure. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
