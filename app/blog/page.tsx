import { BlogClient } from "./blog-client"
import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"

export const revalidate = 30

export const metadata: Metadata = {
  title: "Journal | WEARENOTCREATIVE",
  description: "Writing on design, process, culture and the thinking behind our practice."
}

export default async function BlogPage() {
  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  const fields = `{
        _id,
        "slug": coalesce(slug.current, slug),
        title,
        date,
        excerpt,
        "coverImage": coverImage.asset->url,
        "image": coverImage.asset->url,
        blocks[] {
          ...,
          _type == "fullImage" => {
            "imageUrl": image.asset->url
          },
          _type == "fullVideo" => {
            "videoUrl": video.asset->url
          },
          _type == "twoColumn" => {
            leftType,
            rightType,
            leftContent,
            rightContent,
            "leftImageUrl": leftImage.asset->url,
            "leftVideoUrl": leftVideo.asset->url,
            "rightImageUrl": rightImage.asset->url,
            "rightVideoUrl": rightVideo.asset->url
          },
          _type == "gallery" => {
            "imageUrls": images[].asset->url
          },
          _type == "heroOverride" => {
            title,
            "imageUrl": image.asset->url
          }
        },
        order
      }`

  const postsQuery = preview
    ? groq`*[_type == "blogPost"] | order(order asc) ${fields}`
    : groq`*[_type == "blogPost" && published == true] | order(order asc) ${fields}`

  const [pageData, rawPosts] = await Promise.all([
    client.fetch(
      groq`*[_type == "journalPage"][0]{ eyebrowLabel, headline, intro }`,
      {},
      { next: { revalidate: 30 } }
    ).catch((e: any) => { console.warn("[Blog] journalPage fetch failed:", e); return null }),

    client.fetch(
      postsQuery,
      {},
      { next: { revalidate: 30 } }
    ).catch((e: any) => { console.warn("[Blog] blogPosts fetch failed:", e); return [] }),
  ])
  const blogPosts = (rawPosts || []).filter(Boolean).map((p: any) => ({
    ...p,
    id: p._id,
  }))

  return <BlogClient blogPosts={blogPosts} pageData={pageData} />
}
