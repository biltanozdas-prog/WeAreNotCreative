"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type JournalPost = {
  _id: string
  slug: string
  title: string
  date?: string
  excerpt?: string
  postType?: 'essay' | 'observation' | 'reference' | string
  author?: string
  coverImage?: string
}

type JournalPageData = {
  eyebrowLabel?: string
  headline?: string
  intro?: string
} | null

function formatDate(input: string | undefined): string {
  if (!input) return ""
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input)
  if (!m) return input
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`
}

export function BlogClient({
  posts,
  pageData,
}: {
  posts: JournalPost[]
  pageData?: JournalPageData
}) {
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)

  const sliderRef = useRef<HTMLDivElement>(null)
  const dragStartXRef = useRef(0)

  // Track slider outer width so transform math stays in sync on resize.
  useEffect(() => {
    if (!sliderRef.current) return
    const el = sliderRef.current
    const update = () => setContainerWidth(el.offsetWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const cardWidth = containerWidth * 0.55

  function go(n: number) {
    if (posts.length === 0) return
    setActive(Math.max(0, Math.min(n, posts.length - 1)))
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (posts.length === 0) return
    dragStartXRef.current = e.clientX
    setDragging(false)
    const onMove = (ev: MouseEvent) => {
      if (Math.abs(ev.clientX - dragStartXRef.current) > 5) setDragging(true)
    }
    const onUp = (ev: MouseEvent) => {
      const dx = ev.clientX - dragStartXRef.current
      if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1))
      // Defer clearing so onClick (link) can read it
      window.setTimeout(() => setDragging(false), 0)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const touchStartXRef = useRef(0)
  function handleTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartXRef.current
    if (dx < -40) go(active + 1)
    else if (dx > 40) go(active - 1)
  }

  const headline = pageData?.headline || 'Journal'
  const eyebrow = pageData?.eyebrowLabel
  const intro = pageData?.intro

  return (
    <main
      style={{ background: '#f4f3ef', color: '#0a0a0a', minHeight: '100vh' }}
      className="journal-index"
    >
      {/* HEADER */}
      <div style={{ padding: '120px 24px 28px', borderBottom: '1px solid #0a0a0a' }}>
        {eyebrow && (
          <p style={{
            fontSize: 10,
            letterSpacing: '.25em',
            textTransform: 'uppercase',
            color: '#999',
            marginBottom: 14,
          }}>
            {eyebrow}
          </p>
        )}
        <h1 style={{
          fontSize: 'clamp(48px, 11vw, 140px)',
          fontWeight: 900,
          lineHeight: 0.85,
          letterSpacing: '-0.04em',
          textTransform: 'uppercase',
          color: '#0a0a0a',
          margin: 0,
        }}>
          {headline}
        </h1>
        {intro && (
          <p style={{
            marginTop: 28,
            maxWidth: 520,
            fontSize: 15,
            fontWeight: 300,
            lineHeight: 1.65,
            color: '#444',
          }}>
            {intro}
          </p>
        )}
      </div>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        style={{
          overflow: 'hidden',
          cursor: posts.length > 1 ? 'grab' : 'default',
          borderBottom: '1px solid #0a0a0a',
          background: '#0a0a0a',
        }}
        onMouseDown={posts.length > 1 ? handleMouseDown : undefined}
        onTouchStart={posts.length > 1 ? handleTouchStart : undefined}
        onTouchEnd={posts.length > 1 ? handleTouchEnd : undefined}
      >
        <div
          style={{
            display: 'flex',
            transform: `translateX(-${active * cardWidth}px)`,
            transition: dragging ? 'none' : 'transform 0.55s cubic-bezier(0.77,0,0.18,1)',
          }}
        >
          {posts.map((post, i) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post._id}
              style={{
                flex: '0 0 55%',
                height: 300,
                position: 'relative',
                overflow: 'hidden',
                opacity: i === active ? 1 : 0.5,
                transition: 'opacity 0.35s',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                textDecoration: 'none',
                color: 'inherit',
              }}
              onClick={(e) => { if (dragging) e.preventDefault() }}
              draggable={false}
            >
              {post.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`${post.coverImage}?w=800&q=80&auto=format`}
                  alt={post.title}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  draggable={false}
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: '#1a1a1a' }} />
              )}

              {/* Fixed gradient overlay — readability guarantee */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.08) 100%)',
                pointerEvents: 'none',
              }} />

              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '16px 18px 18px',
                pointerEvents: 'none',
              }}>
                <p style={{
                  fontSize: 7,
                  letterSpacing: '.22em',
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  marginBottom: 7,
                }}>
                  {post.postType || 'essay'}
                </p>
                <h2 style={{
                  fontSize: 14,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-.02em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  marginBottom: 10,
                  margin: 0,
                }}>
                  {post.title}
                </h2>
                <p style={{
                  marginTop: 10,
                  fontSize: 8,
                  letterSpacing: '.18em',
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span style={{ display: 'inline-block', width: 16, height: 0.5, background: 'currentColor' }} />
                  Oku
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SCROLL BAR — siyah bant */}
      {posts.length > 1 && (
        <div style={{
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #1a1a1a',
        }}>
          <button
            onClick={() => go(active - 1)}
            aria-label="Previous"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.35)',
              fontSize: 12,
              padding: '9px 18px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >←</button>
          <div style={{
            flex: 1,
            height: 1,
            background: 'rgba(255,255,255,0.12)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              background: 'rgba(255,255,255,0.6)',
              width: `${100 / posts.length}%`,
              left: posts.length > 1
                ? `${(active / (posts.length - 1)) * (100 - 100 / posts.length)}%`
                : '0%',
              transition: 'left 0.55s cubic-bezier(0.77,0,0.18,1)',
            }} />
          </div>
          <button
            onClick={() => go(active + 1)}
            aria-label="Next"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.35)',
              fontSize: 12,
              padding: '9px 18px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >→</button>
        </div>
      )}

      {/* ARSIV LISTESI */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '14px 24px 8px',
          gap: 10,
        }}>
          <div style={{ flex: 1, height: 0.5, background: '#ddd' }} />
          <span style={{
            fontSize: 8,
            letterSpacing: '.2em',
            color: '#bbb',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            Tüm Yazılar
          </span>
          <div style={{ flex: 1, height: 0.5, background: '#ddd' }} />
        </div>

        {posts.map((post, i) => (
          <div
            key={post._id}
            onClick={() => go(i)}
            className={`arch-row ${i === active ? 'arch-active' : ''}`}
          >
            <div className="arch-sweep" />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, position: 'relative', zIndex: 1, minWidth: 0 }}>
              <span className="arch-index" style={{
                fontSize: 9,
                letterSpacing: '.08em',
                width: 26,
                flexShrink: 0,
                color: '#bbb',
              }}>
                {String(i + 1).padStart(3, '0')}
              </span>
              <Link
                href={`/blog/${post.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="arch-title"
                style={{
                  fontSize: 12,
                  fontWeight: i === active ? 900 : 600,
                  letterSpacing: '-.01em',
                  textTransform: 'uppercase',
                  color: '#444',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {post.title}
              </Link>
            </div>
            <span className="arch-date" style={{
              fontSize: 9,
              letterSpacing: '.1em',
              color: '#bbb',
              position: 'relative',
              zIndex: 1,
              flexShrink: 0,
              marginLeft: 12,
            }}>
              {formatDate(post.date)}
            </span>
          </div>
        ))}

        {posts.length === 0 && (
          <p style={{
            padding: '40px 24px',
            fontSize: 11,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: '#bbb',
            textAlign: 'center',
          }}>
            Henüz yazı yok.
          </p>
        )}
      </div>
    </main>
  )
}
