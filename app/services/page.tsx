
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"
import ServicesClient from "./services-client"

export const dynamic = "force-dynamic"

export default async function ServicesPage() {


  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  let servicesData: any = null

  try {
    const servicesDoc = await client.fetch(
      groq`*[_type == "services"][0]{
        eyebrowLabel,
        headline,
        intro,
        disciplines,
        process,
        ctaLabel,
        ctaHeadline,
        ctaButtonText
      }`,
      {},
      { next: { tags: ["services"] } }
    )

    if (servicesDoc) {
      // Sanity document exists — it is the source of truth.
      // Sort disciplines by order field if all have one set.
      const rawDisciplines: any[] = servicesDoc.disciplines ?? []
      const sorted = rawDisciplines.every((d) => d.order != null)
        ? [...rawDisciplines].sort((a, b) => a.order - b.order)
        : rawDisciplines

      servicesData = {
        eyebrowLabel: servicesDoc.eyebrowLabel,
        headline: servicesDoc.headline,
        intro: servicesDoc.intro,
        disciplines: sorted,
        process: servicesDoc.process ?? [],
        ctaLabel: servicesDoc.ctaLabel,
        ctaHeadline: servicesDoc.ctaHeadline,
        ctaButtonText: servicesDoc.ctaButtonText,
      }
    } else {
      console.warn("[Services] Sanity 'services' document not found.")
    }
  } catch (e) {
    // CMS unreachable
    console.warn("[Services] Sanity fetch failed:", e)
  }

  if (!servicesData) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <h1 className="font-sans font-light text-[12px] uppercase tracking-[0.25em] text-muted-foreground">Services Page Configuration Missing</h1>
      </main>
    )
  }

  return <ServicesClient servicesData={servicesData} />
}
