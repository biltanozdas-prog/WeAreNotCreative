import { BlogClient } from "./blog-client"
import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"

export const metadata: Metadata = {
  title: "Journal | WEARENOTCREATIVE",
  description: "Writing on design, process, culture and the thinking behind our practice."
}

export default async function BlogPage() {
  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  const fields = `{
        _id,
        "slug": slug,
        title,
        date,
        excerpt,
        "coverImage": coverImage.asset->url,
        "image": coverImage.asset->url,
        blocks[] {
          ...,
          _type == "fullVideo" => {
            "videoUrl": video.asset->url
          },
          _type == "twoColumn" => {
            "rightVideoUrl": rightVideo.asset->url
          }
        },
        order
      }`

  const query = preview
    ? groq`*[_type == "blogPost"] | order(order asc) ${fields}`
    : groq`*[_type == "blogPost" && coalesce(published, true) == true] | order(order asc) ${fields}`

  let rawPosts = []
  try {
    rawPosts = await client.fetch(query, {}, { next: { tags: ["blogPost"] } })
  } catch (e) {
    console.warn("Sanity fetch failed. Returning empty blog posts.", e)
  }
  const blogPosts = (rawPosts || []).filter(Boolean).map((p: any) => ({
    ...p,
    id: p._id,
  }))

  return <BlogClient blogPosts={blogPosts} />
}
