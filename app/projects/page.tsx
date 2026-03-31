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

  // Fetch projectsPage singleton for CMS-editable page header content
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

  // Fetch all service tags in order — used for the filter dropdown
  let serviceTags: { _id: string; name: string }[] = []
  try {
    serviceTags = await client.fetch(
      groq`*[_type == "serviceTag"] | order(order asc) { _id, name }`,
      {},
      { next: { tags: ["serviceTag"] } }
    )
  } catch (e) {
    console.warn("[Projects] Sanity fetch failed for serviceTags.", e)
  }

  const fields = `{
        _id,
        "slug": coalesce(slug.current, slug),
        title,
        client,
        industry,
        "services": services[]->name,
        excerpt,
        "heroImage": heroImage.asset->url,
        "image": heroImage.asset->url,
        order
      }`

  // Use coalesce(published, true) so projects without an explicit published field
  // default to visible (backwards-compatible with older entries).
  const query = preview
    ? groq`*[_type == "project"] | order(order asc) ${fields}`
    : groq`*[_type == "project" && coalesce(published, true) == true] | order(order asc) ${fields}`

  let projects = []
  try {
    projects = await client.fetch(query, {}, { next: { tags: ["project"] } })
  } catch (e) {
    console.warn("Sanity fetch failed. Returning empty projects.", e)
  }

  const mappedProjects = (projects || []).filter(Boolean).map((p: any) => ({
    ...p,
    id: p._id,
  }))

  return <ProjectsClient projects={mappedProjects} pageData={pageData} serviceTags={serviceTags} />
}
