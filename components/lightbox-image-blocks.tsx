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
  imgClassName,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
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
        className={imgClassName || "w-full h-auto block"}
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
    <div className="w-full mb-20 md:mb-28 relative flex flex-col items-center">
      <ClickableImage
        src={src}
        alt={value.caption || "Full Image"}
        className="w-full flex justify-center"
        imgClassName="max-h-[70vh] md:max-h-[85vh] w-auto object-contain block"
      />
      {value.caption && (
        <p className="mt-4 md:mt-6 font-sans font-light text-[12px] md:text-[13px] text-muted-foreground tracking-[0.15em] uppercase text-center">
          {value.caption}
        </p>
      )}
    </div>
  )
}

// fullVideo block
export function FullVideoBlock({
  value,
}: {
  value: any
}) {
  const src = value.videoUrl
  if (!src) return null
  
  return (
    <div className="w-full mb-20 md:mb-28 relative">
      <video
        src={src}
        className="w-full h-auto block"
        autoPlay
        loop
        muted
        playsInline
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
  const imgSrc = value.rightImage ? urlFor(value.rightImage).url() : null
  const videoSrc = value.rightVideoUrl || null
  const hasMedia = imgSrc || videoSrc
  
  // User Requested: "sol görsel sağ text" (Left image, right text)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-20 md:mb-28 items-center">
      {hasMedia && (
        videoSrc ? (
          <video
            src={videoSrc}
            className="w-full h-auto block order-1"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <ClickableImage
            src={imgSrc!}
            alt="Column media"
            className="order-1"
          />
        )
      )}
      <div className="order-2 font-sans font-light text-[16px] md:text-[20px] leading-[1.6] text-foreground/80 whitespace-pre-line prose-p:mb-4">
        <PortableTextComp value={value.leftContent} />
      </div>
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
  // Standard CSS Grid keeps logic pure and handles natural ratios well.
  const cols = images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  
  return (
    <div className={`grid gap-4 md:gap-8 mb-20 md:mb-28 items-center ${cols}`}>
      {images.map((img: any, idx: number) => (
        <ClickableImage
          key={idx}
          src={urlFor(img).url()}
          alt={`Gallery image ${idx + 1}`}
          className="w-full flex justify-center"
          imgClassName="max-h-[70vh] md:max-h-[85vh] w-auto object-contain block"
        />
      ))}
    </div>
  )
}

