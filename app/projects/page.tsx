import { ProjectsClient } from "./projects-client"
import { Metadata } from "next"
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"

export const metadata: Metadata = {
  title: "Projects | WEARENOTCREATIVE",
  description: "A curated selection across disciplines. Each project is shaped by its own context, scale and ambition."
}

export default async function ProjectsPage() {
  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  const fields = `{
        id,
        _id,
        "slug": slug,
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
    : groq`*[_type == "project" && published == true] | order(order asc) ${fields}`

  let projects = []
  try {
    projects = await client.fetch(query)
  } catch (e) {
    console.warn("Sanity fetch failed. Returning empty projects.", e)
  }

  const mappedProjects = projects.map((p: any) => ({
    ...p,
    id: p._id,
  }))

  return <ProjectsClient projects={mappedProjects} />
}
