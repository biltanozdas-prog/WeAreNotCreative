"use client"

import { PortableText } from "@portabletext/react"

// Journal block renderer — independent of the project-side
// lightbox-image-blocks component. Tailwind-only, no inline styles.
// Asymmetric two-column / gallery layouts driven by block index.

const ptComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-[13px] leading-[1.82] text-foreground/55 mb-3 last:mb-0">
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-[13px] font-black uppercase tracking-[-0.015em] mb-2.5 mt-6 first:mt-0 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-[12px] font-bold uppercase tracking-[-0.01em] mb-2 mt-5 first:mt-0 text-foreground">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    underline: ({ children }: any) => (
      <span className="underline underline-offset-2">{children}</span>
    ),
    'strike-through': ({ children }: any) => (
      <span className="line-through">{children}</span>
    ),
  },
}

function renderSlot(side: 'left' | 'right', block: any) {
  const type = side === 'left' ? block.leftType : block.rightType
  const content = side === 'left' ? block.leftContent : block.rightContent
  const imageUrl = side === 'left' ? block.leftImageUrl : block.rightImageUrl
  const videoUrl = side === 'left' ? block.leftVideoUrl : block.rightVideoUrl

  switch ((type || 'text').toLowerCase()) {
    case 'image':
      return imageUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={`${imageUrl}?w=900&q=85&auto=format`}
          alt="Column media"
          className="w-full max-h-[85vh] object-contain block"
        />
      ) : null
    case 'video':
      return videoUrl ? (
        <video autoPlay muted loop playsInline className="w-full block">
          <source src={videoUrl} />
        </video>
      ) : null
    case 'text':
    default:
      return content ? (
        <div>
          <PortableText value={content} components={ptComponents} />
        </div>
      ) : null
  }
}

export function JournalBlocks({ blocks }: { blocks: any[] }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block: any, index: number) => {
        const key = block._key ?? `block-${index}`

        switch (block._type) {
          case 'textBlock':
            return (
              <div key={key} className="pt-6 max-w-[580px]">
                {block.heading && (
                  <p className="text-[12px] font-black uppercase tracking-[-0.015em] mb-2.5 text-foreground">
                    {block.heading}
                  </p>
                )}
                {block.body && (
                  <PortableText value={block.body} components={ptComponents} />
                )}
              </div>
            )

          case 'fullImage':
            return block.imageUrl ? (
              <div key={key} className="-mx-4 md:-mx-7 mt-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${block.imageUrl}?w=1400&q=85&auto=format`}
                  alt={block.caption ?? ''}
                  className="w-full max-h-[85vh] object-contain block"
                />
                {block.caption && (
                  <p className="px-4 md:px-7 pt-2 text-[9px] tracking-[.08em] text-foreground/40 uppercase">
                    {block.caption}
                  </p>
                )}
              </div>
            ) : null

          case 'fullVideo':
            return block.videoUrl ? (
              <div key={key} className="-mx-4 md:-mx-7 mt-7">
                <video autoPlay muted loop playsInline className="w-full block">
                  <source src={block.videoUrl} />
                </video>
                {block.caption && (
                  <p className="px-4 md:px-7 pt-2 text-[9px] tracking-[.08em] text-foreground/40 uppercase">
                    {block.caption}
                  </p>
                )}
              </div>
            ) : null

          case 'twoColumn': {
            // Alternating asymmetry — even index: image-left bleeds left.
            // Odd index: image-right bleeds right.
            const isEven = index % 2 === 0
            const bleedSide = isEven ? '-ml-4 md:-ml-7' : '-mr-4 md:-mr-7'
            const colsMd = isEven ? 'md:grid-cols-[1.5fr_1fr]' : 'md:grid-cols-[1fr_1.5fr]'

            return (
              <div
                key={key}
                className={`grid grid-cols-1 gap-0 mt-7 items-start ${bleedSide} ${colsMd}`}
              >
                <div className={isEven ? 'order-1' : 'order-2 md:order-1'}>
                  {renderSlot('left', block)}
                </div>
                <div className={`px-5 md:px-6 pt-4 md:pt-0 ${isEven ? 'order-2' : 'order-1 md:order-2'}`}>
                  {renderSlot('right', block)}
                </div>
              </div>
            )
          }

          case 'gallery': {
            const urls: string[] = (block.imageUrls ?? []).filter(Boolean)
            if (!urls.length) return null
            const cols = urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            return (
              <div key={key} className={`grid ${cols} gap-1 -mx-4 md:-mx-7 mt-7 items-end`}>
                {urls.map((url, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={i}
                    src={`${url}?w=900&q=85&auto=format`}
                    alt={`Gallery image ${i + 1}`}
                    className={`w-full object-contain block ${
                      i % 2 !== 0 ? 'max-h-[55vh] mt-[8%]' : 'max-h-[70vh]'
                    }`}
                  />
                ))}
              </div>
            )
          }

          case 'quote':
            return block.quoteText ? (
              <div key={key} className="-mx-4 md:-mx-7 mt-7 bg-foreground px-4 md:px-7 py-6">
                <p className="text-[17px] md:text-[20px] font-black leading-[1.1] tracking-[-0.025em] uppercase text-background max-w-[520px]">
                  &ldquo;{block.quoteText}&rdquo;
                </p>
                {block.author && (
                  <p className="mt-3 text-[8px] tracking-[.22em] uppercase text-background/50">
                    — {block.author}
                  </p>
                )}
              </div>
            ) : null

          case 'spacer': {
            const heights: Record<string, string> = {
              small: 'h-6',
              medium: 'h-12',
              large: 'h-20',
            }
            return <div key={key} className={heights[block.size as string] ?? 'h-12'} />
          }

          case 'heroOverride':
            return (
              <div key={key} className="-mx-4 md:-mx-7 mt-7">
                {block.imageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`${block.imageUrl}?w=1400&q=85&auto=format`}
                    alt={block.title ?? ''}
                    className="w-full max-h-[85vh] object-contain block"
                  />
                )}
                {block.title && (
                  <p className="px-4 md:px-7 pt-3 text-[11px] tracking-[.1em] text-foreground/40 uppercase">
                    {block.title}
                  </p>
                )}
              </div>
            )

          default:
            return null
        }
      })}
    </>
  )
}
