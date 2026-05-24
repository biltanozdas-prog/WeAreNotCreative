import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { HeroVideo } from "@/components/hero-video"
import { ManifestoWithPhysics } from "@/components/manifesto-with-physics"
import { HomepageJournal } from "@/components/homepage-journal"
import { RevealSection } from "@/components/reveal-section"
// Revalidate the homepage every 10 seconds to bypass Vercel Webhook setup failures
export const revalidate = 10

import { ProjectShowcaseSlider } from "@/components/project-showcase-slider"
import Link from "next/link"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"

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
            "slug": coalesce(slug.current, slug),
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
            "slug": coalesce(slug.current, slug),
            title,
            client,
            industry,
            services,
            excerpt,
            "heroImage": heroImage.asset->url,
            "image": heroImage.asset->url,
            order
          }[coalesce(published, true) == true]
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
      "slug": coalesce(slug.current, slug),
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
    : groq`*[_type == "project" && coalesce(published, true) == true] | order(order asc) ${projectFields}[0...4]`

  let selectedProjects = (homeData?.selectedProjects || []).filter(Boolean)

  if (!selectedProjects.length) {
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
      {/* Spacer for the fixed video hero — 50vh mobile / 100vh desktop */}
      <div className="h-[50vh] md:h-screen" />
      {/* Manifesto — left text, right interactive physics service deck */}
      <ManifestoWithPhysics
        headline={homeData?.headline || undefined}
        body={homeData?.manifestoText || undefined}
      />

      {/* Spacer between manifesto and the project showcase */}
      <div className="h-20 md:h-32 border-b border-foreground" />

      {/* Selected Work — slider keeps its own IntersectionObserver, NOT wrapped
          in RevealSection to avoid clobbering its logo-hide observer. */}
      <ProjectShowcaseSlider projects={selectedProjects as any} />

      {/* Journal preview (Sanity) */}
      <RevealSection delay={0.05}>
        <HomepageJournal />
      </RevealSection>

      {/* Footer CTA */}
      <RevealSection delay={0.1}>
        <section className="bg-background relative z-10 px-8 md:px-[60px] py-20 md:py-28 border-t border-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 items-end">
            {/* Left — large headline + button */}
            <div>
              <p className="font-sans text-[8px] tracking-[.25em] uppercase text-muted-foreground mb-4">
                {homeData?.ctaLabel ?? "Next Step"}
              </p>
              <h2 className="font-sans font-black text-[clamp(32px,5vw,64px)] leading-[.92] tracking-[-0.04em] uppercase text-foreground whitespace-pre-line mb-8">
                {homeData?.ctaHeadline ?? "Let's make something\nworth noticing."}
              </h2>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 font-sans font-medium text-[9px] tracking-[.2em] uppercase text-background bg-foreground px-6 py-3.5 hover:opacity-70 transition-opacity no-underline"
              >
                {homeData?.ctaButtonText ?? "Start a Conversation"}
                <span>→</span>
              </Link>
            </div>

            {/* Right — short statement */}
            <div className="md:pl-16 md:border-l border-foreground/15">
              <p className="font-sans text-[12px] leading-[1.75] text-muted-foreground max-w-[320px]">
                We work with independent brands, cultural institutions and creative leaders who need clarity without compromise.
              </p>
            </div>
          </div>
        </section>
      </RevealSection>
    </main>
  )
}
