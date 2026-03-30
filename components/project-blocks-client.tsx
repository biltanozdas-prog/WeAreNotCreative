"use client"

import { PortableText } from "@portabletext/react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/lib/sanity/image"
import { FullImageBlock, FullVideoBlock, TwoColumnBlock, GalleryBlock } from "@/components/lightbox-image-blocks"

// Static (non-image) PortableText block renderers
const textComponents = {
  types: {
    textBlock: ({ value }: any) => (
      <div className="mb-20 md:mb-28 max-w-[900px]">
        {value.heading && (
          <div className="flex items-center gap-4 mb-8 md:mb-10">
            <span className="w-8 h-px bg-muted-foreground" />
            <span className="font-sans font-medium text-[12px] md:text-[13px] tracking-[0.15em] text-foreground uppercase">
              {value.heading}
            </span>
          </div>
        )}
        <div className="font-sans font-light text-[18px] md:text-[22px] leading-[1.5] text-foreground/80 whitespace-pre-line prose-p:mb-4">
          <PortableText value={value.body} />
        </div>
      </div>
    ),
    quote: ({ value }: any) => (
      <div className="mb-20 md:mb-28 max-w-[900px] border-l-2 md:border-l-4 border-foreground pl-6 md:pl-10">
        <blockquote className="font-sans font-black text-[clamp(24px,5vw,48px)] leading-[1.1] text-foreground uppercase tracking-[-0.03em] mb-6">
          &ldquo;{value.quoteText}&rdquo;
        </blockquote>
        {value.author && (
          <cite className="font-sans font-light text-[12px] md:text-[14px] text-muted-foreground tracking-[0.2em] uppercase block not-italic">
            — {value.author}
          </cite>
        )}
      </div>
    ),
    spacer: ({ value }: any) => {
      const h =
        value.size === "small"
          ? "h-16 md:h-24"
          : value.size === "large"
          ? "h-32 md:h-48"
          : "h-24 md:h-32"
      return <div className={`w-full ${h}`} />
    },
    heroOverride: ({ value }: any) => (
      <div className="w-full h-screen relative bg-muted mb-24 md:mb-32">
        <Image
          src={urlFor(value.image).url()}
          alt={value.title || "Hero Background"}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <h1 className="font-sans font-black text-[12vw] md:text-[8vw] leading-[0.8] uppercase text-foreground whitespace-pre-line tracking-[-0.04em] text-center z-10">
            {value.title}
          </h1>
        </div>
      </div>
    ),
    // Lightbox-aware image blocks
    fullImage: ({ value }: any) => (
      <FullImageBlock value={value} urlFor={urlFor} />
    ),
    fullVideo: ({ value }: any) => (
      <FullVideoBlock value={value} />
    ),
    twoColumn: ({ value }: any) => (
      <TwoColumnBlock value={value} urlFor={urlFor} PortableTextComp={PortableText} />
    ),
    gallery: ({ value }: any) => (
      <GalleryBlock value={value} urlFor={urlFor} />
    ),
  },
}

export function ProjectBlocks({ blocks }: { blocks: any[] }) {
  if (!blocks || blocks.length === 0) return null
  return <PortableText value={blocks} components={textComponents} />
}
