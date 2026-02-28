import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { projects } from "@/lib/projects"
import type { Metadata } from "next"

interface ProjectDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return { title: "Project Not Found" }
  return {
    title: `${project.title.replace("\n", " ")} | WEARENOTCREATIVE`,
    description: project.description,
  }
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

const caseSections = [
  { key: "overview", label: "Overview", number: "01" },
  { key: "context", label: "Context", number: "02" },
  { key: "approach", label: "Approach", number: "03" },
  { key: "system", label: "System", number: "04" },
  { key: "execution", label: "Execution", number: "05" },
  { key: "outcome", label: "Outcome", number: "06" },
] as const

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  // Find next project for navigation
  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  return (
    <main className="bg-background min-h-screen px-8 pt-[160px] pb-32 md:px-[60px] md:pt-[200px] md:pb-[180px]">
      {/* Header */}
      <header className="mb-24 md:mb-32">
        <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-8">
          {project.category}
        </p>
        <h1 className="font-sans font-black text-[12vw] md:text-[8vw] leading-[0.8] uppercase text-foreground mb-8 md:mb-10 whitespace-pre-line tracking-[-0.04em]">
          {project.title}
        </h1>
        <p className="font-sans font-light text-[16px] md:text-[20px] text-foreground/70 max-w-[600px] leading-[1.6]">
          {project.description}
        </p>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 md:mt-24 border-t border-secondary pt-8 md:pt-10">
          <div>
            <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">Client</span>
            <span className="font-sans font-medium text-[14px] md:text-[15px] uppercase text-foreground tracking-[0.02em]">{project.client}</span>
          </div>
          <div>
            <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">Year</span>
            <span className="font-sans font-medium text-[14px] md:text-[15px] uppercase text-foreground tracking-[0.02em]">{project.year}</span>
          </div>
          <div>
            <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">Role</span>
            <span className="font-sans font-medium text-[14px] md:text-[15px] uppercase text-foreground tracking-[0.02em]">{project.roles.join(" / ")}</span>
          </div>
          <div>
            <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">Services</span>
            <span className="font-sans font-medium text-[14px] md:text-[15px] uppercase text-foreground tracking-[0.02em]">{project.services.join(" / ")}</span>
          </div>
        </div>
      </header>

      {/* Full Width Hero Image */}
      <div className="w-full h-[50vh] md:h-[85vh] bg-muted relative overflow-hidden mb-28 md:mb-36">
        <Image
          src={project.image}
          alt={`${project.title} - Full view`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Case Study Sections */}
      {caseSections.map((section, i) => {
        const content = project[section.key]
        if (!content) return null

        // Insert images between certain sections
        const showImageAfter = i === 1 || i === 3

        return (
          <div key={section.key}>
            <div className="mb-20 md:mb-28 max-w-[900px]">
              <div className="flex items-center gap-4 mb-8 md:mb-10">
                <span className="font-sans font-light text-[12px] tracking-[0.25em] text-muted-foreground uppercase">
                  {section.number}
                </span>
                <span className="w-8 h-px bg-muted-foreground" />
                <span className="font-sans font-medium text-[12px] md:text-[13px] tracking-[0.15em] text-foreground uppercase">
                  {section.label}
                </span>
              </div>
              <p className="font-sans font-light text-[18px] md:text-[22px] leading-[1.5] text-foreground/80">
                {content}
              </p>
            </div>

            {showImageAfter && (
              <div className={`mb-24 md:mb-32 ${i === 1 ? "w-full" : "w-[85%] md:w-[70%] md:ml-[15%]"}`}>
                <div className={`${i === 1 ? "h-[40vh] md:h-[60vh]" : "h-[35vh] md:h-[50vh]"} bg-muted relative overflow-hidden`}>
                  <Image
                    src={project.image}
                    alt={`${project.title} - Detail ${i + 1}`}
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
    </main>
  )
}
