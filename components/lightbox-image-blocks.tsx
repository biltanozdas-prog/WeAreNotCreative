"use client"

import React from "react"
import { useLightbox } from "@/components/lightbox-provider"

function ClickableImage({
  src,
  alt,
  className,
  imgClassName,
  style,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  style?: React.CSSProperties
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
        style={style}
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

  // Detect orientation from Sanity metadata if available
  const dims = value.image?.asset?.metadata?.dimensions
  let sizeClass = "max-w-lg mx-auto" // default
  if (dims) {
    if (dims.height > dims.width) {
      // portrait
      sizeClass = "max-w-xs md:max-w-sm mx-auto"
    } else {
      // landscape
      sizeClass = "max-w-xl md:max-w-2xl mx-auto"
    }
  }

  return (
    <div className="px-8 md:px-20 my-6 md:my-12">
      <div className={sizeClass}>
        <ClickableImage
          src={src}
          alt={value.caption || "Full Image"}
          className="w-full"
          imgClassName="w-full h-auto block"
        />
        {value.caption && (
          <p className="mt-3 md:mt-4 font-sans font-light text-[12px] md:text-[13px] text-muted-foreground tracking-[0.15em] uppercase">
            {value.caption}
          </p>
        )}
      </div>
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
    <div className="px-8 md:px-20 my-6 md:my-12">
      <div className="max-w-xl md:max-w-2xl mx-auto">
        <video
          src={src}
          className="w-full h-auto block"
          autoPlay
          loop
          muted
          playsInline
        />
        {value.caption && (
          <p className="mt-3 md:mt-4 font-sans font-light text-[12px] md:text-[13px] text-muted-foreground tracking-[0.15em] uppercase">
            {value.caption}
          </p>
        )}
      </div>
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
    <div className="px-8 md:px-20 my-6 md:my-12">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
        <div className="w-full md:w-1/2">
          <ColumnSlot
            type={value.leftType || (value.leftContent ? 'text' : value.leftImage ? 'image' : 'text')}
            text={value.leftContent}
            imageSrc={value.leftImageUrl || (value.leftImage?.asset?._ref ? urlFor(value.leftImage).url() : null)}
            videoSrc={value.leftVideoUrl || null}
            PortableTextComp={PortableTextComp}
          />
        </div>
        <div className="w-full md:w-1/2">
          <ColumnSlot
            type={value.rightType || (value.rightImage || value.rightImageUrl ? 'image' : value.rightVideoUrl ? 'video' : value.rightContent ? 'text' : 'image')}
            text={value.rightContent}
            imageSrc={value.rightImageUrl || (value.rightImage?.asset?._ref ? urlFor(value.rightImage).url() : null)}
            videoSrc={value.rightVideoUrl || null}
            PortableTextComp={PortableTextComp}
          />
        </div>
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
  PortableTextComp: any
}) {
  if (type === 'video' && videoSrc) {
    return (
      <video
        src={videoSrc}
        className="w-full block"
        style={{ maxHeight: "500px", objectFit: "contain" }}
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
        className="w-full overflow-hidden"
        imgClassName="w-full block"
        style={{ maxHeight: "500px", objectFit: "contain" }}
      />
    )
  }

  // text (default)
  return (
    <div className="font-sans font-light leading-[1.7] text-foreground">
      <PortableTextComp
        value={text}
        components={{
          block: {
            normal: ({ children }: any) => (
              <p className="text-[15px] md:text-[17px] mb-5 last:mb-0">{children}</p>
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
  const images: any[] = (value.images || []).filter((img: any) => img?.asset?._ref)

  const gridClass = images.length === 1
    ? 'grid-cols-1 max-w-lg mx-auto'
    : images.length === 2
    ? 'grid-cols-2'
    : 'grid-cols-2 md:grid-cols-3'

  return (
    <div className={`px-8 md:px-20 my-6 md:my-12 grid gap-3 md:gap-4 items-start ${gridClass}`}>
      {images.map((img: any, idx: number) => (
        <div key={idx} className="overflow-hidden">
          <ClickableImage
            src={urlFor(img).url()}
            alt={`Gallery image ${idx + 1}`}
            imgClassName="w-full block"
            style={{ maxHeight: "340px", objectFit: "contain" }}
          />
        </div>
      ))}
    </div>
  )
}
