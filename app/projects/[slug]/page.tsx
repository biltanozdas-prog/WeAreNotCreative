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

// We map sections dynamically from projectData.sections now.

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
    client: nextEdge.client,
    year: nextEdge.year
  } : null

  return (
    <main className="bg-background min-h-screen px-8 pt-[160px] pb-32 md:px-[60px] md:pt-[200px] md:pb-[180px]">
      {/* Header */}
      <header className="mb-24 md:mb-32">
        <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-8">
          {projectData.category}
        </p>
        <h1 className="font-sans font-black text-[12vw] md:text-[8vw] leading-[0.8] uppercase text-foreground mb-8 md:mb-10 whitespace-pre-line tracking-[-0.04em]">
          {projectData.title}
        </h1>
        <p className="font-sans font-light text-[16px] md:text-[20px] text-foreground/70 max-w-[600px] leading-[1.6]">
          {projectData.description}
        </p>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 md:mt-24 border-t border-secondary pt-8 md:pt-10">
          <div>
            <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">Client</span>
            <span className="font-sans font-medium text-[14px] md:text-[15px] uppercase text-foreground tracking-[0.02em]">{projectData.client}</span>
          </div>
          <div>
            <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">Year</span>
            <span className="font-sans font-medium text-[14px] md:text-[15px] uppercase text-foreground tracking-[0.02em]">{projectData.year}</span>
          </div>
          <div>
            <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">Role</span>
            <span className="font-sans font-medium text-[14px] md:text-[15px] uppercase text-foreground tracking-[0.02em]">{projectData.roles?.join(" / ")}</span>
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
          src={projectData.image || ""}
          alt={`${projectData.title} - Full view`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Case Study Sections */}
      {(projectData?.sections || []).map((section: any, i: number) => {
        if (!section.content) return null

        // Insert images between certain sections
        const showImageAfter = i === 1 || i === 3
        const sectionNumber = String(i + 1).padStart(2, '0')

        return (
          <div key={section.type || i}>
            <div className="mb-20 md:mb-28 max-w-[900px]">
              <div className="flex items-center gap-4 mb-8 md:mb-10">
                <span className="font-sans font-light text-[12px] tracking-[0.25em] text-muted-foreground uppercase">
                  {sectionNumber}
                </span>
                <span className="w-8 h-px bg-muted-foreground" />
                <span className="font-sans font-medium text-[12px] md:text-[13px] tracking-[0.15em] text-foreground uppercase">
                  {section.heading || section.type}
                </span>
              </div>
              <div className="font-sans font-light text-[18px] md:text-[22px] leading-[1.5] text-foreground/80 whitespace-pre-line prose-p:mb-4">
                {typeof section.content === "string" ? section.content : <TinaMarkdown content={section.content} />}
              </div>
            </div>

            {showImageAfter && (
              <div className={`mb-24 md:mb-32 ${i === 1 ? "w-full" : "w-[85%] md:w-[70%] md:ml-[15%]"}`}>
                <div className={`${i === 1 ? "h-[40vh] md:h-[60vh]" : "h-[35vh] md:h-[50vh]"} bg-muted relative overflow-hidden`}>
                  <Image
                    src={projectData.heroImage || projectData.thumbnail || projectData.image || ""}
                    alt={`${projectData.title} - Detail ${i + 1}`}
                    fill
                    className={`object-cover ${i === 1 ? "grayscale" : ""}`}
                    sizes={i === 1 ? "100vw" : "(max-width: 768px) 85vw, 70vw"}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}

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
              {nextProject.client} / {nextProject.year}
            </span>
          </Link>
        </div>
      )}
    </main>
  )
}
