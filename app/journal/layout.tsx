import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Journal | WEARENOTCREATIVE",
  description: "Writing on design, process and culture. Observations from our studio practice on visual systems, typography and creative direction.",
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
