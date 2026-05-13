import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"
import { JournalBlocks } from "../journal-blocks"

// ISR — same cadence as the other content pages.
export const revalidate = 30

interface PostDetailProps {
  params: Promise<{ slug: string }>
}

// ── generateStaticParams ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const client = getClient(false)
    const slugs = await client.fetch<{ slug: string }[]>(
      groq`*[_type == "blogPost" && published == true]{ "slug": slug.current }`
    )
    return (slugs || []).filter((s) => s?.slug).map((s) => ({ slug: s.slug }))
  } catch (e) {
    console.warn("[Journal] generateStaticParams failed:", e)
    return []
  }
}

// ── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PostDetailProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const client = getClient(false)
    const post = await client.fetch<{ title: string; excerpt: string; coverImage: string } | null>(
      groq`*[_type == "blogPost" && slug.current == $slug][0]{
        title, excerpt, "coverImage": coverImage.asset->url
      }`,
      { slug }
    )
    if (!post) return { title: "Journal | WEARENOTCREATIVE" }
    return {
      title: `${post.title} — WANC Journal`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.coverImage ? [{ url: post.coverImage }] : [],
      },
    }
  } catch {
    return { title: "Journal | WEARENOTCREATIVE" }
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(input: string | undefined): string {
  if (!input) return ""
  // Sanity 'date' type → YYYY-MM-DD. Legacy string-format dates pass through.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input)
  if (!m) return input
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function JournalPostPage({ params }: PostDetailProps) {
  const { slug } = await params
  const { isEnabled: preview } = await draftMode()
  const client = getClient(preview)

  const matchFilter = preview
    ? `slug.current == $slug`
    : `slug.current == $slug && published == true`

  const query = groq`*[_type == "blogPost" && ${matchFilter}][0] {
    _id,
    title,
    date,
    postType,
    author,
    excerpt,
    "coverImage": coverImage.asset->url,
    blocks[] {
      ...,
      _type == "fullImage"    => { "imageUrl": image.asset->url, caption },
      _type == "fullVideo"    => { "videoUrl": video.asset->url, caption },
      _type == "twoColumn"    => {
        leftType, rightType,
        leftContent, rightContent,
        "leftImageUrl":  leftImage.asset->url,
        "leftVideoUrl":  leftVideo.asset->url,
        "rightImageUrl": rightImage.asset->url,
        "rightVideoUrl": rightVideo.asset->url
      },
      _type == "gallery"      => { "imageUrls": images[].asset->url },
      _type == "quote"        => { quoteText, author },
      _type == "spacer"       => { size },
      _type == "textBlock"    => { heading, body },
      _type == "heroOverride" => { title, "imageUrl": image.asset->url }
    },
    "nextPost": *[_type == "blogPost" && published == true && date > ^.date] | order(date asc)[0] {
      "slug": slug.current, title, postType,
      "coverImage": coverImage.asset->url
    },
    "allCount": count(*[_type == "blogPost" && published == true]),
    "currentIndex": count(*[_type == "blogPost" && published == true && date <= ^.date])
  }`

  let post: any = null
  try {
    post = await client.fetch(query, { slug })
  } catch (e: any) {
    console.error("[Journal] post fetch failed:", e)
  }

  if (!post) notFound()

  const date = formatDate(post.date)
  const currentIndex = post.currentIndex ?? 1
  const allCount = post.allCount ?? 1

  // The site-wide fixed header lives in app/layout.tsx and overlaps the top
  // of every route. Top padding pushes our nav below it.
  const containerCls = "xl:max-w-[900px] xl:mx-auto 2xl:max-w-[1100px]"

  return (
    <main className="bg-background text-foreground min-h-screen pt-[80px] md:pt-[100px]">
      <div className={containerCls}>
        {/* NAV — non-link label; exit is the fixed top-right × button */}
        <nav className="flex justify-between items-center px-4 md:px-7 py-3 border-b border-foreground">
          <span className="text-[9px] tracking-[.18em] uppercase text-foreground/40">
            Journal
          </span>
          <span className="text-[9px] tracking-[.1em] text-foreground/30">
            {String(currentIndex).padStart(3, '0')} / {String(allCount).padStart(2, '0')}
          </span>
        </nav>

        {/* HERO */}
        <section className="relative z-[1] grid grid-cols-1 md:grid-cols-2 border-b border-foreground">
          {/* Title — order-2 on mobile so image rises above */}
          <div className="flex flex-col justify-between p-7 md:border-r border-foreground order-2 md:order-1">
            <div>
              <p className="text-[8px] tracking-[.2em] uppercase text-muted-foreground mb-3">
                {(post.postType || 'essay')}{date ? ` — ${date}` : ''}
              </p>
              <h1 className="text-[clamp(20px,3.5vw,36px)] font-black leading-[.95] tracking-[-0.04em] uppercase text-foreground">
                {post.title}
              </h1>
            </div>
            <div className="flex gap-6 mt-4">
              {post.author && (
                <div className="flex flex-col gap-1">
                  <span className="text-[7px] tracking-[.16em] uppercase text-muted-foreground">Yazar</span>
                  <span className="text-[10px] text-muted-foreground">{post.author}</span>
                </div>
              )}
              {date && (
                <div className="flex flex-col gap-1">
                  <span className="text-[7px] tracking-[.16em] uppercase text-muted-foreground">Tarih</span>
                  <span className="text-[10px] text-muted-foreground">{date}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cover image — order-1 on mobile */}
          <div className="relative overflow-hidden min-h-[200px] md:min-h-[240px] bg-[#111] order-1 md:order-2">
            {post.coverImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`${post.coverImage}?w=900&q=85&auto=format`}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
            )}
          </div>
        </section>

        {/* LEAD */}
        {post.excerpt && (
          <div className="px-7 py-6 border-b border-foreground/10">
            <p className="text-[16px] leading-[1.62] font-light border-l-[1.5px] border-foreground pl-5 ml-0 md:ml-10 max-w-[640px] text-foreground">
              {post.excerpt}
            </p>
          </div>
        )}

        {/* BLOCKS */}
        <div className="px-4 md:px-7">
          <JournalBlocks blocks={post.blocks || []} />
        </div>

        {/* NEXT POST — comes directly without separator. Exit is the fixed × only. */}
        {post.nextPost && (
          <Link
            href={`/blog/${post.nextPost.slug}`}
            className="group grid grid-cols-1 md:grid-cols-2 border-t border-foreground mt-12 -mx-4 md:-mx-7 xl:mx-0 no-underline text-foreground"
          >
            <div className="flex flex-col justify-between p-7 md:border-r border-foreground min-h-[130px] group-hover:bg-foreground transition-colors duration-200">
              <p className="text-[8px] tracking-[.2em] uppercase text-foreground/40 group-hover:text-white/40 mb-2 transition-colors">
                Sonraki Yazı
              </p>
              <p className="text-[17px] font-black leading-[1.05] tracking-[-0.025em] uppercase flex-1 flex items-center group-hover:text-white transition-colors">
                {post.nextPost.title}
              </p>
              <p className="text-[8px] tracking-[.18em] uppercase text-foreground/40 group-hover:text-white/50 flex items-center gap-1.5 mt-3 transition-colors">
                <span className="w-3.5 h-px bg-current inline-block" />
                Okumaya Devam Et
              </p>
            </div>
            <div className="hidden md:flex bg-[#1a1a1a] min-h-[130px] flex-col justify-end p-4 group-hover:bg-[#111] transition-colors relative overflow-hidden">
              {post.nextPost.coverImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`${post.nextPost.coverImage}?w=600&q=70&auto=format`}
                  alt={post.nextPost.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
              )}
              <p className="relative z-[1] text-[7px] tracking-[.2em] uppercase text-white/25">
                {post.nextPost.postType ?? 'essay'}
              </p>
            </div>
          </Link>
        )}
      </div>
    </main>
  )
}
