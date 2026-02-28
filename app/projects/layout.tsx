import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects | WEARENOTCREATIVE",
  description: "Selected work across fashion, product design, typography, identity and exhibition. A curated portfolio of case studies.",
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
