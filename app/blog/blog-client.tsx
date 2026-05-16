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

function getCardRatio(width: number) {
  if (width < 768) return 0.85   // mobile — biggest card so a single card dominates
  if (width < 1024) return 0.60  // tablet
  return 0.55                    // desktop & up
}

export function BlogClient({
  posts,
  pageData: _pageData,
}: {
  posts: JournalPost[]
  pageData?: JournalPageData
}) {
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [cardRatio, setCardRatio] = useState(0.55)

  const sliderRef = useRef<HTMLDivElement>(null)
  const dragStartXRef = useRef(0)
  const touchStartXRef = useRef(0)

  // Sync slider outer width + card ratio with viewport
  useEffect(() => {
    if (!sliderRef.current) return
    const el = sliderRef.current
    const update = () => {
      setContainerWidth(el.offsetWidth)
      setCardRatio(getCardRatio(window.innerWidth))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const cardWidth = containerWidth * cardRatio

  function go(n: number) {
    if (posts.length === 0) return
    setActive(Math.max(0, Math.min(n, posts.length - 1)))
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (posts.length <= 1) return
    dragStartXRef.current = e.clientX
    let moved = false
    const onMove = (ev: MouseEvent) => {
      if (Math.abs(ev.clientX - dragStartXRef.current) > 5) {
        moved = true
        setDragging(true)
      }
    }
    const onUp = (ev: MouseEvent) => {
      const dx = ev.clientX - dragStartXRef.current
      if (moved && Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1))
      // Defer clearing so any click handler can still see `dragging`
      window.setTimeout(() => setDragging(false), 0)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartXRef.current
    if (dx < -40) go(active + 1)
    else if (dx > 40) go(active - 1)
  }

  return (
    <main className="bg-background text-foreground min-h-screen pt-[88px] md:pt-[140px]">
      {/* HEADER */}
      <header className="flex justify-between items-center px-5 md:px-7 py-3 border-b border-foreground">
        <div className="flex items-baseline gap-3 md:gap-4">
          <span className="text-[9px] font-bold tracking-[.2em] uppercase">WeAreNotCreative</span>
          <span className="text-[9px] tracking-[.15em] uppercase text-foreground/35">/ Journal</span>
        </div>
        <span className="text-[9px] tracking-[.12em] text-foreground/35">
          {String(active + 1).padStart(2, '0')} / {String(posts.length).padStart(2, '0')}
        </span>
      </header>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className={`overflow-hidden border-b border-foreground bg-foreground select-none ${posts.length > 1 ? 'cursor-grab' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={posts.length > 1 ? handleTouchStart : undefined}
        onTouchEnd={posts.length > 1 ? handleTouchEnd : undefined}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(-${active * cardWidth}px)`,
            transition: dragging ? 'none' : 'transform 0.55s cubic-bezier(0.77,0,0.18,1)',
          }}
        >
          {posts.map((post, i) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post._id}
              draggable={false}
              onClick={(e) => { if (dragging) e.preventDefault() }}
              className={`relative overflow-hidden h-[260px] md:h-[300px] lg:h-[340px] 2xl:h-[400px] border-r border-white/5 no-underline text-inherit transition-opacity duration-300 ${i === active ? 'opacity-100' : 'opacity-45'}`}
              style={{ flex: `0 0 ${cardRatio * 100}%` }}
            >
              {post.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`${post.coverImage}?w=900&q=80&auto=format`}
                  alt={post.title}
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover block pointer-events-none select-none"
                />
              ) : (
                <div className="absolute inset-0 bg-[#1a1a1a]" />
              )}

              {/* Fixed gradient overlay — readability guarantee */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.1) 100%)',
                }}
              />

              {/* Content overlay */}
              <div className="absolute inset-0 z-[2] flex flex-col justify-end p-4 md:p-5 pointer-events-none">
                <p className="text-[7px] tracking-[.22em] uppercase text-white/40 mb-2">
                  {post.postType || 'essay'}
                </p>
                <h2 className="text-[13px] md:text-[14px] lg:text-[16px] 2xl:text-[18px] font-black leading-[1.05] tracking-[-0.025em] uppercase text-white">
                  {post.title}
                </h2>
                <p className="mt-2.5 text-[8px] tracking-[.18em] uppercase text-white/40 flex items-center gap-1.5">
                  <span className="w-4 h-px bg-current inline-block" />
                  Oku
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SCROLL BAR */}
      {posts.length > 1 && (
        <div className="bg-foreground flex items-stretch">
          <button
            onClick={() => go(active - 1)}
            aria-label="Previous"
            className="bg-transparent border-none text-white/35 hover:text-white text-[16px] px-6 py-3 min-h-[44px] cursor-pointer font-sans leading-none transition-colors"
          >
            ←
          </button>
          <div className="flex-1 flex items-center">
            <div className="w-full h-px bg-white/15 relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-white/65 transition-all duration-500"
                style={{
                  width: `${100 / posts.length}%`,
                  left: posts.length > 1
                    ? `${(active / (posts.length - 1)) * (100 - 100 / posts.length)}%`
                    : '0%',
                }}
              />
            </div>
          </div>
          <button
            onClick={() => go(active + 1)}
            aria-label="Next"
            className="bg-transparent border-none text-white/35 hover:text-white text-[16px] px-6 py-3 min-h-[44px] cursor-pointer font-sans leading-none transition-colors"
          >
            →
          </button>
        </div>
      )}

      {/* ARCHIVE LIST */}
      <div>
        <div className="flex items-center px-5 md:px-7 pt-2.5 gap-3">
          <div className="flex-1 h-px bg-foreground/15" />
          <span className="text-[8px] tracking-[.2em] uppercase text-foreground/30 whitespace-nowrap">
            Tüm Yazılar
          </span>
          <div className="flex-1 h-px bg-foreground/15" />
        </div>

        {posts.map((post, i) => (
          <div
            key={post._id}
            onClick={() => go(i)}
            className="relative overflow-hidden cursor-pointer group"
          >
            {/* Sweep */}
            <div className="absolute inset-0 w-0 bg-foreground group-hover:w-full transition-[width] duration-300 ease-[cubic-bezier(0.77,0,0.18,1)] z-0" />

            {/* Active left border */}
            {i === active && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-foreground z-10" />
            )}

            <div className="relative z-[1] flex justify-between items-center px-5 md:px-7 py-3 md:py-2.5 border-b border-foreground/[0.08]">
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="text-[9px] text-foreground/25 tracking-[.08em] w-6 flex-shrink-0 group-hover:text-white/30 transition-colors">
                  {String(i + 1).padStart(3, '0')}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className={`text-[11px] md:text-[12px] tracking-[-0.01em] uppercase no-underline transition-colors group-hover:!text-white truncate ${i === active ? 'font-black text-foreground' : 'font-semibold text-foreground/50'}`}
                >
                  {post.title}
                </Link>
              </div>
              <span className="text-[9px] tracking-[.1em] text-foreground/25 group-hover:text-white/30 transition-colors whitespace-nowrap ml-4 flex-shrink-0">
                {formatDate(post.date)}
              </span>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <p className="px-5 md:px-7 py-10 text-[11px] tracking-[.18em] uppercase text-foreground/40 text-center">
            Henüz yazı yok.
          </p>
        )}
      </div>
    </main>
  )
}
