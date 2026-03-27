import fs from "fs"
import path from "path"
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"
import { LightboxProvider, type LightboxImage } from "@/components/lightbox-provider"
import { LightboxOverlay } from "@/components/lightbox-overlay"
import AboutClient from "./about-client"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  // JSON used only when Sanity document is entirely absent
  const aboutPath = path.join(process.cwd(), "content", "about.json")
  let aboutJsonData: any = {}
  try {
    aboutJsonData = JSON.parse(fs.readFileSync(aboutPath, "utf8"))
  } catch (e) {}

  const teamPath = path.join(process.cwd(), "content", "team.json")
  let teamData: any = {}
  try {
    teamData = JSON.parse(fs.readFileSync(teamPath, "utf8"))
  } catch (e) {}

  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  let galleryImages: LightboxImage[] = []
  let showTeamSection = true
  let aboutData: any = null

  try {
    const aboutDoc = await client.fetch(
      groq`*[_type == "about"][0]{
        eyebrowLabel,
        headline,
        intro,
        positioning,
        showTeamSection,
        ctaLabel,
        ctaHeadline,
        ctaButtonText,
        "galleryImages": galleryImages[]{
          "src": image.asset->url,
          "alt": coalesce(alt, "Studio interior")
        }
      }`
    )

    if (aboutDoc) {
      // Sanity document exists — it is the authoritative source.
      galleryImages = (aboutDoc.galleryImages ?? []).filter((img: any) => img.src)
      showTeamSection = aboutDoc.showTeamSection ?? true
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
      console.warn("[About] Sanity 'about' document not found. Using local JSON fallback. Populate the About Page in Studio.")
      aboutData = aboutJsonData
    }
  } catch (e) {
    console.warn("[About] Sanity fetch failed:", e)
    aboutData = aboutJsonData
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
