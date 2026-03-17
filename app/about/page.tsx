import fs from "fs"
import path from "path"
import { client } from "@/lib/sanity/client"
import { groq } from "next-sanity"
import { urlFor } from "@/lib/sanity/image"
import { LightboxProvider, type LightboxImage } from "@/components/lightbox-provider"
import { LightboxOverlay } from "@/components/lightbox-overlay"
import AboutClient from "./about-client"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  // Text content — JSON fallback (used if Sanity fields are empty)
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

  // All About fields — fetched from Sanity, fallback to JSON
  let galleryImages: LightboxImage[] = []
  let showTeamSection = true
  let aboutData: any = aboutJsonData

  try {
    const aboutDoc = await client.fetch(
      groq`*[_type == "about"][0]{
        headline,
        intro,
        positioning,
        showTeamSection,
        "galleryImages": galleryImages[]{
          "src": image.asset->url,
          "alt": coalesce(alt, "Studio interior")
        }
      }`
    )
    if (aboutDoc) {
      galleryImages = (aboutDoc.galleryImages || []).filter((img: any) => img.src)
      showTeamSection = aboutDoc.showTeamSection !== false
      // Merge Sanity fields over JSON fallback — only override if Sanity has a value
      aboutData = {
        headline: aboutDoc.headline || aboutJsonData.headline,
        intro: aboutDoc.intro || aboutJsonData.intro,
        positioning: aboutDoc.positioning?.length ? aboutDoc.positioning : aboutJsonData.positioning,
      }
    }
  } catch (e) {
    // CMS unavailable — use JSON fallback for all text fields
  }

  // DEV PREVIEW: fallback placeholder when no Sanity images exist yet.
  // Remove this block once real gallery images are added in the CMS.
  if (galleryImages.length === 0) {
    galleryImages = [
      {
        src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
        alt: "Studio placeholder",
      },
    ]
  }

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
