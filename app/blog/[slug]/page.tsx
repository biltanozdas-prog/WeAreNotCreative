import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { draftMode } from "next/headers"
import { getClient } from "@/lib/sanity/get-client"
import { groq } from "next-sanity"
import { JournalBlocks } from "../journal-blocks"

// ISR — same cadence as other content pages.
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
  // Sanity 'date' type → YYYY-MM-DD. Existing string-format dates fall through unchanged.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input)
  if (!m) return input
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`
}

function readingMinutes(blocks: any[] | undefined): number {
  if (!blocks || blocks.length === 0) return 1
  let words = 0
  const visit = (val: any) => {
    if (!val) return
    if (Array.isArray(val)) { val.forEach(visit); return }
    if (typeof val === 'object') {
      if (typeof val.text === 'string') words += val.text.split(/\s+/).filter(Boolean).length
      Object.values(val).forEach(visit)
    }
  }
  blocks.forEach((b) => {
    if (!b || typeof b !== 'object') return
    if (b._type === 'textBlock') visit(b.body)
    else if (b._type === 'twoColumn') { visit(b.leftContent); visit(b.rightContent) }
    else if (b._type === 'quote' && typeof b.quoteText === 'string') {
      words += b.quoteText.split(/\s+/).filter(Boolean).length
    }
  })
  return Math.max(1, Math.round(words / 220))
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
    "prevPost": *[_type == "blogPost" && published == true && date < ^.date] | order(date desc)[0] {
      "slug": slug.current, title, postType,
      "coverImage": coverImage.asset->url
    },
    "nextPost": *[_type == "blogPost" && published == true && date > ^.date] | order(date asc)[0] {
      "slug": slug.current, title, postType,
      "coverImage": coverImage.asset->url
    },
    "indexInfo": {
      "position": count(*[_type == "blogPost" && published == true && date > ^.date]) + 1,
      "total": count(*[_type == "blogPost" && published == true])
    }
  }`

  let post: any = null
  try {
    post = await client.fetch(query, { slug })
  } catch (e: any) {
    console.error("[Journal] post fetch failed:", e)
  }

  if (!post) notFound()

  const date = formatDate(post.date)
  const minutes = readingMinutes(post.blocks)
  const position = post.indexInfo?.position ?? 1
  const total = post.indexInfo?.total ?? 1

  return (
    <main style={{ background: '#f4f3ef', color: '#0a0a0a', minHeight: '100vh' }} className="journal-detail">
      {/* NAV BAR */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
        borderBottom: '1px solid #0a0a0a',
        fontSize: 9,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
      }}>
        <Link href="/blog" style={{ color: '#0a0a0a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', width: 14, height: 0.5, background: 'currentColor' }} />
          Journal
        </Link>
        <span style={{ color: '#0a0a0a' }}>
          {String(position).padStart(3, '0')} / {String(total).padStart(2, '0')}
        </span>
      </nav>

      {/* HERO */}
      <section className="journal-hero">
        <div className="journal-hero-left">
          <div>
            <p style={{
              fontSize: 9,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: 18,
            }}>
              {(post.postType || 'essay')}{date ? ` — ${date}` : ''}
            </p>
            <h1 style={{
              fontSize: 'clamp(22px, 4.5vw, 40px)',
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#0a0a0a',
            }}>
              {post.title}
            </h1>
          </div>
          <div style={{
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 9,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: '#999',
          }}>
            <span>{post.author || 'Tunç'}</span>
            <span>{minutes} dk okuma</span>
          </div>
        </div>

        <div className="journal-hero-right">
          {post.coverImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={`${post.coverImage}?w=900&q=85&auto=format`}
              alt={post.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          )}
        </div>
      </section>

      {/* LEAD PARAGRAPH */}
      {post.excerpt && (
        <div className="journal-lead">
          <span style={{ fontSize: 14, color: '#999', paddingTop: 6 }}>—</span>
          <p style={{
            borderLeft: '1.5px solid #0a0a0a',
            paddingLeft: 20,
            fontSize: 17,
            fontWeight: 300,
            lineHeight: 1.6,
            color: '#0a0a0a',
            margin: 0,
          }}>
            {post.excerpt}
          </p>
        </div>
      )}

      {/* BLOCKS */}
      <JournalBlocks blocks={post.blocks || []} />

      {/* SON IŞARETI */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '40px 24px 24px',
        borderTop: '1px solid #0a0a0a',
        marginTop: 40,
      }}>
        <div style={{ flex: 1, height: 0.5, background: '#ccc' }} />
        <span style={{ fontSize: 8, letterSpacing: '.22em', color: '#bbb', textTransform: 'uppercase' }}>Son</span>
        <div style={{ flex: 1, height: 0.5, background: '#ccc' }} />
      </div>

      {/* SONRAKI YAZI */}
      {post.nextPost && (
        <Link
          href={`/blog/${post.nextPost.slug}`}
          className="next-post-block"
          style={{
            display: 'grid',
            borderTop: '1px solid #0a0a0a',
            borderBottom: '1px solid #0a0a0a',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div className="next-post-left" style={{
            padding: '24px 24px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 140,
          }}>
            <p style={{
              fontSize: 8,
              letterSpacing: '.2em',
              color: '#aaa',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              Sonraki Yazı
            </p>
            <p style={{
              fontSize: 18,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-.025em',
              textTransform: 'uppercase',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
            }}>
              {post.nextPost.title}
            </p>
            <p style={{
              fontSize: 8,
              letterSpacing: '.18em',
              color: '#aaa',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 14,
            }}>
              <span style={{ display: 'inline-block', width: 14, height: 0.5, background: '#aaa' }} />
              Okumaya Devam Et
            </p>
          </div>
          <div className="next-post-right" style={{
            background: '#1a1a1a',
            minHeight: 140,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '16px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {post.nextPost.coverImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`${post.nextPost.coverImage}?w=600&q=70&auto=format`}
                alt={post.nextPost.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.35,
                  display: 'block',
                }}
              />
            )}
            <p style={{
              position: 'relative',
              zIndex: 1,
              fontSize: 7,
              letterSpacing: '.2em',
              color: 'rgba(255,255,255,.45)',
              textTransform: 'uppercase',
            }}>
              {post.nextPost.postType || 'essay'}
            </p>
          </div>
        </Link>
      )}

      {/* JOURNAL'A DON */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
      }}>
        <Link
          href="/blog"
          style={{
            fontSize: 9,
            letterSpacing: '.18em',
            color: '#999',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
          }}
        >
          <span style={{ display: 'inline-block', width: 18, height: 0.5, background: 'currentColor' }} />
          Journal&apos;a Dön
        </Link>
        {post.prevPost && (
          <Link
            href={`/blog/${post.prevPost.slug}`}
            style={{
              fontSize: 9,
              letterSpacing: '.18em',
              color: '#999',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
            }}
          >
            Önceki Yazı
            <span style={{ display: 'inline-block', width: 18, height: 0.5, background: 'currentColor' }} />
          </Link>
        )}
      </div>
    </main>
  )
}
