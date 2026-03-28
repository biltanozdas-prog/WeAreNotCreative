import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"
import { urlFor } from "@/lib/sanity/image"
import { LightboxProvider, type LightboxImage } from "@/components/lightbox-provider"
import { LightboxOverlay } from "@/components/lightbox-overlay"
import { ProjectBlocks } from "@/components/project-blocks-client"
import { HeroImageClickable } from "@/components/hero-image-clickable"

// Use Incremental Static Regeneration (ISR) to automatically pull 
// new project data every 10 seconds. This bypasses the need for 
// complex manual Webhook configuration to purge stale caches.
export const revalidate = 10

interface ProjectDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const { isEnabled: preview } = await draftMode()
    const query = groq`*[_type == "project" && slug == $slug][0]{ title, excerpt }`
    const project = await getClient(preview).fetch(query, { slug })
    if (!project) return { title: "Project Not Found" }
    return {
      title: `${project.title?.replace("\n", " ")} | WEARENOTCREATIVE`,
      description: project.excerpt,
    }
  } catch (e) {
    return { title: "Project Not Found" }
  }
}

export async function generateStaticParams() {
  const query = groq`*[_type == "project" && defined(slug)]{ "slug": slug }`
  try {
    const projects = await getClient(false).fetch(query)
    return projects.map((project: { slug: string }) => ({ slug: project.slug }))
  } catch (e) {
    return []
  }
}

// Collect all images in document order for the lightbox
function collectImages(projectData: any): LightboxImage[] {
  const images: LightboxImage[] = []

  // 1. heroImage
  if (projectData.heroImage) {
    images.push({
      src: typeof projectData.heroImage === "string" ? projectData.heroImage : "",
      alt: `${projectData.title} — Hero`,
    })
  }

  // 2. Iterate blocks in order
  const blocks: any[] = projectData.blocks || []
  for (const block of blocks) {
    if (block._type === "fullImage" && block.image) {
      images.push({ src: urlFor(block.image).url(), alt: block.caption || "Full Image" })
    } else if (block._type === "twoColumn" && block.rightImage) {
      images.push({ src: urlFor(block.rightImage).url(), alt: "Column media" })
    } else if (block._type === "gallery" && Array.isArray(block.images)) {
      block.images.slice(0, 4).forEach((img: any, idx: number) => {
        images.push({ src: urlFor(img).url(), alt: `Gallery image ${idx + 1}` })
      })
    }
  }

  return images
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params
  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  let projectData: any = null
  let nextProject: any = null

  try {
    const query = preview
      ? groq`*[_type == "project" && slug == $slug][0] {
          ...,
          "heroImage": heroImage.asset->url,
          "image": heroImage.asset->url
        }`
      : groq`*[_type == "project" && slug == $slug && coalesce(published, true) == true][0] {
          ...,
          "heroImage": heroImage.asset->url,
          "image": heroImage.asset->url
        }`
    projectData = await client.fetch(query, { slug })
    if (!projectData) notFound()

    const allQuery = preview
      ? groq`*[_type == "project"] | order(order asc) { slug, title, client }`
      : groq`*[_type == "project" && published == true] | order(order asc) { slug, title, client }`
    const allEdges = await client.fetch(allQuery)
    const currentIndex = allEdges.findIndex((e: any) => e.slug === slug)
    if (currentIndex !== -1 && allEdges.length > 0) {
      nextProject = allEdges[(currentIndex + 1) % allEdges.length]
    }
  } catch (e) {
    notFound()
  }

  const lightboxImages = collectImages(projectData)
  const hasBlocks = projectData.blocks && projectData.blocks.length > 0

  return (
    <LightboxProvider images={lightboxImages}>
      <LightboxOverlay />

      <main className="bg-background min-h-screen px-8 pt-[160px] pb-32 md:px-[60px] md:pt-[200px] md:pb-[180px]">
        {/* Floating Close Button */}
        <div className="fixed top-24 md:top-32 right-8 md:right-[60px] z-[90] mix-blend-difference">
          <Link
            href="/projects"
            className="font-sans font-black text-[20px] md:text-[24px] text-white tracking-[0.1em] uppercase hover:opacity-60 transition-opacity no-underline bg-transparent"
            aria-label="Back to projects"
          >
            {'[ X ]'}
          </Link>
        </div>

        {/* Header */}
        <header className="mb-24 md:mb-32">
          <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-8">
            {projectData.industry || projectData.category}
          </p>
          <h1 className="font-sans font-black text-[12vw] md:text-[8vw] leading-[0.8] uppercase text-foreground mb-8 md:mb-10 whitespace-pre-line tracking-[-0.04em]">
            {projectData.title}
          </h1>
          <p className="font-sans font-light text-[16px] md:text-[20px] text-foreground/70 max-w-[600px] leading-[1.6]">
            {projectData.excerpt || projectData.description}
          </p>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 md:mt-24 border-t border-secondary pt-8 md:pt-10">
            <div>
              <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">Client</span>
              <span className="font-sans font-medium text-[14px] md:text-[15px] uppercase text-foreground tracking-[0.02em]">{projectData.client}</span>
            </div>
            <div>
              <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">Industry</span>
              <span className="font-sans font-medium text-[14px] md:text-[15px] uppercase text-foreground tracking-[0.02em]">{projectData.industry || projectData.category}</span>
            </div>
            <div>
              <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">Services</span>
              <span className="font-sans font-medium text-[14px] md:text-[15px] uppercase text-foreground tracking-[0.02em]">{projectData.services?.join(" / ")}</span>
            </div>
          </div>
        </header>

        {/* Hero Image — lightbox-aware */}
        {projectData.heroImage && (
          <HeroImageClickable
            src={typeof projectData.heroImage === "string" ? projectData.heroImage : ""}
            alt={`${projectData.title} - Full view`}
          />
        )}

        {/* Project Blocks */}
        {hasBlocks ? (
          <ProjectBlocks blocks={projectData.blocks} />
        ) : (
          <div className="mb-24 max-w-[900px]">
            <div className="font-sans font-light text-[18px] md:text-[22px] leading-[1.5] text-foreground/80 whitespace-pre-line prose-p:mb-4">
              {projectData.excerpt || projectData.description || "Project details coming soon."}
            </div>
          </div>
        )}

        {/* Next Project & Return */}
        {nextProject && (
          <div className="border-t border-secondary pt-16 md:pt-24 mt-16 md:mt-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div>
              <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-8">
                Next Project
              </p>
              <Link href={`/projects/${nextProject.slug}`} className="group no-underline text-foreground block">
                <h3 className="font-sans font-black text-[clamp(36px,7vw,100px)] leading-[0.85] uppercase text-foreground tracking-[-0.03em] group-hover:opacity-60 transition-opacity">
                  {nextProject.title?.replace("\n", " ")}
                </h3>
                <span className="font-sans font-light text-[13px] md:text-[14px] text-muted-foreground tracking-[0.15em] uppercase mt-3 block">
                  {nextProject.client}
                </span>
              </Link>
            </div>

            {/* Bottom navigation removed as per user request */}
          </div>
        )}
      </main>
    </LightboxProvider>
  )
}


