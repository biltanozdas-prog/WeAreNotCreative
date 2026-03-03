import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { TinaMarkdown } from "tinacms/dist/rich-text"

interface ProjectDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const projectPath = path.join(process.cwd(), "content", "projects", `${slug}.md`)
    const fileContent = fs.readFileSync(projectPath, "utf8")
    const { data } = matter(fileContent)
    return {
      title: `${data.title?.replace("\n", " ")} | WEARENOTCREATIVE`,
      description: data.description,
    }
  } catch (e) {
    return { title: "Project Not Found" }
  }
}

export async function generateStaticParams() {
  const projectsDir = path.join(process.cwd(), "content", "projects")
  try {
    const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'))
    return files.map((filename) => ({
      slug: filename.replace(".md", ""),
    }))
  } catch (e) {
    return []
  }
}



export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params

  let projectData: any = null
  let allEdges: any[] = []

  try {
    const projectPath = path.join(process.cwd(), "content", "projects", `${slug}.md`)
    const fileContent = fs.readFileSync(projectPath, "utf8")
    const { data } = matter(fileContent)
    projectData = data

    // Fetch all to find the "next" project
    const projectsDir = path.join(process.cwd(), "content", "projects")
    const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'))
    allEdges = files.map(filename => {
      const fContent = fs.readFileSync(path.join(projectsDir, filename), "utf8")
      const parsed = matter(fContent)
      return { ...parsed.data, filename: filename.replace(".md", "") }
    })
  } catch (e) {
    notFound()
  }

  if (!projectData) {
    notFound()
  }

  // Find next project for navigation
  const currentIndex = allEdges.findIndex((e) => e.filename === slug)
  const nextEdge = allEdges[(currentIndex + 1) % allEdges.length]
  const nextProject = nextEdge ? {
    slug: nextEdge.filename,
    title: nextEdge.title,
    client: nextEdge.client
  } : null

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
      <div className="w-full h-[50vh] md:h-[85vh] bg-muted relative overflow-hidden mb-28 md:mb-36">
        <Image
          src={projectData.heroImage || projectData.image || ""}
          alt={`${projectData.title} - Full view`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Project Blocks */}
      {(projectData.blocks || []).map((block: any, i: number) => {
        switch (block._template) {
          case "fullImage":
            return (
              <div key={i} className="w-full mb-20 md:mb-28 relative overflow-hidden">
                <div className="w-full h-[50vh] md:h-[85vh] bg-muted relative">
                  <Image src={block.image || ""} alt={block.caption || "Full Image"} fill className="object-cover" sizes="100vw" />
                </div>
                {block.caption && (
                  <p className="mt-4 md:mt-6 font-sans font-light text-[12px] md:text-[13px] text-muted-foreground tracking-[0.15em] uppercase text-center">
                    {block.caption}
                  </p>
                )}
              </div>
            )
          case "textBlock":
            return (
              <div key={i} className="mb-20 md:mb-28 max-w-[900px]">
                {block.heading && (
                  <div className="flex items-center gap-4 mb-8 md:mb-10">
                    <span className="w-8 h-px bg-muted-foreground" />
                    <span className="font-sans font-medium text-[12px] md:text-[13px] tracking-[0.15em] text-foreground uppercase">
                      {block.heading}
                    </span>
                  </div>
                )}
                <div className="font-sans font-light text-[18px] md:text-[22px] leading-[1.5] text-foreground/80 whitespace-pre-line prose-p:mb-4">
                  <TinaMarkdown content={block.body} />
                </div>
              </div>
            )
          case "twoColumn":
            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-20 md:mb-28 items-start">
                <div className="font-sans font-light text-[16px] md:text-[20px] leading-[1.6] text-foreground/80 whitespace-pre-line prose-p:mb-4">
                  <TinaMarkdown content={block.leftContent} />
                </div>
                {block.rightImage && (
                  <div className="w-full h-[40vh] md:h-[60vh] relative bg-muted">
                    <Image src={block.rightImage} alt="Column media" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                )}
              </div>
            )
          case "gallery":
            return (
              <div key={i} className={`grid gap-4 md:gap-8 mb-20 md:mb-28 ${block.images?.length === 1 ? 'grid-cols-1' : block.images?.length === 2 ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                {(block.images || []).slice(0, 4).map((img: string, idx: number) => (
                  <div key={idx} className="w-full h-[30vh] md:h-[40vh] relative bg-muted">
                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                  </div>
                ))}
              </div>
            )
          case "quote":
            return (
              <div key={i} className="mb-20 md:mb-28 max-w-[900px] border-l-2 md:border-l-4 border-foreground pl-6 md:pl-10">
                <blockquote className="font-sans font-black text-[clamp(24px,5vw,48px)] leading-[1.1] text-foreground uppercase tracking-[-0.03em] mb-6">
                  "{block.quoteText}"
                </blockquote>
                {block.author && (
                  <cite className="font-sans font-light text-[12px] md:text-[14px] text-muted-foreground tracking-[0.2em] uppercase block not-italic">
                    — {block.author}
                  </cite>
                )}
              </div>
            )
          case "spacer":
            const h = block.size === "small" ? "h-16 md:h-24" : block.size === "large" ? "h-32 md:h-48" : "h-24 md:h-32"
            return <div key={i} className={`w-full ${h}`} />
          default:
            return null
        }
      })}

      {(!projectData.blocks || projectData.blocks.length === 0) && (
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
              {nextProject.title.replace("\n", " ")}
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
