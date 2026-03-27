import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { HeroVideo } from "@/components/hero-video"
import { ManifestoSection } from "@/components/manifesto-section"
import { ProjectShowcaseSlider } from "@/components/project-showcase-slider"
import Link from "next/link"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: "WEARENOTCREATIVE | Design as a Cultural Practice",
  description: "A multidisciplinary creative studio working across brand identity, art direction, visual systems and product thinking. Istanbul / Global.",
}

export default async function HomePage() {
  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  // In non-preview mode, filter selectedProjects to only published ones.
  // In preview mode, include drafts and unpublished projects.
  const query = preview
    ? groq`
        *[_type == "homepage"][0] {
          "heroVideoUrl": heroVideo.asset->url,
          headline,
          manifestoText,
          aboutText,
          ctaLabel,
          ctaHeadline,
          ctaButtonText,
          selectedProjects[]->{
            _id,
            "slug": slug,
            title,
            client,
            industry,
            services,
            excerpt,
            "heroImage": heroImage.asset->url,
            "image": heroImage.asset->url,
            order
          }
        }
      `
    : groq`
        *[_type == "homepage"][0] {
          "heroVideoUrl": heroVideo.asset->url,
          headline,
          manifestoText,
          aboutText,
          ctaLabel,
          ctaHeadline,
          ctaButtonText,
          "selectedProjects": selectedProjects[]->{
            _id,
            "slug": slug,
            title,
            client,
            industry,
            services,
            excerpt,
            "heroImage": heroImage.asset->url,
            "image": heroImage.asset->url,
            order
          }[published == true]
        }
      `
  let homeData: any = null
  try {
    homeData = await client.fetch(query, {}, { next: { tags: ["homepage"] } })
  } catch (e) {
    console.warn("Sanity fetch failed for homepage.", e)
  }

  const projectFields = `{
      _id,
      "slug": slug,
      title,
      client,
      industry,
      services,
      excerpt,
      "heroImage": heroImage.asset->url,
      "image": heroImage.asset->url,
      order
    }`

  const projectsQuery = preview
    ? groq`*[_type == "project"] | order(order asc) ${projectFields}[0...4]`
    : groq`*[_type == "project" && published == true] | order(order asc) ${projectFields}[0...4]`

  let selectedProjects = homeData?.selectedProjects || []

  if (!selectedProjects.length || !homeData) {
    try {
      selectedProjects = await client.fetch(projectsQuery, {}, { next: { tags: ["project"] } })
    } catch (e) {
      console.warn("Sanity fetch failed for fallback projects.", e)
      selectedProjects = []
    }
  }

  selectedProjects = (selectedProjects || []).filter(Boolean).map((p: any) => ({
    ...p,
    id: p._id,
  })) || []

  return (
    <main>
      <HeroVideo videoUrl={homeData?.heroVideoUrl} />
      {/* Spacer for the video hero area */}
      <div className="h-screen" />
      {/* Content starts after the video */}
      <ManifestoSection
        headline={homeData?.headline ?? ""}
        body={homeData?.manifestoText ?? ""}
      />
      <ProjectShowcaseSlider projects={selectedProjects as any} />

      {/* Footer CTA */}
      <section className="bg-background relative z-10 px-8 py-32 md:px-[60px] md:py-[180px] border-t border-secondary">
        {homeData?.ctaLabel && (
          <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-8 md:mb-12">
            {homeData.ctaLabel}
          </p>
        )}
        {homeData?.ctaHeadline && (
          <h2 className="font-sans font-black text-[clamp(36px,7vw,120px)] leading-[0.85] uppercase text-foreground tracking-[-0.03em] mb-10 md:mb-16">
            {homeData.ctaHeadline}
          </h2>
        )}
        <Link
          href="/contact"
          className="font-sans font-medium text-[14px] md:text-[16px] uppercase tracking-[0.15em] text-foreground no-underline border-b-2 border-foreground pb-1 hover:opacity-60 transition-opacity"
        >
          {homeData?.ctaButtonText ?? "Start a Conversation"}
        </Link>
      </section>
    </main>
  )
}
