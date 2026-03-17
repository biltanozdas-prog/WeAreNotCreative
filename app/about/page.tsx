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
  // Text content — stays in JSON
  const aboutPath = path.join(process.cwd(), "content", "about.json")
  let aboutData: any = {}
  try {
    aboutData = JSON.parse(fs.readFileSync(aboutPath, "utf8"))
  } catch (e) {}

  const teamPath = path.join(process.cwd(), "content", "team.json")
  let teamData: any = {}
  try {
    teamData = JSON.parse(fs.readFileSync(teamPath, "utf8"))
  } catch (e) {}

  // Gallery + team visibility — fetched from Sanity
  let galleryImages: LightboxImage[] = []
  let showTeamSection = true

  try {
    const aboutDoc = await client.fetch(
      groq`*[_type == "about"][0]{
        showTeamSection,
        "galleryImages": galleryImages[]{
          "src": image.asset->url,
          "alt": coalesce(alt, "Studio interior")
        }
      }`
    )
    if (aboutDoc) {
      galleryImages = (aboutDoc.galleryImages || []).filter((img: any) => img.src)
      // Default showTeamSection to true if the field isn't set yet
      showTeamSection = aboutDoc.showTeamSection !== false
    }
  } catch (e) {
    // CMS unavailable — use defaults (no gallery, team shown)
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

  // DEV PREVIEW: force team section hidden. Revert by removing this line.
  showTeamSection = false

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
