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
  if (!value.image?.asset?._ref) return null
  const src = urlFor(value.image).url()
  return (
    <div className="w-full mb-20 md:mb-28">
      <ClickableImage
        src={src}
        alt={value.caption || "Full Image"}
        className="w-full"
        imgClassName="max-h-[60vh] md:max-h-[85vh] w-full h-auto object-contain block"
      />
      {value.caption && (
        <p className="mt-4 md:mt-6 px-6 md:px-12 font-sans font-light text-[12px] md:text-[13px] text-muted-foreground tracking-[0.15em] uppercase">
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

// twoColumn block — both columns support text, image, or video
export function TwoColumnBlock({
  value,
  urlFor,
  PortableTextComp,
}: {
  value: any
  urlFor: (img: any) => { url: () => string }
  PortableTextComp: any
}) {
  return (
    <div className="flex flex-col md:flex-row w-full mb-20 md:mb-28">
      <div className="w-full md:w-1/2">
        <ColumnSlot
          type={value.leftType || (value.leftContent ? 'text' : value.leftImage ? 'image' : 'text')}
          text={value.leftContent}
          imageSrc={value.leftImageUrl || (value.leftImage?.asset?._ref ? urlFor(value.leftImage).url() : null)}
          videoSrc={value.leftVideoUrl || null}
          urlFor={urlFor}
          PortableTextComp={PortableTextComp}
        />
      </div>
      <div className="w-full md:w-1/2">
        <ColumnSlot
          type={value.rightType || (value.rightImage || value.rightImageUrl ? 'image' : value.rightVideoUrl ? 'video' : value.rightContent ? 'text' : 'image')}
          text={value.rightContent}
          imageSrc={value.rightImageUrl || (value.rightImage?.asset?._ref ? urlFor(value.rightImage).url() : null)}
          videoSrc={value.rightVideoUrl || null}
          urlFor={urlFor}
          PortableTextComp={PortableTextComp}
        />
      </div>
    </div>
  )
}

function ColumnSlot({
  type,
  text,
  imageSrc,
  videoSrc,
  PortableTextComp,
}: {
  type: 'text' | 'image' | 'video'
  text?: any
  imageSrc?: string | null
  videoSrc?: string | null
  urlFor: (img: any) => { url: () => string }
  PortableTextComp: any
}) {
  if (type === 'video' && videoSrc) {
    return (
      <video
        src={videoSrc}
        className="w-full h-auto block"
        autoPlay
        loop
        muted
        playsInline
      />
    )
  }

  if (type === 'image' && imageSrc) {
    return (
      <ClickableImage
        src={imageSrc}
        alt="Column media"
      />
    )
  }

  // text (default) — also falls back here if declared type has no content
  return (
    <div className="font-sans font-light leading-[1.7] text-foreground px-6 md:px-12 lg:px-20 my-12 md:my-20">
      <PortableTextComp
        value={text}
        components={{
          block: {
            normal: ({ children }: any) => (
              <p className="text-[16px] md:text-[18px] mb-5 last:mb-0">{children}</p>
            ),
            h2: ({ children }: any) => (
              <h2 className="font-black text-[clamp(20px,3vw,32px)] uppercase tracking-[-0.02em] leading-[0.9] mb-6">{children}</h2>
            ),
            h3: ({ children }: any) => (
              <h3 className="font-black text-[clamp(16px,2vw,24px)] uppercase tracking-[-0.01em] mb-5">{children}</h3>
            ),
          },
        }}
      />
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
  const cols = images.length === 1
    ? 'grid-cols-1'
    : images.length === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={`grid gap-4 md:gap-8 mb-20 md:mb-28 w-full ${cols}`}>
      {images.filter((img: any) => img?.asset?._ref).map((img: any, idx: number) => (
        <ClickableImage
          key={idx}
          src={urlFor(img).url()}
          alt={`Gallery image ${idx + 1}`}
          className="w-full"
          imgClassName="max-h-[60vh] md:max-h-[85vh] w-full h-auto object-contain block"
        />
      ))}
    </div>
  )
}

