"use client"

import { useLightbox } from "@/components/lightbox-provider"

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
        className={imgClassName}
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

  const dims = value.image?.asset?.metadata?.dimensions
  const isPortrait = dims ? dims.height > dims.width : false

  return (
    <div className="px-6 md:px-16 my-8 md:my-14">
      {isPortrait ? (
        <div className="flex justify-center">
          <ClickableImage
            src={src}
            alt={value.caption || "Full Image"}
            imgClassName="block w-auto mx-auto max-h-[85vh] object-contain"
          />
        </div>
      ) : (
        <ClickableImage
          src={src}
          alt={value.caption || "Full Image"}
          className="w-full"
          imgClassName="w-full h-auto block"
        />
      )}
      {value.caption && (
        <p className="mt-3 font-sans font-light text-[12px] md:text-[13px] text-muted-foreground tracking-[0.15em] uppercase">
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
    <div className="px-6 md:px-16 my-8 md:my-14">
      <div className="flex justify-center">
        <video
          src={src}
          className="block w-auto mx-auto max-h-[85vh]"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      {value.caption && (
        <p className="mt-3 font-sans font-light text-[12px] md:text-[13px] text-muted-foreground tracking-[0.15em] uppercase">
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
    <div className="px-6 md:px-16 my-8 md:my-14">
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

const markComponents = {
  strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
  em: ({ children }: any) => <em className="italic">{children}</em>,
  underline: ({ children }: any) => <span className="underline underline-offset-2">{children}</span>,
  'strike-through': ({ children }: any) => <span className="line-through">{children}</span>,
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
        className="w-full"
        imgClassName="w-full h-auto block"
      />
    )
  }

  // text (default)
  return (
    <div className="font-sans font-light leading-[1.7] text-foreground max-w-2xl">
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
          marks: markComponents,
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

  const gridClass = images.length <= 1
    ? 'grid-cols-1'
    : images.length === 2
    ? 'grid-cols-2'
    : 'grid-cols-2 md:grid-cols-3'

  return (
    <div className={`px-6 md:px-16 my-8 md:my-14 grid gap-3 md:gap-5 items-start ${gridClass}`}>
      {images.map((img: any, idx: number) => (
        <ClickableImage
          key={idx}
          src={urlFor(img).url()}
          alt={`Gallery image ${idx + 1}`}
          className="w-full"
          imgClassName="w-full h-auto block"
        />
      ))}
    </div>
  )
}
