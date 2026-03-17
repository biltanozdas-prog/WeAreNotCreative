"use client"

import Image from "next/image"
import { useLightbox } from "@/components/lightbox-provider"

// Shared clickable image wrapper — looks up its own index via src match
function ClickableImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const { images, open } = useLightbox()
  const index = images.findIndex((img) => img.src === src)

  return (
    <div
      className={`relative cursor-zoom-in ${className ?? ""}`}
      onClick={() => index >= 0 && open(index)}
      role="button"
      tabIndex={0}
      aria-label={`Open image: ${alt}`}
      onKeyDown={(e) => e.key === "Enter" && index >= 0 && open(index)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes ?? "100vw"}
        priority={priority}
      />
    </div>
  )
}

// fullImage block
export function FullImageBlock({
  value,
  urlFor,
}: {
  value: any
  urlFor: (img: any) => { url: () => string }
}) {
  const src = urlFor(value.image).url()
  return (
    <div className="w-full mb-20 md:mb-28 relative overflow-hidden">
      <ClickableImage
        src={src}
        alt={value.caption || "Full Image"}
        className="w-full h-[50vh] md:h-[85vh] bg-muted"
        sizes="100vw"
      />
      {value.caption && (
        <p className="mt-4 md:mt-6 font-sans font-light text-[12px] md:text-[13px] text-muted-foreground tracking-[0.15em] uppercase text-center">
          {value.caption}
        </p>
      )}
    </div>
  )
}

// twoColumn block
export function TwoColumnBlock({
  value,
  urlFor,
  PortableTextComp,
}: {
  value: any
  urlFor: (img: any) => { url: () => string }
  PortableTextComp: any
}) {
  const src = value.rightImage ? urlFor(value.rightImage).url() : null
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-20 md:mb-28 items-start">
      <div className="font-sans font-light text-[16px] md:text-[20px] leading-[1.6] text-foreground/80 whitespace-pre-line prose-p:mb-4">
        <PortableTextComp value={value.leftContent} />
      </div>
      {src && (
        <ClickableImage
          src={src}
          alt="Column media"
          className="w-full h-[40vh] md:h-[60vh] bg-muted"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
    </div>
  )
}

// gallery block
export function GalleryBlock({
  value,
  urlFor,
}: {
  value: any
  urlFor: (img: any) => { url: () => string }
}) {
  const images: any[] = (value.images || []).slice(0, 4)
  const gridClass =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
      ? "grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

  return (
    <div className={`grid gap-4 md:gap-8 mb-20 md:mb-28 ${gridClass}`}>
      {images.map((img: any, idx: number) => (
        <ClickableImage
          key={idx}
          src={urlFor(img).url()}
          alt={`Gallery image ${idx + 1}`}
          className="w-full h-[30vh] md:h-[40vh] bg-muted"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      ))}
    </div>
  )
}
