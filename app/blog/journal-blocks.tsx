"use client"

import { PortableText } from "@portabletext/react"

// Journal block renderer — independent of the project-side
// lightbox-image-blocks component. Tailwind-only, no inline styles.

const ptComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-[13px] leading-[1.82] text-foreground/60 mb-3 last:mb-0">
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
          className="w-full max-h-[85vh] xl:max-h-[500px] object-contain block"
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
      {blocks.map((block: any, i: number) => {
        const key = block._key ?? `block-${i}`

        switch (block._type) {
          case 'textBlock':
            return (
              <div key={key} className="pt-6 max-w-[640px]">
                {block.heading && (
                  <p className="text-[13px] font-black uppercase tracking-[-0.015em] mb-2.5 text-foreground">
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
                  <p className="px-4 md:px-7 pt-2 text-[9px] tracking-[.08em] text-muted-foreground uppercase">
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
                  <p className="px-4 md:px-7 pt-2 text-[9px] tracking-[.08em] text-muted-foreground uppercase">
                    {block.caption}
                  </p>
                )}
              </div>
            ) : null

          case 'twoColumn':
            return (
              <div
                key={key}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.4fr] gap-5 pt-7"
              >
                {renderSlot('left', block)}
                {renderSlot('right', block)}
              </div>
            )

          case 'gallery': {
            const urls: string[] = (block.imageUrls ?? []).filter(Boolean)
            if (!urls.length) return null
            const cols = urls.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
            return (
              <div key={key} className={`grid ${cols} gap-1 -mx-4 md:-mx-7 mt-7`}>
                {urls.map((url, idx) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={idx}
                    src={`${url}?w=900&q=85&auto=format`}
                    alt={`Gallery image ${idx + 1}`}
                    className="w-full max-h-[70vh] object-contain block"
                  />
                ))}
              </div>
            )
          }

          case 'quote':
            return block.quoteText ? (
              <div key={key} className="-mx-4 md:-mx-7 mt-7 bg-foreground px-4 md:px-7 py-6">
                <p className="text-[17px] font-black leading-[1.1] tracking-[-0.025em] uppercase text-background max-w-[500px]">
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
                  <p className="px-4 md:px-7 pt-3 text-[11px] tracking-[.1em] text-muted-foreground uppercase">
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
