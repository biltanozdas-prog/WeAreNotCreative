# WANC Journal — Mevcut Durum Raporu

Tarih: 2026-04-30
Branch: `claude/reverent-margulis` (latest pushed commit: `2168b60`)
Yöntem: Salt-okunur kod analizi. Hiçbir değişiklik yapılmadı.

---

## 1. DOSYA HARİTASI

Blog sistemine ait dosyalar:

| Path | Satır | Tür | Açıklama |
|---|---|---|---|
| `app/blog/page.tsx` | 70 | Server Component (async default export) | Sanity'den `journalPage` singleton + `blogPost` listesini çekip `BlogClient`'a aktarır. |
| `app/blog/blog-client.tsx` | 394 | Client Component (`"use client"`) | Üç bileşeni içerir: `BlogClient` (liste), `BlogEntry` (kart), `ReaderPanel` (sağdan açılan modal). |
| `app/blog/layout.tsx` | 8 | Server Component | Sadece `<Metadata>` export'u + `children`'ı geçirir. Hiçbir layout wrapper'ı yok. |
| `app/blog/[slug]/page.tsx` | — | **YOK** | Standalone yazı detay sayfası mevcut değil. |
| `sanity/schemaTypes/blogPost.ts` | 66 | Sanity schema | Document type: `blogPost`. |
| `sanity/schemaTypes/journalPage.ts` | 33 | Sanity schema | Singleton: `journalPage` (sayfa header'ı: eyebrow, headline, intro). |
| `sanity/schemaTypes/blocks.ts` | 171 | Sanity schemas | Ortak block tipleri (project ile paylaşılıyor). |
| `sanity/schema.ts` | 45 | Schema registry | Yukarıdakileri Studio'ya bağlar. |
| `sanity.config.ts` | 235 | Studio config | Singleton yönetimi + preview URL resolver + structure tool. |
| `lib/sanity/get-client.ts` | 23 | Server util | preview-aware Sanity client factory. |
| `lib/sanity/client.ts` | (mevcut, içeriği okumadım — bu raporda kullanılmıyor) | Server util | Düz Sanity client. |
| `lib/sanity/portableText.tsx` | 82 | Client util | Eski paylaşılan PortableText `components` — **artık blog tarafından kullanılmıyor** (son revizyonda import kaldırıldı). |
| `lib/sanity/image.ts` | 11 | Util | `urlFor()` factory. |
| `lib/sanity/queries.ts` | — | **YOK** | Merkezi query dosyası yok. Tüm GROQ inline. |
| `components/lightbox-image-blocks.tsx` | 244 | Client Component | Sadece project detay sayfası kullanıyor — **blog kullanmıyor**. |

---

## 2. VERİ AKIŞI

### Çalışan GROQ query'leri (`app/blog/page.tsx`)

**A) Sayfa header'ı (singleton):**
```groq
*[_type == "journalPage"][0]{ eyebrowLabel, headline, intro }
```

**B) Yazı listesi (yayınlanmış):**
```groq
*[_type == "blogPost" && published == true] | order(order asc) {
  _id,
  "slug": coalesce(slug.current, slug),
  title,
  date,
  excerpt,
  "coverImage": coverImage.asset->url,
  "image": coverImage.asset->url,
  blocks[] {
    ...,
    _type == "fullImage" => { "imageUrl": image.asset->url },
    _type == "fullVideo" => { "videoUrl": video.asset->url },
    _type == "twoColumn" => {
      leftType, rightType, leftContent, rightContent,
      "leftImageUrl":  leftImage.asset->url,
      "leftVideoUrl":  leftVideo.asset->url,
      "rightImageUrl": rightImage.asset->url,
      "rightVideoUrl": rightVideo.asset->url
    },
    _type == "gallery"      => { "imageUrls": images[].asset->url },
    _type == "heroOverride" => { title, "imageUrl": image.asset->url }
  },
  order
}
```

Preview modu aktifse `published == true` filtresi kaldırılır.

### `blogPost` schema alanları

```
title       — string
slug        — slug { source: 'title', maxLength: 96 }
date        — string                  (DATE TYPE DEĞIL — tipsiz string!)
coverImage  — image
excerpt     — text
published   — boolean (default: false)
order       — number
blocks      — array of [heroOverride, fullImage, fullVideo, textBlock,
                       twoColumn, gallery, quote, spacer]
```

