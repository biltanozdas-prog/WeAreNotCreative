import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { groq } from 'next-sanity'
import { Header } from '@/components/header'
import { MenuOverlay } from '@/components/menu-overlay'
import { MenuProvider } from '@/lib/menu-context'
import { PreviewBanner } from '@/components/preview-banner'
import { JournalCloseButton } from '@/components/journal-close-button'
import { SiteFooter } from '@/components/site-footer'
import { getClient } from '@/lib/sanity/get-client'
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

const FOOTER_QUERY = groq`*[_type == "siteSettings"][0]{
  email,
  location,
  instagramUrl,
  linkedinUrl,
  spotifyUrl
}`

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteSettings = await getClient(false)
    .fetch<{
      email?: string
      location?: string
      instagramUrl?: string
      linkedinUrl?: string
      spotifyUrl?: string
    } | null>(FOOTER_QUERY, {}, { next: { revalidate: 300 } })
    .catch((e) => {
      console.warn('[layout] siteSettings fetch failed:', e)
      return null
    })

  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <MenuProvider>
          <Header />
          <MenuOverlay />
          <JournalCloseButton />
          {children}
        </MenuProvider>
        <SiteFooter
          email={siteSettings?.email}
          location={siteSettings?.location}
          instagramUrl={siteSettings?.instagramUrl}
          linkedinUrl={siteSettings?.linkedinUrl}
          spotifyUrl={siteSettings?.spotifyUrl}
        />
        <PreviewBanner />
        <Analytics />
      </body>
    </html>
  )
}
