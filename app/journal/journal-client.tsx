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

function getCardRatio(width: number) {
  if (width < 768) return 0.85   // mobile — single card dominates
  if (width < 1024) return 0.60  // tablet
  return 0.55                    // desktop & up
}

export function JournalClient({
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

  const progressPercent = posts.length > 1 ? (active / (posts.length - 1)) * 100 : 0

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

      {/* SLIDER — image + text card; arrows float over the image */}
      <div className="relative">
        <div
          ref={sliderRef}
          className={`overflow-hidden bg-background select-none ${posts.length > 1 ? 'cursor-grab' : ''}`}
          onMouseDown={handleMouseDown}
          onTouchStart={posts.length > 1 ? handleTouchStart : undefined}
          onTouchEnd={posts.length > 1 ? handleTouchEnd : undefined}
        >
          <div
            className="flex items-stretch"
            style={{
              transform: `translateX(-${active * cardWidth}px)`,
              transition: dragging ? 'none' : 'transform 0.55s cubic-bezier(0.77,0,0.18,1)',
            }}
          >
            {posts.map((post, i) => (
              <Link
                href={`/journal/${post.slug}`}
                key={post._id}
                draggable={false}
                onClick={(e) => { if (dragging) e.preventDefault() }}
                className={`relative flex-shrink-0 flex flex-col border-r border-foreground/10 no-underline text-inherit transition-opacity duration-300 ${i === active ? 'opacity-100' : 'opacity-45'}`}
                style={{ flex: `0 0 ${cardRatio * 100}%` }}
              >
                {/* Image — full colour, no overlay */}
                <div className="relative overflow-hidden h-[260px] md:h-[340px] lg:h-[420px] 2xl:h-[480px]">
                  {post.coverImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`${post.coverImage}?w=1200&q=82&auto=format`}
                      alt={post.title}
                      draggable={false}
                      className="absolute inset-0 w-full h-full object-cover block pointer-events-none select-none"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#1a1a1a]" />
                  )}
                </div>

                {/* Text panel — own background below the image */}
                <div className="flex flex-col gap-2 px-4 md:px-5 pt-3 pb-4 bg-background border-t border-foreground/10">
                  <p className="text-[7px] tracking-[.22em] uppercase text-foreground/40">
                    {post.postType || 'essay'}
                  </p>
                  <h2 className="text-[12px] md:text-[13px] lg:text-[14px] font-black leading-[1.1] tracking-[-0.02em] uppercase text-foreground line-clamp-3">
                    {post.title}
                  </h2>
                  <p className="text-[8px] tracking-[.18em] uppercase text-foreground/35 flex items-center gap-1.5 mt-1">
                    <span className="w-3 h-px bg-current inline-block" />
                    OKU
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Floating arrow controls — sit on top of the slider, blend with image */}
        {posts.length > 1 && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-between px-3 md:px-6"
            style={{ mixBlendMode: 'difference' }}
          >
            <button
              onClick={() => go(active - 1)}
              aria-label="Önceki"
              disabled={active === 0}
              className="pointer-events-auto flex items-center justify-center w-16 h-16 md:w-24 md:h-24 text-white text-[52px] md:text-[80px] leading-none font-light bg-transparent border-none cursor-pointer transition-opacity duration-200 disabled:opacity-25 hover:opacity-100 opacity-90"
            >
              ‹
            </button>
            <button
              onClick={() => go(active + 1)}
              aria-label="Sonraki"
              disabled={active === posts.length - 1}
              className="pointer-events-auto flex items-center justify-center w-16 h-16 md:w-24 md:h-24 text-white text-[52px] md:text-[80px] leading-none font-light bg-transparent border-none cursor-pointer transition-opacity duration-200 disabled:opacity-25 hover:opacity-100 opacity-90"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Progress — thin line below the slider, no dark band */}
      {posts.length > 1 && (
        <div className="px-5 md:px-7 py-3 border-b border-foreground/[0.08]">
          <div className="relative h-px w-full bg-foreground/10">
            <div
              className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-foreground transition-all duration-500 ease-[cubic-bezier(0.77,0,0.18,1)]"
              style={{
                width: `${100 / posts.length}%`,
                left: `${progressPercent * (1 - 1 / posts.length)}%`,
              }}
            />
          </div>
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

            <div className="relative z-[1] flex items-center px-5 md:px-7 py-3 md:py-2.5 border-b border-foreground/[0.08]">
              <div className="flex items-baseline gap-3 min-w-0 flex-1">
                <span className="text-[9px] text-foreground/25 tracking-[.08em] w-6 flex-shrink-0 group-hover:text-white/30 transition-colors">
                  {String(i + 1).padStart(3, '0')}
                </span>
                <Link
                  href={`/journal/${post.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className={`text-[11px] md:text-[12px] tracking-[-0.01em] uppercase no-underline transition-colors group-hover:!text-white truncate ${i === active ? 'font-black text-foreground' : 'font-semibold text-foreground/50'}`}
                >
                  {post.title}
                </Link>
              </div>
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
