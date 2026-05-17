import { JournalClient } from "./journal-client"
import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"

export const revalidate = 30

export const metadata: Metadata = {
  title: "Journal | WEARENOTCREATIVE",
  description: "Writing on design, process, culture and the thinking behind our practice."
}

export default async function JournalPage() {
  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  // Light list query — only what cards need. No blocks payload.
  // Sorted by Sanity's built-in _createdAt so the most recently added
  // post lands at the top automatically. No manual order field needed.
  const listFields = `{
    _id,
    _createdAt,
    "slug": slug.current,
    title,
    date,
    excerpt,
    postType,
    author,
    "coverImage": coverImage.asset->url
  }`

  const postsQuery = preview
    ? groq`*[_type == "blogPost"] | order(_createdAt desc) ${listFields}`
    : groq`*[_type == "blogPost" && published == true] | order(_createdAt desc) ${listFields}`

  const [pageData, rawPosts] = await Promise.all([
    client.fetch(
      groq`*[_type == "journalPage"][0]{ eyebrowLabel, headline, intro }`,
      {},
      { next: { revalidate: 30 } }
    ).catch((e: any) => { console.warn("[Journal] journalPage fetch failed:", e); return null }),

    client.fetch(
      postsQuery,
      {},
      { next: { revalidate: 30 } }
    ).catch((e: any) => { console.warn("[Journal] blogPosts fetch failed:", e); return [] }),
  ])

  const posts = (rawPosts || []).filter(Boolean)

  return <JournalClient posts={posts} pageData={pageData} />
}
