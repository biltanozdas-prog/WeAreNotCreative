import { ProjectsClient } from "./projects-client"
import { Metadata } from "next"
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Projects | WEARENOTCREATIVE",
  description: "A curated selection across disciplines. Each project is shaped by its own context, scale and ambition."
}

// Source of truth — order determines filter dropdown order
const SERVICE_CATEGORIES = [
  "BRAND STRATEGY",
  "VISUAL SYSTEMS",
  "ART DIRECTION",
  "BRAND ARCHITECTURE",
  "DIGITAL EXPERIENCES",
  "OBJECTS & PRODUCTS",
  "CONTENT & CAMPAIGN SYSTEMS",
] as const

export default async function ProjectsPage() {
  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  let pageData: any = null
  try {
    pageData = await client.fetch(
      groq`*[_type == "projectsPage"][0]{ eyebrowLabel, intro }`,
      {},
      { next: { tags: ["projectsPage"] } }
    )
  } catch (e) {
    console.warn("[Projects] Sanity fetch failed for projectsPage.", e)
  }

  const fields = `{
      _id,
      "slug": coalesce(slug.current, slug),
      title,
      client,
      industry,
      services,
      excerpt,
      "heroImage": heroImage.asset->url,
      "image": heroImage.asset->url,
      order
    }`

  const query = preview
    ? groq`*[_type == "project"] | order(order asc) ${fields}`
    : groq`*[_type == "project" && coalesce(published, true) == true] | order(order asc) ${fields}`

  let projects: any[] = []
  try {
    projects = await client.fetch(query, {}, { next: { tags: ["project"] } })
  } catch (e) {
    console.warn("Sanity fetch failed. Returning empty projects.", e)
  }

  const mappedProjects = (projects || []).filter(Boolean).map((p: any) => ({
    ...p,
    id: p._id,
  }))

  return (
    <ProjectsClient
      projects={mappedProjects}
      pageData={pageData}
      serviceCategories={[...SERVICE_CATEGORIES]}
    />
  )
}
