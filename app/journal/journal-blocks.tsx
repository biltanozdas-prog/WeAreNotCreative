"use client"

import { PortableText } from "@portabletext/react"

// Journal block renderer — independent of the project-side
// lightbox-image-blocks component. Tailwind-only, no inline styles.
// Asymmetric two-column / gallery layouts driven by block index.
//
// Mobile is treated separately: bleed margins, asymmetric heights, and
// object-contain handling all bypass mobile and only kick in at md+.

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
          className="w-full h-auto object-contain block md:max-h-[85vh]"
        />
      ) : null
    case 'video':
      return videoUrl ? (
        <video autoPlay muted loop playsInline className="w-full block max-h-[70vw] md:max-h-none object-cover">
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
              <div key={key} className="-mx-5 md:-mx-7 mt-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${block.imageUrl}?w=1400&q=85&auto=format`}
                  alt={block.caption ?? ''}
                  className="w-full h-auto object-contain block md:max-h-[85vh]"
                />
                {block.caption && (
                  <p className="px-5 md:px-7 pt-2 text-[9px] tracking-[.08em] text-foreground/40 uppercase">
                    {block.caption}
                  </p>
                )}
              </div>
            ) : null

          case 'fullVideo':
            return block.videoUrl ? (
              <div key={key} className="-mx-5 md:-mx-7 mt-7">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full block max-h-[70vw] md:max-h-none object-cover"
                >
                  <source src={block.videoUrl} />
                </video>
                {block.caption && (
                  <p className="px-5 md:px-7 pt-2 text-[9px] tracking-[.08em] text-foreground/40 uppercase">
                    {block.caption}
                  </p>
                )}
              </div>
            ) : null

          case 'twoColumn': {
            // Alternating asymmetry on md+; mobile is always single-column
            // with image on top (order swap) and NO negative margin so the
            // text slot keeps the body padding.
            const isEven = index % 2 === 0
            const bleedSide = isEven ? 'md:-ml-7' : 'md:-mr-7'
            const colsMd = isEven ? 'md:grid-cols-[1.5fr_1fr]' : 'md:grid-cols-[1fr_1.5fr]'

            return (
              <div
                key={key}
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 mt-7 items-start ${bleedSide} ${colsMd}`}
              >
                <div className={isEven ? 'order-1' : 'order-2 md:order-1'}>
                  {renderSlot('left', block)}
                </div>
                <div className={`pt-4 md:pt-0 px-0 md:px-6 ${isEven ? 'order-2' : 'order-1 md:order-2'}`}>
                  {renderSlot('right', block)}
                </div>
              </div>
            )
          }

          case 'gallery': {
            const urls: string[] = (block.imageUrls ?? []).filter(Boolean)
            if (!urls.length) return null
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-1 -mx-5 md:-mx-7 mt-7 md:items-end" key={key}>
                {urls.map((url, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={i}
                    src={`${url}?w=900&q=85&auto=format`}
                    alt={`Gallery image ${i + 1}`}
                    className={`w-full h-auto block object-contain md:max-h-[70vh] ${
                      i % 2 !== 0 ? 'md:mt-[8%] md:max-h-[55vh]' : ''
                    }`}
                  />
                ))}
              </div>
            )
          }

          case 'quote':
            return block.quoteText ? (
              <div key={key} className="-mx-5 md:-mx-7 mt-7 bg-foreground px-5 md:px-7 py-6">
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
              small:  'h-4 md:h-6',
              medium: 'h-8 md:h-12',
              large:  'h-12 md:h-20',
            }
            return <div key={key} className={heights[block.size as string] ?? 'h-8 md:h-12'} />
          }

          case 'heroOverride':
            return (
              <div key={key} className="-mx-5 md:-mx-7 mt-7">
                {block.imageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`${block.imageUrl}?w=1400&q=85&auto=format`}
                    alt={block.title ?? ''}
                    className="w-full h-auto object-contain block md:max-h-[85vh]"
                  />
                )}
                {block.title && (
                  <p className="px-5 md:px-7 pt-3 text-[11px] tracking-[.1em] text-foreground/40 uppercase">
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
