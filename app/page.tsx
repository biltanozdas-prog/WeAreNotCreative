import type { Metadata } from "next"
import { HeroVideo } from "@/components/hero-video"
import { ManifestoSection } from "@/components/manifesto-section"
import { SelectedProjects } from "@/components/selected-projects"
import Link from "next/link"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

export const metadata: Metadata = {
  title: "WEARENOTCREATIVE | Design as a Cultural Practice",
  description: "A multidisciplinary creative studio working across brand identity, art direction, visual systems and product thinking. Istanbul / Global.",
}

export default async function HomePage() {
  const homeDataPath = path.join(process.cwd(), "content", "homepage.json")
  let homeData: any = {}
  try {
    homeData = JSON.parse(fs.readFileSync(homeDataPath, "utf8"))
  } catch (e) { }

  const projectsDir = path.join(process.cwd(), "content", "projects")
  let projects: any[] = []
  try {
    const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'))
    projects = files.map(filename => {
      const fileContent = fs.readFileSync(path.join(projectsDir, filename), "utf8")
      const { data } = matter(fileContent)
      return { ...data, slug: filename.replace(".md", ""), id: filename }
    })
      .filter((p: any) => p.published !== false)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .slice(0, 4)
  } catch (e) { }

  return (
    <main>
      <HeroVideo videoUrl={homeData.heroVideo} />
      {/* Spacer for the video hero area */}
      <div className="h-screen" />
      {/* Content starts after the video */}
      <ManifestoSection />
      <SelectedProjects projects={projects as any} />

      {/* Footer CTA */}
      <section className="bg-background relative z-10 px-8 py-32 md:px-[60px] md:py-[180px] border-t border-secondary">
        <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-8 md:mb-12">
          Next Step
        </p>
        <h2 className="font-sans font-black text-[clamp(36px,7vw,120px)] leading-[0.85] uppercase text-foreground tracking-[-0.03em] mb-10 md:mb-16">
          {"LET'S TALK."}
        </h2>
        <Link
          href="/contact"
          className="font-sans font-medium text-[14px] md:text-[16px] uppercase tracking-[0.15em] text-foreground no-underline border-b-2 border-foreground pb-1 hover:opacity-60 transition-opacity"
        >
          Start a Conversation
        </Link>
      </section>
    </main>
  )
}
