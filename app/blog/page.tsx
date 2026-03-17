import { BlogClient } from "./blog-client"
import type { Metadata } from "next"
import { client } from "@/lib/sanity/client"
import { groq } from "next-sanity"

export const metadata: Metadata = {
  title: "Journal | WEARENOTCREATIVE",
  description: "Writing on design, process, culture and the thinking behind our practice."
}

export default async function BlogPage() {
  const query = groq`
      *[_type == "blogPost" && published == true] | order(order asc) {
        _id,
        "slug": slug,
        title,
        date,
        excerpt,
        "coverImage": coverImage.asset->url,
        "image": coverImage.asset->url,
        blocks,
        order
      }
    `
  let rawPosts = []
  try {
    rawPosts = await client.fetch(query)
  } catch (e) {
    console.warn("Sanity fetch failed. Returning empty blog posts.", e)
  }
  const blogPosts = rawPosts.map((p: any) => ({
    ...p,
    id: p._id,
  }))

  return <BlogClient blogPosts={blogPosts} />
}
