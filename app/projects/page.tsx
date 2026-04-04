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

export default async function ProjectsPage() {
  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  // Fetch projectsPage singleton for CMS-editable page header
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

  // Fetch discipline documents — single source of truth for service categories.
  let serviceCategories: string[] = []
  try {
    const disciplinesData = await client.fetch(
      groq`*[_type == "discipline"] | order(order asc){ title }`,
      {},
      { next: { revalidate: 10 } }
    )
    serviceCategories = (disciplinesData || []).map((d: { title: string }) => d.title).filter(Boolean)
  } catch (e) {
    console.warn("[Projects] Sanity fetch failed for disciplines.", e)
  }

  const fields = `{
      _id,
      "slug": coalesce(slug.current, slug),
      title,
      client,
      industry,
      "services": services[]->title,
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
      serviceCategories={serviceCategories}
    />
  )
}
