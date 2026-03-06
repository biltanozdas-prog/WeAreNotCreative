import { ProjectsClient } from "./projects-client"
import { Metadata } from "next"
import { client } from "@/lib/sanity/client"
import { groq } from "next-sanity"

export const metadata: Metadata = {
  title: "Projects | WEARENOTCREATIVE",
  description: "A curated selection across disciplines. Each project is shaped by its own context, scale and ambition."
}

export default async function ProjectsPage() {
  const query = groq`
      *[_type == "project" && published == true] | order(order asc) {
        id,
        _id,
        "slug": slug,
        title,
        client,
        industry,
        services,
        excerpt,
        "heroImage": heroImage,
        "image": heroImage,
        order
      }
    `
  let projects = []
  try {
    projects = await client.fetch(query)
  } catch (e) {
    console.warn("Sanity fetch failed. Returning empty projects.", e)
  }

  // Append id since original used id = filename
  const mappedProjects = projects.map((p: any) => ({
    ...p,
    id: p._id,
  }))

  return <ProjectsClient projects={mappedProjects} />
}
