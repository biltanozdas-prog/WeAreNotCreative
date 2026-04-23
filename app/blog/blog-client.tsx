"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { PortableText } from "@portabletext/react"
import { components } from "@/lib/sanity/portableText"

export function BlogClient({ blogPosts, pageData }: { blogPosts: any[], pageData?: any }) {
  const [activePost, setActivePost] = useState<any | null>(null)

  return (
    <main className="bg-background min-h-screen px-8 pt-[160px] pb-32 md:px-[60px] md:pt-[200px] md:pb-[180px]">
      {pageData?.eyebrowLabel && (
        <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-8">
          {pageData.eyebrowLabel}
        </p>
      )}
      {pageData?.headline && (
        <h1 className="font-sans font-black text-[clamp(72px,14vw,200px)] leading-[0.82] tracking-[-0.04em] text-foreground uppercase mb-10 md:mb-14">
          {pageData.headline}
        </h1>
      )}
      {pageData?.intro && (
        <p className="font-sans font-light text-[16px] md:text-[18px] text-muted-foreground leading-[1.65] max-w-[520px] mb-24 md:mb-[140px]">
          {pageData.intro}
        </p>
      )}

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
            src={post.coverImage || post.image || ""}
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
                {post.date}
              </span>
            </div>

            <h2 className="font-sans font-black text-[20px] md:text-[40px] leading-[0.88] uppercase tracking-[-0.03em] text-foreground mb-4 md:mb-6 group-hover:opacity-70 transition-opacity break-words hyphens-auto">
              {post.title}
            </h2>

            <p className="font-sans font-light text-[14px] md:text-[16px] text-foreground/60 leading-relaxed max-w-[400px]">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-6">
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
              <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.2em] text-muted-foreground uppercase">{post.date}</span>
            </div>

            <h1 className="font-sans font-black text-[36px] md:text-[56px] leading-[0.88] uppercase tracking-[-0.03em] text-foreground mb-10 md:mb-14">
              {post.title}
            </h1>

            {post.coverImage && (
              <div className="w-full h-[30vh] md:h-[45vh] bg-muted relative overflow-hidden mb-10 md:mb-14">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
              </div>
            )}

            <div className="font-sans font-light text-[15px] md:text-[17px] text-foreground leading-[1.7] mb-6 md:mb-8 space-y-8">
              {(post.blocks || []).map((block: any, i: number) => {
                // NOTE: Sanity blocks use _type, not _template
                switch (block._type) {
                  case "fullImage":
                    return block.imageUrl ? (
                      <div key={i} className="my-8 px-6 md:px-12">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={block.imageUrl}
                          alt={block.caption || "Full Image"}
                          className="w-full h-auto block mx-auto"
                          style={{ maxHeight: '85vh', objectFit: 'contain' }}
                        />
                        {block.caption && (
                          <p className="mt-4 font-sans font-light text-[12px] text-muted-foreground tracking-[0.15em] uppercase text-center">
                            {block.caption}
                          </p>
                        )}
                      </div>
                    ) : null
                  case "fullVideo":
                    return block.videoUrl ? (
                      <div key={i} className="w-full mb-12 md:mb-16 relative">
                        <video
                          src={block.videoUrl}
                          className="w-full h-auto block"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                        {block.caption && (
                          <p className="mt-4 font-sans font-light text-[12px] text-muted-foreground tracking-[0.15em] uppercase text-center">
                            {block.caption}
                          </p>
                        )}
                      </div>
                    ) : null
                  case "textBlock":
                    return (
                      <div key={i} className="mb-12 md:mb-16">
                        {block.heading && (
                          <h2 className="font-sans font-black text-[20px] md:text-[28px] uppercase tracking-[-0.02em] mb-4 text-foreground">
                            {block.heading}
                          </h2>
                        )}
                        {block.body && (
                          <div className="font-sans font-light text-[16px] md:text-[18px] leading-[1.6] text-foreground">
                            <PortableText
                              value={block.body}
                              components={{
                                block: {
                                  normal: ({ children }: any) => (
                                    <p className="mb-5 text-[15px] md:text-[17px] leading-[1.7] font-light text-foreground">
                                      {children}
                                    </p>
                                  ),
                                  h2: ({ children }: any) => (
                                    <h2 className="text-[20px] md:text-[26px] font-black uppercase tracking-[-0.02em] mb-4 mt-8 text-foreground">
                                      {children}
                                    </h2>
                                  ),
                                  h3: ({ children }: any) => (
                                    <h3 className="text-[16px] md:text-[20px] font-bold mb-3 mt-6 text-foreground">
                                      {children}
                                    </h3>
                                  ),
                                },
                                marks: {
                                  strong: ({ children }: any) => (
                                    <strong className="font-bold">{children}</strong>
                                  ),
                                  em: ({ children }: any) => (
                                    <em className="italic">{children}</em>
                                  ),
                                  underline: ({ children }: any) => (
                                    <span className="underline underline-offset-2">{children}</span>
                                  ),
                                  'strike-through': ({ children }: any) => (
                                    <span className="line-through">{children}</span>
                                  ),
                                },
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  case "twoColumn":
                    return (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12 md:mb-16 items-start">
                        {(block.heading || block.leftContent) && (
                          <div className="font-sans font-light text-[15px] md:text-[16px] leading-[1.6] text-foreground">
                            {block.heading && (
                              <h3 className="font-black text-[18px] md:text-[24px] uppercase tracking-[-0.02em] mb-4 text-foreground">
                                {block.heading}
                              </h3>
                            )}
                            {block.leftContent && (
                              <PortableText
                                value={block.leftContent}
                                components={{
                                  block: {
                                    normal: ({ children }: any) => (
                                      <p className="mb-5 text-[15px] md:text-[17px] leading-[1.7] font-light text-foreground">
                                        {children}
                                      </p>
                                    ),
                                    h2: ({ children }: any) => (
                                      <h2 className="text-[20px] md:text-[26px] font-black uppercase tracking-[-0.02em] mb-4 mt-8 text-foreground">
                                        {children}
                                      </h2>
                                    ),
                                    h3: ({ children }: any) => (
                                      <h3 className="text-[16px] md:text-[20px] font-bold mb-3 mt-6 text-foreground">
                                        {children}
                                      </h3>
                                    ),
                                  },
                                  marks: {
                                    strong: ({ children }: any) => (
                                      <strong className="font-bold">{children}</strong>
                                    ),
                                    em: ({ children }: any) => (
                                      <em className="italic">{children}</em>
                                    ),
                                    underline: ({ children }: any) => (
                                      <span className="underline underline-offset-2">{children}</span>
                                    ),
                                    'strike-through': ({ children }: any) => (
                                      <span className="line-through">{children}</span>
                                    ),
                                  },
                                }}
                              />
                            )}
                          </div>
                        )}
                        {block.rightVideoUrl ? (
                          <div className="w-full relative">
                            <video src={block.rightVideoUrl} className="w-full h-auto block" autoPlay loop muted playsInline />
                          </div>
                        ) : block.rightImageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={block.rightImageUrl}
                            alt="Column media"
                            className="w-full h-auto block"
                            style={{ maxHeight: '70vh', objectFit: 'contain' }}
                          />
                        ) : null}
                      </div>
                    )
                  case "gallery":
                    return (block.imageUrls?.length > 0) ? (
                      <div key={i} className={`grid gap-4 md:gap-6 mb-12 md:mb-16 items-start ${block.imageUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {block.imageUrls.slice(0, 4).map((url: string, idx: number) => (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            key={idx}
                            src={url}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-auto block"
                          />
                        ))}
                      </div>
                    ) : null
                  case "quote":
                    return block.quoteText ? (
                      <div key={i} className="mb-12 md:mb-16 border-l-2 md:border-l-[3px] border-foreground pl-6 md:pl-8">
                        <blockquote className="font-sans font-black text-[clamp(20px,4vw,36px)] leading-[1.1] text-foreground uppercase tracking-[-0.02em] mb-4">
                          &ldquo;{block.quoteText}&rdquo;
                        </blockquote>
                        {block.author && (
                          <cite className="font-sans font-light text-[11px] md:text-[12px] text-muted-foreground tracking-[0.2em] uppercase block not-italic">
                            — {block.author}
                          </cite>
                        )}
                      </div>
                    ) : null
                  case "spacer": {
                    const h = block.size === "small" ? "h-12" : block.size === "large" ? "h-24 md:h-32" : "h-16 md:h-20"
                    return <div key={i} className={`w-full ${h}`} />
                  }
                  default:
                    return null
                }
              })}
            </div>

            {(!post.blocks || post.blocks.length === 0) && (
              <div className="font-sans font-light text-[15px] md:text-[17px] text-foreground leading-[1.7] mb-6 md:mb-8 space-y-6">
                {(post.content || post.body) ? (
                  Array.isArray(post.content || post.body)
                    ? <PortableText value={post.content || post.body} components={components} />
                    : String(post.content || post.body)
                ) : "Blog content coming soon."}
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
