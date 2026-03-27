import fs from "fs"
import path from "path"
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"
import ServicesClient from "./services-client"

export const dynamic = "force-dynamic"

export default async function ServicesPage() {
  // JSON used only when Sanity document is entirely absent (null)
  const servicesPath = path.join(process.cwd(), "content", "services.json")
  let servicesJsonData: any = {}
  try {
    servicesJsonData = JSON.parse(fs.readFileSync(servicesPath, "utf8"))
  } catch (e) {}

  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  let servicesData: any = null

  try {
    const servicesDoc = await client.fetch(
      groq`*[_type == "services"][0]{
        headline,
        intro,
        disciplines
      }`
    )

    if (servicesDoc) {
      // Sanity document exists — it is the source of truth.
      // Sort disciplines by order field if all have one set.
      const rawDisciplines: any[] = servicesDoc.disciplines ?? []
      const sorted = rawDisciplines.every((d) => d.order != null)
        ? [...rawDisciplines].sort((a, b) => a.order - b.order)
        : rawDisciplines

      servicesData = {
        headline: servicesDoc.headline,
        intro: servicesDoc.intro,
        disciplines: sorted,
      }
    } else {
      // Sanity document does not exist yet — use JSON as placeholder.
      console.warn("[Services] Sanity 'services' document not found. Using local JSON fallback. Populate the Services Page in Studio.")
      servicesData = servicesJsonData
    }
  } catch (e) {
    // CMS unreachable — use JSON as last resort.
    console.warn("[Services] Sanity fetch failed:", e)
    servicesData = servicesJsonData
  }

  return <ServicesClient servicesData={servicesData} />
}
