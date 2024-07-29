import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { Viewport } from 'next'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sinahala Chat Master',
  description: 'Claude AI powered Sinhala Chat Master',
  manifest: '/manifest.json',
  icons: [
    { rel: 'apple-touch-icon', url: '/app-icon-192.png' },
    { rel: 'icon', url: '/favicon.ico' },
  ],
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
      <Toaster />
    </html>
  );
}
