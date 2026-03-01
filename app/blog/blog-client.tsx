"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { TinaMarkdown } from "tinacms/dist/rich-text"

export function BlogClient({ blogPosts }: { blogPosts: any[] }) {
  const [activePost, setActivePost] = useState<any | null>(null)

  return (
    <main className="bg-background min-h-screen px-8 pt-[160px] pb-32 md:px-[60px] md:pt-[200px] md:pb-[180px]">
      <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-8">
        Observations
      </p>
      <h1 className="font-sans font-black text-[clamp(72px,14vw,200px)] leading-[0.82] tracking-[-0.04em] text-foreground uppercase mb-10 md:mb-14">
        JOURNAL
      </h1>
      <p className="font-sans font-light text-[16px] md:text-[18px] text-muted-foreground leading-[1.65] max-w-[520px] mb-24 md:mb-[140px]">
        Writing on design, process, culture and the thinking behind our practice.
        Not content. Thought. Click any entry to read.
      </p>

      {/* Blog entries - asymmetric layout */}
      <div className="flex flex-col gap-16 md:gap-24">
        {blogPosts.map((post, index) => (
          <div
            key={post.id}
            className={index < blogPosts.length - 1 ? "pb-16 md:pb-24 border-b border-secondary" : ""}
          >
            <BlogEntry
              post={post}
              index={index}
              onOpen={() => setActivePost(post)}
            />
          </div>
        ))}
      </div>

      {/* Reader Panel */}
      <ReaderPanel post={activePost} onClose={() => setActivePost(null)} />
    </main>
  )
}

function BlogEntry({
  post,
  index,
  onOpen,
}: {
  post: any
  index: number
  onOpen: () => void
}) {
  const isWide = index % 3 === 0
  const isOffset = index % 2 !== 0

  return (
    <button
      onClick={onOpen}
      className={`block w-full text-left bg-transparent border-none cursor-pointer p-0 group ${isOffset ? "md:ml-auto md:max-w-[75%]" : "md:max-w-[85%]"
        }`}
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        <div
          className={`relative overflow-hidden bg-muted shrink-0 ${isWide
              ? "w-full md:w-[420px] h-[240px] md:h-[320px]"
              : "w-full md:w-[300px] h-[200px] md:h-[240px]"
            }`}
        >
          <Image
            src={post.image || ""}
            alt={post.title}
            fill
            className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 420px"
          />
        </div>

        <div className="flex flex-col justify-between flex-1 min-h-[200px]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.2em] text-muted-foreground uppercase">
                {post.category}
              </span>
              <span className="w-4 h-px bg-muted-foreground" />
              <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.2em] text-muted-foreground uppercase">
                {post.date}
              </span>
            </div>

            <h2 className="font-sans font-black text-[28px] md:text-[40px] leading-[0.88] uppercase tracking-[-0.03em] text-foreground mb-4 md:mb-6 group-hover:opacity-70 transition-opacity">
              {post.title}
            </h2>

            <p className="font-sans font-light text-[14px] md:text-[16px] text-foreground/60 leading-relaxed max-w-[400px]">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <span className="font-sans font-light text-[12px] tracking-[0.15em] text-muted-foreground uppercase">
              {post.readTime}
            </span>
            <span className="font-sans font-medium text-[12px] tracking-[0.1em] text-foreground uppercase border-b border-foreground">
              Read
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

function ReaderPanel({
  post,
  onClose,
}: {
  post: any | null
  onClose: () => void
}) {
  useEffect(() => {
    if (post) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [post])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#000000]/50 z-[99998] transition-opacity duration-500 ${post ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel sliding from right */}
      <div
        className={`fixed top-0 right-0 w-full md:w-[55vw] h-screen bg-background z-[99999] transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] border-l-2 border-foreground overflow-y-auto ${post ? "translate-x-0" : "translate-x-full"
          }`}
        role="dialog"
        aria-modal="true"
        aria-label={post ? `Reading: ${post.title}` : "Blog reader"}
      >
        {post && (
          <div className="px-8 py-12 md:px-12 md:py-16">
            <button
              onClick={onClose}
              className="font-sans font-light text-[14px] md:text-[16px] text-muted-foreground bg-transparent border-none cursor-pointer mb-12 p-0 tracking-[0.15em] uppercase hover:text-foreground transition-colors"
              aria-label="Close reader"
            >
              {'[ Close ]'}
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.2em] text-muted-foreground uppercase">{post.category}</span>
              <span className="w-4 h-px bg-muted-foreground" />
              <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.2em] text-muted-foreground uppercase">{post.date}</span>
              <span className="w-4 h-px bg-muted-foreground" />
              <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.2em] text-muted-foreground uppercase">{post.readTime}</span>
            </div>

            <h1 className="font-sans font-black text-[36px] md:text-[56px] leading-[0.88] uppercase tracking-[-0.03em] text-foreground mb-10 md:mb-14">
              {post.title}
            </h1>

            <div className="w-full h-[30vh] md:h-[45vh] bg-muted relative overflow-hidden mb-10 md:mb-14">
              <Image src={post.image || ""} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 55vw" />
            </div>

            <div className="font-sans font-light text-[15px] md:text-[17px] text-foreground/80 leading-[1.7] mb-6 md:mb-8 space-y-6">
              <TinaMarkdown content={post.body} />
            </div>

            {post.pullQuote && (
              <blockquote className="border-l-[4px] border-foreground pl-6 md:pl-8 my-10 md:my-14">
                <p className="font-sans font-black text-[20px] md:text-[28px] leading-[1.1] uppercase tracking-[-0.02em] text-foreground">
                  {post.pullQuote}
                </p>
              </blockquote>
            )}

            {post.contentImages && post.contentImages.length > 0 && (
              <div className="w-[85%] md:w-[70%] h-[25vh] md:h-[35vh] bg-muted relative overflow-hidden my-10 md:my-14 md:ml-[15%]">
                <Image src={post.contentImages[0] || ""} alt={`${post.title} - detail`} fill className="object-cover" sizes="(max-width: 768px) 85vw, 40vw" />
              </div>
            )}

            <div className="flex items-center gap-4 mt-14 md:mt-20 pt-8 border-t border-secondary">
              <span className="w-2 h-2 bg-foreground" />
              <span className="font-sans font-light text-[12px] tracking-[0.2em] text-muted-foreground uppercase">
                End of article
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

