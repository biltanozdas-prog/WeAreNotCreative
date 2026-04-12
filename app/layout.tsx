import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/header'
import { MenuOverlay } from '@/components/menu-overlay'
import { MenuProvider } from '@/lib/menu-context'
import { PreviewBanner } from '@/components/preview-banner'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WEARENOTCREATIVE',
  description: 'A multidisciplinary creative practice rooted in fashion, visual design, art and cultural expression.',
}

export const viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <MenuProvider>
          <Header />
          <MenuOverlay />
          {children}
        </MenuProvider>
        <PreviewBanner />
        <Analytics />
      </body>
    </html>
  )
}
