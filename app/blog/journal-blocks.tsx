"use client"

import { PortableText } from "@portabletext/react"

// Block renderers for Journal post detail pages.
// Independent of the project-side lightbox-image-blocks renderer.

const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.7, marginBottom: 18, color: '#0a0a0a' }}>
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h2 style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1.05, marginTop: 28, marginBottom: 14, color: '#0a0a0a' }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 22, marginBottom: 10, color: '#0a0a0a' }}>
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    underline: ({ children }: any) => (
      <span style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}>{children}</span>
    ),
    'strike-through': ({ children }: any) => (
      <span style={{ textDecoration: 'line-through' }}>{children}</span>
    ),
  },
}

function renderSlot(type: string | undefined, opts: {
  imageUrl?: string
  videoUrl?: string
  content?: any
}) {
  const t = (type || 'text').toLowerCase()
  if (t === 'video' && opts.videoUrl) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{ width: '100%', display: 'block' }}
      >
        <source src={opts.videoUrl} />
      </video>
    )
  }
  if (t === 'image' && opts.imageUrl) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={`${opts.imageUrl}?w=900&q=85&auto=format`}
        alt="Column media"
        style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block' }}
      />
    )
  }
  if (t === 'text' && opts.content) {
    return (
      <div style={{ maxWidth: 580, fontSize: 15, fontWeight: 300, lineHeight: 1.7, color: '#0a0a0a' }}>
        <PortableText value={opts.content} components={portableTextComponents} />
      </div>
    )
  }
  return null
}

export function JournalBlocks({ blocks }: { blocks: any[] }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block: any, i: number) => {
        switch (block._type) {
          case 'textBlock':
            return (
              <div key={i} style={{ padding: '24px 24px 0', maxWidth: 580 }}>
                {block.heading && (
                  <h2 style={{
                    fontSize: 14,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    marginBottom: 12,
                    color: '#0a0a0a',
                  }}>
                    {block.heading}
                  </h2>
                )}
                {block.body && (
                  <PortableText value={block.body} components={portableTextComponents} />
                )}
              </div>
            )

          case 'fullImage':
            return block.imageUrl ? (
              <div key={i} style={{ margin: '28px 0' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${block.imageUrl}?w=1200&q=85&auto=format`}
                  alt={block.caption || 'Full Image'}
                  style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', display: 'block' }}
                />
                {block.caption && (
                  <p style={{ padding: '8px 24px 0', fontSize: 10, color: '#999', letterSpacing: '.05em', textTransform: 'uppercase' }}>
                    {block.caption}
                  </p>
                )}
              </div>
            ) : null

          case 'fullVideo':
            return block.videoUrl ? (
              <div key={i} style={{ margin: '28px 0' }}>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: '100%', display: 'block' }}
                >
                  <source src={block.videoUrl} />
                </video>
                {block.caption && (
                  <p style={{ padding: '8px 24px 0', fontSize: 10, color: '#999', letterSpacing: '.05em', textTransform: 'uppercase' }}>
                    {block.caption}
                  </p>
                )}
              </div>
            ) : null

          case 'twoColumn':
            return (
              <div key={i} className="journal-twocol">
                <div>{renderSlot(block.leftType, {
                  imageUrl: block.leftImageUrl,
                  videoUrl: block.leftVideoUrl,
                  content: block.leftContent,
                })}</div>
                <div>{renderSlot(block.rightType, {
                  imageUrl: block.rightImageUrl,
                  videoUrl: block.rightVideoUrl,
                  content: block.rightContent,
                })}</div>
              </div>
            )

          case 'gallery': {
            const urls: string[] = (block.imageUrls || []).filter(Boolean)
            if (urls.length === 0) return null
            return (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: urls.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                gap: 4,
                margin: '28px 0',
              }}>
                {urls.map((url, idx) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={idx}
                    src={`${url}?w=800&q=85&auto=format`}
                    alt={`Gallery image ${idx + 1}`}
                    style={{ width: '100%', objectFit: 'contain', maxHeight: '70vh', display: 'block' }}
                  />
                ))}
              </div>
            )
          }

          case 'quote':
            return block.quoteText ? (
              <div key={i} style={{ background: '#0a0a0a', padding: '24px 24px', margin: '28px 0' }}>
                <p style={{
                  fontSize: 18,
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  maxWidth: 480,
                }}>
                  &ldquo;{block.quoteText}&rdquo;
                </p>
                {block.author && (
                  <p style={{
                    marginTop: 14,
                    fontSize: 9,
                    letterSpacing: '.2em',
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                  }}>
                    — {block.author}
                  </p>
                )}
              </div>
            ) : null

          case 'spacer':
            return (
              <div
                key={i}
                style={{ height: block.size === 'large' ? 80 : block.size === 'medium' ? 48 : 24 }}
              />
            )

          case 'heroOverride':
            return (
              <div key={i} style={{ margin: '28px 0', position: 'relative' }}>
                {block.imageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`${block.imageUrl}?w=1200&q=85&auto=format`}
                    alt={block.title || 'Hero'}
                    style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', display: 'block' }}
                  />
                )}
                {block.title && (
                  <p style={{
                    marginTop: 12,
                    padding: '0 24px',
                    fontSize: 11,
                    letterSpacing: '.1em',
                    color: '#999',
                    textTransform: 'uppercase',
                  }}>
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
