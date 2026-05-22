import Link from "next/link"
import { groq } from "next-sanity"
import { getClient } from "@/lib/sanity/get-client"

const query = groq`
  *[_type == "blogPost" && published == true] | order(_createdAt desc) [0...3] {
    _id,
    "slug": slug.current,
    title,
    "coverImage": coverImage.asset->url
  }
`

type HomepagePost = {
  _id: string
  slug: string
  title: string
  coverImage?: string
}

export async function HomepageJournal() {
  const posts = await getClient(false)
    .fetch<HomepagePost[]>(query, {}, { next: { tags: ["blogPost"], revalidate: 30 } })
    .catch((e) => {
      console.warn("[homepage-journal] fetch failed:", e)
      return [] as HomepagePost[]
    })

  if (!posts || posts.length === 0) return null

  return (
    <section className="bg-background border-t border-foreground">
      {/* Header */}
      <div className="flex justify-between items-end px-8 md:px-[60px] py-7 border-b border-foreground/10">
        <h2 className="text-[22px] md:text-[26px] font-black tracking-[-0.03em] uppercase">
          From the Journal
        </h2>
        <Link
          href="/journal"
          className="text-[9px] tracking-[.15em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 no-underline"
        >
          <span className="w-4 h-px bg-current inline-block" />
          All Entries
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground/10">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/journal/${post.slug}`}
            className="group bg-background no-underline block"
          >
            <div className="relative overflow-hidden aspect-[4/3]">
              {post.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`${post.coverImage}?w=600&q=80&auto=format`}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-full bg-foreground/5" />
              )}
            </div>

            <div className="px-5 py-4 border-t border-foreground/10 group-hover:bg-foreground transition-colors duration-200">
              <h3 className="text-[12px] font-black leading-[1.15] tracking-[-0.015em] uppercase text-foreground group-hover:text-white transition-colors duration-200 line-clamp-2">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
