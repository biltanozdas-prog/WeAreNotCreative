
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"
import { LightboxProvider, type LightboxImage } from "@/components/lightbox-provider"
import { LightboxOverlay } from "@/components/lightbox-overlay"
import AboutClient from "./about-client"

export const dynamic = "force-dynamic"

export default async function AboutPage() {


  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  let galleryImages: LightboxImage[] = []
  let showTeamSection = true
  let aboutData: any = null
  let teamData: any = { members: [] }

  try {
    const aboutDoc = await client.fetch(
      groq`*[_type == "about"][0]{
        eyebrowLabel,
        headline,
        intro,
        positioning,
        showTeamSection,
        teamMembers[]{
          name,
          title,
          "image": image.asset->url,
          shortBio,
          fullBio
        },
        ctaLabel,
        ctaHeadline,
        ctaButtonText,
        "galleryImages": galleryImages[]{
          "src": image.asset->url,
          "alt": coalesce(alt, "Studio interior")
        }
      }`,
      {},
      { next: { tags: ["about"] } }
    )

    if (aboutDoc) {
      // Sanity document exists — it is the authoritative source.
      galleryImages = (aboutDoc.galleryImages ?? []).filter((img: any) => img.src)
      showTeamSection = aboutDoc.showTeamSection ?? true

      if (aboutDoc.teamMembers && aboutDoc.teamMembers.length > 0) {
        teamData = { members: aboutDoc.teamMembers }
      }

      aboutData = {
        eyebrowLabel: aboutDoc.eyebrowLabel,
        headline: aboutDoc.headline,
        intro: aboutDoc.intro,
        positioning: aboutDoc.positioning ?? [],
        ctaLabel: aboutDoc.ctaLabel,
        ctaHeadline: aboutDoc.ctaHeadline,
        ctaButtonText: aboutDoc.ctaButtonText,
      }
    } else {
      console.warn("[About] Sanity 'about' document not found.")
    }
  } catch (e) {
    console.warn("[About] Sanity fetch failed:", e)
  }

  if (!aboutData) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <h1 className="font-sans font-light text-[12px] uppercase tracking-[0.25em] text-muted-foreground">About Page Configuration Missing</h1>
      </main>
    )
  }

  // No Unsplash placeholder — if gallery is empty in CMS, gallery is empty on site.

  return (
    <LightboxProvider images={galleryImages}>
      <LightboxOverlay />
      <AboutClient
        aboutData={aboutData}
        teamData={teamData}
        galleryImages={galleryImages}
        showTeamSection={showTeamSection}
      />
    </LightboxProvider>
  )
}
