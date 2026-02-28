import type { Metadata } from "next"
import { HeroVideo } from "@/components/hero-video"
import { ManifestoSection } from "@/components/manifesto-section"
import { SelectedProjects } from "@/components/selected-projects"
import Link from "next/link"

export const metadata: Metadata = {
  title: "WEARENOTCREATIVE | Design as a Cultural Practice",
  description: "A multidisciplinary creative studio working across brand identity, art direction, visual systems and product thinking. Istanbul / Global.",
}

export default function HomePage() {
  return (
    <main>
      <HeroVideo />
      {/* Spacer for the video hero area */}
      <div className="h-screen" />
      {/* Content starts after the video */}
      <ManifestoSection />
      <SelectedProjects />

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
