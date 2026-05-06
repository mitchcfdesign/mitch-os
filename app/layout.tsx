import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
  variable: '--font-geist-sans',
  src: [
    { path: '../public/fonts/geist-sans-latin.woff2', weight: '100 900', style: 'normal' },
    { path: '../public/fonts/geist-sans-latin-ext.woff2', weight: '100 900', style: 'normal' },
    { path: '../public/fonts/geist-sans-cyrillic.woff2', weight: '100 900', style: 'normal' },
  ],
  display: 'swap',
})

const geistMono = localFont({
  variable: '--font-geist-mono',
  src: [
    { path: '../public/fonts/geist-mono-latin.woff2', weight: '100 900', style: 'normal' },
    { path: '../public/fonts/geist-mono-latin-ext.woff2', weight: '100 900', style: 'normal' },
    { path: '../public/fonts/geist-mono-cyrillic.woff2', weight: '100 900', style: 'normal' },
  ],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mitch OS',
  description: 'Field + Business Command Center',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full bg-zinc-950 text-zinc-50">{children}</body>
    </html>
  )
}
