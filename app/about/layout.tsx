import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | WEARENOTCREATIVE",
  description: "A multidisciplinary studio at the intersection of fashion, design and visual culture. Meet the team and learn about our practice.",
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
