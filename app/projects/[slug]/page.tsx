import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { client } from "@/lib/sanity/client"
import { groq } from "next-sanity"
import { PortableText } from "@portabletext/react"
import { components } from "@/lib/sanity/portableText"

interface ProjectDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const query = groq`*[_type == "project" && slug == $slug][0]{ title, excerpt }`
    const project = await client.fetch(query, { slug })
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
    const projects = await client.fetch(query)
    return projects.map((project: { slug: string }) => ({
      slug: project.slug,
    }))
  } catch (e) {
    return []
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params

  let projectData: any = null
  let nextProject: any = null

  try {
    const query = groq`*[_type == "project" && slug == $slug][0] {
      ...,
      "heroImage": heroImage,
      "image": heroImage
    }`
    projectData = await client.fetch(query, { slug })

    if (!projectData) {
      notFound()
    }

    // Find next project for navigation
    const allQuery = groq`*[_type == "project" && published == true] | order(order asc) { slug, title, client }`
    const allEdges = await client.fetch(allQuery)
    const currentIndex = allEdges.findIndex((e: any) => e.slug === slug)
    if (currentIndex !== -1 && allEdges.length > 0) {
      nextProject = allEdges[(currentIndex + 1) % allEdges.length]
    }
  } catch (e) {
    notFound()
  }

  return (
    <main className="bg-background min-h-screen px-8 pt-[160px] pb-32 md:px-[60px] md:pt-[200px] md:pb-[180px]">
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

      {/* Full Width Hero Image */}
      {projectData.heroImage && (
        <div className="w-full h-[50vh] md:h-[85vh] bg-muted relative overflow-hidden mb-28 md:mb-36">
          <Image
            src={projectData.heroImage.asset ? "" : (typeof projectData.heroImage === 'string' ? projectData.heroImage : "")} // We'll patch this properly once Sanity data comes. For now, graceful fail.
            alt={`${projectData.title} - Full view`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Project Blocks Using PortableText Map */}
      {projectData.blocks && projectData.blocks.length > 0 ? (
        <PortableText value={projectData.blocks} components={components} />
      ) : (
        <div className="mb-24 max-w-[900px]">
          <div className="font-sans font-light text-[18px] md:text-[22px] leading-[1.5] text-foreground/80 whitespace-pre-line prose-p:mb-4">
            {projectData.excerpt || projectData.description || "Project details coming soon."}
          </div>
        </div>
      )}

      {/* Next Project */}
      {nextProject && (
        <div className="border-t border-secondary pt-16 md:pt-24 mt-16 md:mt-24">
          <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-8">
            Next Project
          </p>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group no-underline text-foreground block"
          >
            <h3 className="font-sans font-black text-[clamp(36px,7vw,100px)] leading-[0.85] uppercase text-foreground tracking-[-0.03em] group-hover:opacity-60 transition-opacity">
              {nextProject.title?.replace("\n", " ")}
            </h3>
            <span className="font-sans font-light text-[13px] md:text-[14px] text-muted-foreground tracking-[0.15em] uppercase mt-3 block">
              {nextProject.client}
            </span>
          </Link>
        </div>
      )}
    </main>
  )
}
