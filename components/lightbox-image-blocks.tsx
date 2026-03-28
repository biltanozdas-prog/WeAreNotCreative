"use client"

import Image from "next/image"
import { useLightbox } from "@/components/lightbox-provider"

// Shared clickable image wrapper without harsh background fills.
// We use a regular img tag internally, or Next image with responsive unoptimized 
// approach to ensure aspect ratios aren't mangled by `fill` and `object-cover`.
function ClickableImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        loading="lazy"
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
    <div className="w-full mb-20 md:mb-28 relative">
      <ClickableImage
        src={src}
        alt={value.caption || "Full Image"}
        className="w-full h-auto max-h-[90vh]"
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
  
  // User Requested: "sol görsel sağ text" (Left image, right text)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-20 md:mb-28 items-center">
      <div className="order-2 md:order-2 font-sans font-light text-[16px] md:text-[20px] leading-[1.6] text-foreground/80 whitespace-pre-line prose-p:mb-4">
        <PortableTextComp value={value.leftContent} />
      </div>
      {src && (
        <ClickableImage
          src={src}
          alt="Column media"
          className="order-1 md:order-1 w-full h-auto max-h-[80vh]"
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
  const images: any[] = (value.images || [])
  
  // User requested a better method than strict cropping at same heights.
  // Using a flex layout where images maintain organic height but scale width.
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-20 md:mb-28 justify-center items-center">
      {images.map((img: any, idx: number) => (
        <ClickableImage
          key={idx}
          src={urlFor(img).url()}
          alt={`Gallery image ${idx + 1}`}
          className="w-full h-auto md:w-1/2 md:max-h-[75vh]"
        />
      ))}
    </div>
  )
}