### Aranan ama bulunamayan alanlar

| Alan | Var mı? |
|---|---|
| `type` | **YOK** |
| `category` | **YOK** |
| `tags` | **YOK** |
| `layout` | **YOK** |
| `featured` | **YOK** |
| `author` | **YOK** |
| `readingTime` | **YOK** |
| `seo` / `metadata` | **YOK** |

### `blocks[]` array'inde tanımlı block tipleri (`blocks.ts` ve `blogPost.ts`'den)

| Block | Alanlar |
|---|---|
| `heroOverride` | title, image |
| `fullImage` | image, caption |
| `fullVideo` | video (file), caption |
| `textBlock` | heading, body (PortableText) |
| `twoColumn` | leftType/rightType ('text'\|'image'\|'video'), leftContent/rightContent (PortableText), leftImage/rightImage, leftVideo/rightVideo |
| `gallery` | images[] |
| `quote` | quoteText, author |
| `spacer` | size ('small'\|'medium'\|'large') |

### ISR & fetch davranışı

- `export const revalidate = 30` (sayfa düzeyinde).
- Her iki `client.fetch()` çağrısı **`Promise.all` içinde paralel**.
- Her ikisinin de **`.catch()` handler'ı** var (boş array / null fallback).
- Bireysel fetch'lerde de `{ next: { revalidate: 30 } }` belirtilmiş — sayfa-düzeyi `revalidate=30` ile tutarlı.

---

## 3. MEVCUT UI YAPISI

### Liste Sayfası (`page.tsx` + `blog-client.tsx`)

**Genel yapı:**
- `<main>`: `bg-background min-h-screen px-8 pt-[160px] pb-32 md:px-[60px] md:pt-[200px] md:pb-[180px]`
- Üstte page header: `eyebrowLabel` (12-13px uppercase) + dev `headline` (`text-[clamp(72px,14vw,200px)]`, font-black) + `intro` (`text-[16px]/[18px]`, max-w-[520px]).
- Liste: `flex flex-col gap-16 md:gap-24`. Her kart altında alt sınır yok hariç son kart (`border-b border-secondary`).

**Yazı kartı (`BlogEntry`):**
- Buton (`<button>`) — link değil. Click → `onOpen(post)`.
- Asimetrik düzen:
  - `isWide = index % 3 === 0` → 420×320 görsel
  - `isOffset = index % 2 !== 0` → `md:ml-auto md:max-w-[75%]` (sağa kaymış, daraltılmış)
  - değilse: `md:max-w-[85%]` (sola yaslı)
- **Layout:** `flex flex-col md:flex-row gap-6 md:gap-10 items-start`
- Sol = görsel (sabit boyut, `Image fill object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02]`)
- Sağ = içerik:
  - Tarih: `text-[11px]/[12px] tracking-[0.2em] muted-foreground uppercase`
  - Başlık (h2): `font-black text-[20px] md:text-[40px] leading-[0.88] uppercase tracking-[-0.03em] break-words hyphens-auto`, hover `opacity-70`
  - Excerpt: `font-light text-[14px]/[16px] text-foreground/60 max-w-[400px]`
  - "Read" rozeti: alt çizgili 12px uppercase
