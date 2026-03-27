import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"

export const dynamic = "force-dynamic"



export default async function ContactPage() {
  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  let settings: any = null

  try {
    settings = await client.fetch(
      groq`*[_type == "siteSettings"][0]{
        contactEyebrow,
        contactDescription,
        email,
        location,
        instagramUrl,
        inquiryCategories
      }`,
      {},
      { next: { tags: ["siteSettings"] } }
    )
  } catch (e) {
    console.warn("[Contact] Sanity fetch failed:", e)
  }

  if (!settings) {
    return (
      <main className="bg-background min-h-screen flex flex-col items-center justify-center px-8">
        <h1 className="font-sans font-light text-[12px] uppercase tracking-[0.25em] text-muted-foreground">Contact Configuration Missing</h1>
      </main>
    )
  }

  const email = settings.email ?? ""
  const location = settings.location ?? ""
  const instagramUrl = settings.instagramUrl ?? ""
  const contactEyebrow = settings.contactEyebrow ?? ""
  const contactDescription = settings.contactDescription ?? ""
  const inquiryCategories = settings.inquiryCategories ?? []

  return (
    <main className="bg-background min-h-screen flex flex-col justify-center px-8 md:px-[60px] py-32">
      {contactEyebrow && (
        <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-8 md:mb-10">
          {contactEyebrow}
        </p>
      )}
      <a
        href={`mailto:${email}`}
        className="font-sans font-black text-[clamp(20px,4.5vw,72px)] text-foreground no-underline border-b-[3px] md:border-b-[5px] border-foreground w-fit leading-[1.1] hover:opacity-60 transition-opacity uppercase tracking-[-0.02em]"
      >
        {email.toUpperCase()}
      </a>

      {contactDescription && (
        <p className="font-sans font-light text-[15px] md:text-[17px] text-muted-foreground mt-10 md:mt-16 max-w-[460px] leading-[1.65]">
          {contactDescription}
        </p>
      )}

      {/* Inquiry structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mt-16 md:mt-24 max-w-[900px]">
        {inquiryCategories.map((cat: any) => (
          <div key={cat.label}>
            <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">
              {cat.label}
            </span>
            <p className="font-sans font-light text-[13px] md:text-[14px] text-foreground leading-[1.6]">
              {cat.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 mt-16 md:mt-24">
        <span className="font-sans font-light text-[12px] md:text-[13px] tracking-[0.2em] uppercase text-muted-foreground">
          {location}
        </span>
        <span className="w-6 h-px bg-muted-foreground" />
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans font-medium text-[12px] md:text-[13px] tracking-[0.15em] uppercase text-foreground no-underline border-b border-foreground hover:opacity-60 transition-opacity"
        >
          Instagram
        </a>
      </div>
    </main>
  )
}
