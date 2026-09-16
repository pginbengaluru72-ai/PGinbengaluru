import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, Heart, UserCircle2 } from "lucide-react";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StaySure — Bengaluru's #1 Verified PG Marketplace",
    template: "%s | StaySure",
  },
  description: "Find verified PGs in HSR Layout, Koramangala, BTM Layout and more. Zero brokerage, real photos, direct owner contact. India's most trusted PG aggregator.",
  keywords: ["PG in Bengaluru", "PG in HSR Layout", "boys PG", "girls PG", "co-living Bengaluru", "paying guest Bangalore", "verified PG"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StaySure",
  },
  openGraph: {
    title: "StaySure — Bengaluru's #1 Verified PG Marketplace",
    description: "Zero brokerage. Real photos. Physically verified. Find your perfect PG in Bengaluru.",
    url: "https://hsrpg.in",
    siteName: "StaySure",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex items-center justify-around py-3 z-50 pb-safe">
          <Link href="/" className="flex flex-col items-center gap-1 text-[#FF385C]">
            <Search className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Explore</span>
          </Link>
          <Link href="/wishlist" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900">
            <Heart className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Wishlists</span>
          </Link>
          <Link href="/auth" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900">
            <UserCircle2 className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Log in</span>
          </Link>
        </div>
        
        <div className="hidden md:block">
          <Footer />
        </div>
      </body>
    </html>
  );
}