- **Gösterilenler:** kapak görseli, tarih, başlık, excerpt, "Read" CTA.
- **Gösterilmeyenler:** yazar, kategori, etiketler, okuma süresi (zaten schema'da yok).

**ReaderPanel:**
- Açılış: `setActivePost(post)`. Kapanış: backdrop click veya `[ Close ]` butonu.
- **URL DEĞIŞMIYOR** — `router.push` veya `history.pushState` yok. Tarayıcı geri tuşu paneli kapatmaz; deep-link yapılamaz.
- Genişlik: `w-full md:w-[55vw]` (viewport breakpoint).
- Animasyon: `transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)]` + `translate-x-full` ↔ `translate-x-0`.
- Backdrop: `bg-[#000000]/50 z-[99998]`, opacity transition.
- Panel: `z-[99999]`, sağda `border-l-2 border-foreground`, `overflow-y-auto`.
- Body scroll lock: `useEffect`'te `document.body.style.overflow = "hidden"`.
- İçerik wrapper: `px-8 py-12 md:px-12 md:py-16 @container` (CSS container query context).
- Sağ üstte close yok — close button içerik üstünde (`mb-12`).

**Hover etkisi (liste):**
- Görsel: `grayscale → grayscale-0`, `scale-[1.02]`. Süre: `duration-500`.
- Başlık: `opacity-70`.

**Filtre / sıralama:** **YOK**. Sıralama `order asc` (Sanity).

**Mobil davranış:**
- Liste: `flex-col` (mobil) → `flex-row` (md+) için kart içi. Genişlikler de görsel için `w-full` (mobil) → sabit px (md+).
- Panel: `w-full` (mobil = full-screen) → `md:w-[55vw]` (md+).
- Padding: `px-8/pt-[160px]` (mobil) → `md:px-[60px]/md:pt-[200px]`.

### Yazı İçi Deneyim (panel içi)

- **Standalone sayfa yok.** Her yazı sadece panel içinde açılır. `app/blog/[slug]/page.tsx` mevcut değil — SEO için her yazının kendi URL'i yok.
- **URL güncellenmiyor** (router.push / shallow routing yok).
- Başlık: `<h1>` `font-sans font-black text-[36px] md:text-[56px] leading-[0.88] uppercase tracking-[-0.03em]`, `mb-10 md:mb-14`.
- Üst eyebrow: tarih (12px uppercase muted).
- Cover image (panel içi): `w-full h-[30vh] md:h-[45vh] bg-muted overflow-hidden`, `Image fill object-cover` — **bilerek crop ediliyor.**
- Block renderer: `blog-client.tsx` line 215-393'te inline `switch`. Desteklediği block tipleri:
  - `heroOverride` → plain `<img>` maxHeight 85vh + opsiyonel başlık altta
  - `fullImage` → plain `<img>` maxHeight 85vh contain
  - `fullVideo` → `<video autoPlay muted loop playsInline>`
  - `textBlock` → h2 heading (20-28px black) + PortableText body
  - `twoColumn` → `renderSlot()` helper (text/image/video on either side), container query `@[600px]:grid-cols-2`
  - `gallery` → 1: `grid-cols-1 max-w-lg mx-auto` / 2: `grid-cols-2` / 3+: `grid-cols-2 md:grid-cols-3`
  - `quote` → border-l + büyük blockquote (`clamp(20px,4vw,36px)`)
  - `spacer` → boş div yüksek
  - `default` → null
- PortableText `components`: dosya içi `portableTextComponents` const (block: normal/h2/h3, marks: strong/em/underline/strike-through). textBlock body, twoColumn text slot ve fallback path'inde kullanılıyor.
- **"Sonraki yazı" navigasyonu YOK.** Yazı sonunda sadece `End of article` rozeti var.
- **Okuma süresi YOK** — hesaplanmıyor.
- **Yazar gösterilmiyor** — schema'da zaten yok.

---

## 4. TASARIM SİSTEMİ — BLOG'A ÖZGÜ

### Blog'a özgü class kümeleri

**Sayfa header'ı:**
- `text-[clamp(72px,14vw,200px)]` — sadece blog `headline`'ında bu kadar büyük clamp.
- `tracking-[0.25em]` eyebrow (site genelinde var, blog'a özgü değil).

**Liste kartı:**
- `isWide = index % 3 === 0` ve `isOffset = index % 2 !== 0` — bu **asimetrik kart algoritması** blog'a özgü, projeler listesinde yok.
- `grayscale → group-hover:grayscale-0` — bu hover stratejisi sadece blog kapak görseli için.
- `text-foreground/60` excerpt opacity — blog'a özgü.

**Reader Panel:**
- `w-[55vw]` panel genişliği — site genelinde başka panel yok.
- `z-[99998]` / `z-[99999]` — uygulamadaki en yüksek z-index'ler.
- `@container` + `@[600px]:` — site genelinde başka container query kullanımı yok (yeni eklendi).
- `ease-[cubic-bezier(0.85,0,0.15,1)]` — sadece panel için.
- `max-w-[65ch]` — sadece blog `twoColumn` text slot'unda. Site genelinde ch tabanlı ölçü kullanılmıyor.

### `mix-blend-mode`

- Blog kodunda **mix-blend-mode kullanılmıyor** (`mix-blend-difference` ne `BlogClient`'ta ne `BlogEntry`'de ne `ReaderPanel`'de var).
- Site genelinde header ve projeler listesi `mix-blend-difference` kullanıyor — blog uyumlu değil.

### `object-cover` vs `object-contain`

- `object-cover`: BlogEntry kart görseli, Panel cover image. **Cropping bilerek tutulan iki yer.**
- `object-contain` (inline style olarak `objectFit: 'contain'`): tüm panel-içi bloklar (`fullImage`, `gallery`, `twoColumn` image slot, `heroOverride` image).

### Animasyon / transition

- Sadece CSS transition'ları kullanılıyor — **framer-motion yok**.
- `transition-all duration-500` — BlogEntry görsel hover.
- `transition-opacity` — başlık hover.
- `transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)]` — panel slide.
- `transition-opacity duration-500` — backdrop.
- `transition-colors` — close button.

### Font weight'ler

| Weight | Kullanım |
|---|---|
| `font-light` (300) | Eyebrow, intro, tarih, excerpt, paragraph body, close button. |
| `font-medium` (500) | "Read" CTA, BlogEntry'deki text spans. |
| `font-bold` (700) | h3, strong mark, gallery captions (yok aslında). |
| `font-black` (900) | h1 (yazı başlığı), h2 (textBlock heading), h2 (yazı kartı), blockquote, heroOverride title. |

---

## 5. KIRIK / EKSİK / SORUNLU

### Açık TODO / FIXME / NOTE yorumları

- `blog-client.tsx:216` → `// NOTE: Sanity blocks use _type, not _template` — geçmiş bir bug'a referans, çözülmüş, kod yorumu kalmış.
- Başka TODO/FIXME yok.

### Tip güvenliği

- `BlogClient`, `BlogEntry`, `ReaderPanel` proplarında `post: any`, `blogPosts: any[]`, `pageData?: any` — **schema'dan üretilmiş tip yok**.
- PortableText `components` içindeki tüm callback'ler `({ children }: any)`.
- Block renderer'da her case `block: any` üzerinden çalışıyor (`block.imageUrl`, `block.leftType`, vs.).
- GROQ projeksiyonları runtime'da string URL döndürüyor ama type-level garanti yok.

### Hardcoded değerler

- `bg-[#000000]/50` (backdrop) — `var(--foreground)` yerine ham hex.
- `wanc-preview-9384jsdfkjsdf` fallback secret — `sanity.config.ts:13`. ENV var yoksa public token olarak gömülü.
- `https://www.wearenotcreativestudio.com` fallback origin — `sanity.config.ts:14`.
- `z-[99998]` / `z-[99999]` — sayı magic.
- `pt-[160px]` / `md:pt-[200px]` — header altı offset, sabit.
- `w-[55vw]`, `h-[45vh]`, `maxHeight: '85vh'`, `maxHeight: '70vh'` — vh/vw değerleri tasarım sistemiyle değil ad-hoc kararlarla.
- `revalidate = 30` — hem sayfa, hem fetch düzeyinde tekrar tekrar yazılı.
- `slice(0, 4)` — gallery max 4 görselle sınırlandırılmış, sebebi belgelenmemiş.

### `force-dynamic` / gereksiz `use client`

- `force-dynamic` **YOK**.
- `app/blog/blog-client.tsx` `"use client"` — gerekli (useState, useEffect, click handler).
- `app/blog/page.tsx` server component — doğru.
- `app/blog/layout.tsx` server component, ama içinde sadece metadata + children passthrough var; **layout şu an iş yapmıyor**, silinebilir veya `app/blog/page.tsx`'in metadata'sı zaten var olsaydı bu dosya gereksiz olurdu.

### Performans riskleri

- **Tek query, tüm yazıların tüm block'larıyla**: blog listesi yüklenirken her `blogPost`'un tüm `blocks[]` projeksiyonu (text content + image URL'leri) çekiliyor. Sayfada panel açılana kadar gerek olmayan veri. Yazı sayısı 50-100'e çıkarsa GROQ payload şişer.
- **`Image fill` + sabit `h-[Xvh]` cover**: cover image her zaman 30-45vh container içinde object-cover. Mobilde 30vh, masaüstünde 45vh — büyük cihazda 4K kapak görseli optimize edilmiyor mu kontrol için `next/image` sizes prop'u `(max-width: 768px) 100vw, 55vw` — mantıklı.
- **Plain `<img>` etiketleri**: bloklarda `next/image` kullanılmıyor (lightbox ihtiyacı + cropping kaçınma için). Bu yüzden block görselleri optimize edilmiyor; full-resolution Sanity CDN URL'i geliyor. Sanity'de query-time width/quality parametreleri yok (`?w=`, `?q=`).
- **Slug coalesce her sorguda**: `coalesce(slug.current, slug)` her seferinde — eski string slug'a göre fallback. Migration tamamsa kaldırılabilir.

### Diğer

- **SEO**: tek tek yazıların kendi URL'i yok → arama motoru indeksleyemez, paylaşılabilir link yok.
- **Erişilebilirlik**: panel açıkken focus trap yok, ESC ile kapanma yok (sadece backdrop click + button).
- **`button` element semantiği**: BlogEntry button — doğru (interactive open), ama bir yazı bilgisinin "buton" olması link semantiğini kaybediyor.
- **Tarih formatı yok**: `date` schema'da `string`, render'da `{post.date}` ham gösteriliyor. CMS'te ne yazılırsa o.
- **Eski `components` import'u kaldırıldı** ama `lib/sanity/portableText.tsx` dosyası hâlâ duruyor — sadece bu dosyaya hiç kimse dokunmuyor olabilir (dead code).

---

## 6. SANITY STUDIO — JOURNAL TARAFI

`sanity.config.ts` structure tool yapısı:

```
Content
├── SITE
│   ├── Homepage (singleton)
│   ├── About Page (singleton)
│   ├── Services Page (singleton)
│   ├── Site Settings (singleton)
│   ├── Journal Page (singleton)    ← journalPage doc
│   └── Projects Page (singleton)
├── ─────────────
├── DISCIPLINES
├── ─────────────
└── CONTENT
    ├── Projects (collection, ordered by 'order' asc)
    └── Blog (collection)            ← blogPost docs
```

- **`journalPage`** singleton (`SINGLETONS` listesinde) — sayfanın başlık/intro alanları için. Editor delete/duplicate edemiyor.
- **`blogPost`** collection — "Content → Blog" altında. Sıralama **schema'da `order` field var ama Studio listesinde defaultOrdering yok** (yani `Projects` listesinde `defaultOrdering([{ field: 'order', direction: 'asc' }])` var ama Blog listesinde yok). Editor manuel sıralayamıyor görsel olarak.
- Tüm `PREVIEWABLE` document'lara (`blogPost` dahil) Preview view eklenmiş — `PreviewPane` component'i içeride.
- Preview URL resolver `blogPost` için `/blog/<slug>` döndürüyor — **ama site tarafında `/blog/[slug]` route yok**. Preview butonu broken link açar.

### Singleton / Collection özeti

| Doc | Tip |
|---|---|
| `journalPage` | Singleton |
| `blogPost` | Collection |

### Custom input / validation

- `blogPost.ts`'te **hiçbir alan zorunlu (`validation`) değil**. `title`, `slug`, `date`, `coverImage`, `published`, `order`, `blocks` — hepsi opsiyonel.
- Custom input component yok.
- `published` default `false` — yeni oluşturulan post varsayılan olarak gizli.
- `slug` `source: 'title'` ile otomatik üretiliyor.

---

## 7. ÖNEMLİ BAĞIMLILIKLAR

### Blog kodunun bağımlı olduğu modüller

| Modül | Nereden | Kullanım |
|---|---|---|
| `next/image` | dış | `BlogClient` + `BlogEntry` + Panel cover. |
| `@portabletext/react` | dış | textBlock, twoColumn, fallback. |
| `next/headers` `draftMode` | dış | page.tsx preview switch. |
| `next-sanity` `groq` | dış | query template literal. |
| `@/lib/sanity/get-client` | iç | preview-aware client. |
| `@/lib/sanity/portableText` | iç | **Artık import edilmiyor** (son revizyon kaldırdı). Dead reference olabilir. |

### Bu modüller başka sayfalarda kullanılıyor mu?

- `lib/sanity/get-client.ts` → projects, projects/[slug], homepage, about, services, projectsPage gibi tüm Sanity-bağımlı sayfalar tarafından kullanılıyor. **Değiştirmek = her şeyi etkiler.**
- `lib/sanity/image.ts` (`urlFor`) → projeler tarafında yaygın kullanılıyor. Blog'da artık doğrudan kullanılmıyor (URL'ler GROQ'tan string olarak geliyor). **Risksiz.**
- `lib/sanity/portableText.tsx` `components` export → blog import etmiyor artık. **Eski:** Project tarafı da kullanmıyor (`components/project-blocks-client.tsx` kendi inline `textComponents` tanımlıyor). Bu dosya muhtemelen ölü kod. Silinebilir.

### Project ↔ Blog paylaşımı

- **Sanity blocks ortak** (`blocks.ts`): heroOverride, fullImage, fullVideo, textBlock, twoColumn, gallery, quote, spacer — her ikisi de aynı tipleri kullanıyor.
- **Renderer paylaşımı yok**:
  - Project tarafı: `components/lightbox-image-blocks.tsx` (FullImageBlock, FullVideoBlock, TwoColumnBlock, GalleryBlock) + `components/project-blocks-client.tsx` (`ProjectBlocks` switch).
  - Blog tarafı: `app/blog/blog-client.tsx` içinde inline switch (yukarıda detaylı).
  - **İki ayrı renderer var.** Aynı block tipi farklı yerlerde farklı kurallarla render ediliyor (özellikle `twoColumn`, `gallery`, `quote`, `spacer` boyutlandırması farklı).
- **Lightbox provider** sadece project tarafında kullanılıyor (`components/lightbox-provider.tsx` + `components/lightbox-overlay.tsx`). Blog'da lightbox yok.
- **PortableText components**:
  - Blog: `blog-client.tsx` module-level `portableTextComponents` const (block + marks).
  - Project: `project-blocks-client.tsx`'in kendi `textComponents` const'u (types + marks). Bunlar **birbirinden bağımsız** — biri güncellense diğeri etkilenmez.
- **GROQ projeksiyonu paylaşımı yok**:
  - Project tarafı: tam asset ref + `metadata { dimensions }` projeksiyonu yapıyor (`fullImage` portrait/landscape detection için).
  - Blog tarafı: sadece flattened URL string. Portrait detection mümkün değil.

### Değiştirirsek ne etkilenir tablosu

| Değişiklik | Etki alanı |
|---|---|
| `blog-client.tsx` değişiklikleri | Sadece `/blog` rotası. |
| `blogPost` schema değişiklikleri | Studio + page.tsx GROQ + render. Eklenirse migration düşünülmeli (mevcut yayınlanmış post'lar). |
| `journalPage` schema değişiklikleri | Sadece sayfa header'ı. |
| `blocks.ts` değişiklikleri | **Hem project hem blog etkilenir** — özenli olmak gerek. |
| `get-client.ts` | Tüm site. |
| `sanity.config.ts` structure | Studio UX. |
| `lib/sanity/portableText.tsx` | Şu an kimse import etmiyor; silinebilir, kontrol gerek. |

---

## EK NOTLAR

**Önemli mimari karakteristikler (özet):**
- `/blog/[slug]` route'u **yok** — yazı detayı yalnız `ReaderPanel` içinde, URL paylaşılamaz, SEO indekslemesi yapılamaz.
- `date` schema'da **string** — date type değil, format/sort/timezone garantisi yok.
- Blog ve Project block renderer'ları **paralel evrilmiş**, ortak abstraction yok. Aynı CMS yapısı iki ayrı UI'da iki ayrı görselle render ediliyor.
- Studio'da Blog listesi için `defaultOrdering` yok — editör manuel sıralama göremiyor.
- Studio preview URL'i `blogPost` için `/blog/<slug>` döndürüyor — site'de o route yok, broken preview.
- `dist/` ve `node_modules/` build çıktıları repo dışı; bu raporda inceleme yapılmadı.

Rapor sonu.
