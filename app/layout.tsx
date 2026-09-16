import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
