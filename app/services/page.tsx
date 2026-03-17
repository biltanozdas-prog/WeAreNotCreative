import fs from "fs"
import path from "path"
import { client } from "@/lib/sanity/client"
import { groq } from "next-sanity"
import ServicesClient from "./services-client"

export const dynamic = "force-dynamic"

export default async function ServicesPage() {
  // JSON fallback
  const servicesPath = path.join(process.cwd(), "content", "services.json")
  let servicesJsonData: any = {}
  try {
    servicesJsonData = JSON.parse(fs.readFileSync(servicesPath, "utf8"))
  } catch (e) {}

  let servicesData: any = servicesJsonData

  try {
    const servicesDoc = await client.fetch(
      groq`*[_type == "services"][0]{
        headline,
        intro,
        disciplines
      }`
    )
    if (servicesDoc) {
      // Sort disciplines by order field ascending; fall back to original array order
      const rawDisciplines: any[] = servicesDoc.disciplines || []
      const sorted = rawDisciplines.every((d) => d.order != null)
        ? [...rawDisciplines].sort((a, b) => a.order - b.order)
        : rawDisciplines

      servicesData = {
        headline: servicesDoc.headline || servicesJsonData.headline,
        intro: servicesDoc.intro || servicesJsonData.intro,
        disciplines: sorted.length ? sorted : servicesJsonData.disciplines,
      }
    }
  } catch (e) {
    // CMS unavailable — use JSON fallback
  }

  return <ServicesClient servicesData={servicesData} />
}
