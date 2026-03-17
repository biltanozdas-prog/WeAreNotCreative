import Link from "next/link"
import { client } from "@/lib/sanity/client"
import { groq } from "next-sanity"

export const dynamic = "force-dynamic"

// Hardcoded fallback values
const FALLBACK_EMAIL = "hello@wearenotcreative.com"
const FALLBACK_LOCATION = "Istanbul / Global"
const FALLBACK_INSTAGRAM = "https://instagram.com/wearenotcreative"
const FALLBACK_CATEGORIES = [
  {
    label: "New Projects",
    description: "Share your brief, budget range and timeline.\nWe respond within 48 hours.",
  },
  {
    label: "Collaborations",
    description: "Open to editorial features, cultural projects\nand studio partnerships.",
  },
  {
    label: "General",
    description: "Press inquiries, speaking invitations,\nor just to say hello.",
  },
]

export default async function ContactPage() {
  let email = FALLBACK_EMAIL
  let location = FALLBACK_LOCATION
  let instagramUrl = FALLBACK_INSTAGRAM
  let inquiryCategories = FALLBACK_CATEGORIES

  try {
    const settings = await client.fetch(
      groq`*[_type == "siteSettings"][0]{
        email,
        location,
        instagramUrl,
        inquiryCategories
      }`
    )
    if (settings) {
      email = settings.email || FALLBACK_EMAIL
      location = settings.location || FALLBACK_LOCATION
      instagramUrl = settings.instagramUrl || FALLBACK_INSTAGRAM
      inquiryCategories =
        settings.inquiryCategories?.length ? settings.inquiryCategories : FALLBACK_CATEGORIES
    }
  } catch (e) {
    // CMS unavailable — use hardcoded fallback
  }

  return (
    <main className="bg-background min-h-screen flex flex-col justify-center px-8 md:px-[60px] py-32">
      <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-8 md:mb-10">
        Start a Project
      </p>
      <a
        href={`mailto:${email}`}
        className="font-sans font-black text-[clamp(20px,4.5vw,72px)] text-foreground no-underline border-b-[3px] md:border-b-[5px] border-foreground w-fit leading-[1.1] hover:opacity-60 transition-opacity uppercase tracking-[-0.02em]"
      >
        {email.toUpperCase()}
      </a>

      <p className="font-sans font-light text-[15px] md:text-[17px] text-muted-foreground mt-10 md:mt-16 max-w-[460px] leading-[1.65]">
        For new projects, collaborations, or conversations about what we
        might build together. Tell us about your brand, your challenge,
        and your timeline.
      </p>

      {/* Inquiry structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mt-16 md:mt-24 max-w-[900px]">
        {inquiryCategories.map((cat) => (
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
