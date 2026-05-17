import { ProjectsClient } from "./projects-client"
import { Metadata } from "next"
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"

export const revalidate = 30

export const metadata: Metadata = {
  title: "Projects | WEARENOTCREATIVE",
  description: "A curated selection across disciplines. Each project is shaped by its own context, scale and ambition."
}

export default async function ProjectsPage() {
  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  const fields = `{
      _id,
      _createdAt,
      "slug": coalesce(slug.current, slug),
      title,
      client,
      industry,
      "services": services[]->title,
      excerpt,
      "heroImage": heroImage.asset->url,
      "image": heroImage.asset->url
    }`

  const projectsQuery = preview
    ? groq`*[_type == "project"] | order(_createdAt desc) ${fields}`
    : groq`*[_type == "project" && coalesce(published, true) == true] | order(_createdAt desc) ${fields}`

  const [pageData, disciplinesData, rawProjects] = await Promise.all([
    client.fetch(
      groq`*[_type == "projectsPage"][0]{ eyebrowLabel, intro }`,
      {},
      { next: { revalidate: 30 } }
    ).catch((e: any) => { console.warn("[Projects] pageData fetch failed:", e); return null }),

    client.fetch(
      groq`*[_type == "discipline"] | order(order asc){ title }`,
      {},
      { next: { revalidate: 30 } }
    ).catch((e: any) => { console.warn("[Projects] disciplines fetch failed:", e); return [] }),

    client.fetch(
      projectsQuery,
      {},
      { next: { revalidate: 30 } }
    ).catch((e: any) => { console.warn("[Projects] projects fetch failed:", e); return [] }),
  ])

  const serviceCategories: string[] = (disciplinesData || [])
    .map((d: { title: string }) => d.title)
    .filter(Boolean)

  const mappedProjects = ((rawProjects as any[]) || []).filter(Boolean).map((p: any) => ({
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
