# WEARENOTCREATIVE — Claude Code Handoff

Bu dosya Claude Code tarafından her oturumda otomatik okunur.

---

## Proje Özeti

**WEARENOTCREATIVE** (WANC) — İstanbul merkezli multidisipliner kreatif stüdyonun portföy sitesi.  
Stack: **Next.js 16 (App Router) + React 19 + Sanity CMS v5 + Tailwind CSS v4 + Vercel**  
Repo: `https://github.com/biltanozdas-prog/WeAreNotCreative`  
Canlı: `https://www.wearenotcreativestudio.com`

---

## Dizin Haritası

```
app/
  layout.tsx                  — Root layout (Header, MenuOverlay, Vercel Analytics)
  page.tsx                    — Ana sayfa (HeroVideo + ManifestoSection + Slider + Footer CTA)
  globals.css                 — CSS variables, Tailwind @theme, scrollbar gizleme
  about/page.tsx              — Hakkında sayfası
  services/page.tsx           — Hizmetler sayfası
  contact/page.tsx            — İletişim sayfası
  projects/
    page.tsx                  — Projeler listesi (server)
    projects-client.tsx       — Filtreleme + hover preview (client)
    [slug]/page.tsx           — Proje detay (ISR, lightbox, blocks)
  blog/
    page.tsx                  — Blog listesi (server)
    blog-client.tsx           — Blog liste (client)
    [slug]/page.tsx           — Blog post detay
  studio/[[...tool]]/page.tsx — Gömülü Sanity Studio
  api/draft/route.ts          — Draft Mode aktivatörü

components/
  header.tsx                  — Fixed header, hamburger, mix-blend-difference logo
  menu-overlay.tsx            — Full-screen nav overlay
  hero-video.tsx              — Fixed bg video (50vh mobil / 100vh desktop)
  manifesto-section.tsx       — Manifesto başlık + body + CTA
  project-showcase-slider.tsx — 4-slide featured carousel (swipe/keyboard/auto-rotate)
  lightbox-image-blocks.tsx   — CMS blok renderer'ları (FullImage, FullVideo, TwoColumn, Gallery)
  project-blocks-client.tsx   — PortableText → React component mapper
  lightbox-provider.tsx       — Lightbox state Context
  lightbox-overlay.tsx        — Lightbox modal UI
  hero-image-clickable.tsx    — Proje hero görseli (lightbox trigger)
  about-gallery-slider.tsx    — About sayfası galeri slider'ı
  manifesto-section.tsx       — Manifesto blok
  preview-banner.tsx          — Draft mode aktifken gösterilen banner
  ui/                         — 40+ shadcn/ui component (Button, Dialog, Accordion vb.)

lib/
  sanity/
    client.ts                 — Sanity client (useCdn: true)
    get-client.ts             — Preview-aware factory (preview=true → token + previewDrafts)
    image.ts                  — urlFor() — @sanity/image-url builder
    portableText.tsx          — (eski) PortableText renderers, yerini project-blocks-client aldı
  utils.ts                    — cn() — clsx + tailwind-merge
  menu-context.tsx            — Menu aç/kapat React Context
  projects.ts                 — Fallback mock project verisi

sanity/
  schemaTypes/
    project.ts                — Portfolio projesi dökümanı
    blogPost.ts               — Blog yazısı dökümanı
    blocks.ts                 — Modular page builder blokları
    homepage.ts               — Ana sayfa CMS alanları
    about.ts                  — Hakkında sayfası
    services.ts               — Hizmetler sayfası
    siteSettings.ts           — Global site ayarları
    journalPage.ts            — Blog sayfası header
    projectsPage.ts           — Projeler sayfası header
  schema.ts                   — Schema registry
  sanity.config.ts            — Studio config, preview URL resolver
```

---

## Design Sistemi

**Estetik:** Editorial Brutalism — Siyah/Beyaz/Gri, mix-blend-mode: difference, tam genişlik görseller, border-radius: 0

### Renk Paleti (CSS Variables)
| Token | Değer | Kullanım |
|---|---|---|
| `--background` | `#ffffff` | Sayfa arka planı |
| `--foreground` | `#000000` | Yazılar, ikonlar |
| `--secondary` | `#f0f0f0` | İkincil yüzeyler |
| `--muted` | `#eeeeee` | Soluk arka planlar |
| `--muted-foreground` | `#999999` | Placeholder/ikincil yazı |
| `--accent` | `#0504AA` | Elektrik mavisi, CTA, circle logo |
| `--border` | `#000000` | Kenarlıklar |

### Tipografi
- **Font:** Montserrat (Google Fonts) — `var(--font-montserrat)`
- **Ağırlıklar:** 300 (light), 400, 500, 700, 900 (black)
- **Büyük başlıklar:** `font-black uppercase tracking-[-0.03em] leading-[0.85]`
- **Etiketler:** `font-light uppercase tracking-[0.25em] text-[12px]`
- **Proje ismi:** `font-['Montserrat']` ile explicit olarak belirtilir

### Tailwind v4 Notları
- `@theme inline` ile CSS variable'lar Tailwind token'a bağlı
- Border radius: 0px (tasarım sistemi gereği hiç rounded yok)
- `mix-blend-difference` + `text-white` = siyah zeminde beyaz, beyaz zeminde siyah efekti

---

## Sanity CMS

### Bağlantı
```
Project ID : 4qdgb5lz
Dataset    : production
API Version: 2024-01-01
Studio URL : /studio (gömülü Next.js route)
```

### Döküman Tipleri
| Tip | Önemli Alanlar |
|---|---|
| `project` | `title`, `slug` (Sanity slug object), `client`, `industry`, `services[]`, `excerpt`, `heroImage`, `published` (bool), `order` (int), `blocks[]` |
| `blogPost` | `title`, `slug`, `date`, `coverImage`, `excerpt`, `published`, `order`, `blocks[]` |
| `homepage` | `heroVideo`, `headline`, `manifestoText`, `selectedProjects[]->`, `ctaLabel/Headline/ButtonText` |
| `about` | `headline`, `intro`, `positioning[]`, `galleryImages[]`, `teamMembers[]` |
| `services` | `headline`, `intro`, `disciplines[]`, `process[]` |

### Modular Bloklar (`blocks[]`)
```
fullImage   → { image, caption? }
fullVideo   → { video (Sanity file), caption? }
twoColumn   → { leftContent (PortableText), rightImage?, rightVideo? }
textBlock   → { heading, body (PortableText) }
gallery     → { images[] }
quote       → { quoteText, author? }
spacer      → { size: small | medium | large }
heroOverride→ { title, image }
```

### Slug Yapısı — ÖNEMLİ
Sanity'deki `slug` alanı **Sanity slug object** (`{ _type: "slug", current: "..." }`).  
Tüm GROQ query'lerinde `coalesce(slug.current, slug)` kullanılır:
```groq
*[_type == "project" && (slug == $slug || slug.current == $slug)][0]
```
Frontend'de slug string'e çevirmek için:
```typescript
const slugStr = typeof project.slug === 'string' ? project.slug : project.slug?.current
```

### ISR & Caching
- **Revalidation:** `export const revalidate = 10` — her sayfada 10 saniyede bir stale-while-revalidate
- Vercel Webhook kurulumu **kullanılmıyor** (stabil değil), ISR yeterli
- Draft mode → `getClient(true)` → `perspective: "previewDrafts"` + `SANITY_API_TOKEN`

### Draft Mode
- Aktivasyon: `GET /api/draft?secret=<secret>&slug=<slug>`
- Sanity Studio'da preview pane → URL resolver `sanity.config.ts`'te tanımlı
- `lib/sanity/get-client.ts` içinde preview/publish switch'i

### CMS Blok Render Akışı
```
Sanity CMS → GROQ query → projectData.blocks[]
  → ProjectBlocks (project-blocks-client.tsx)
    → switch(_type) → FullImageBlock | FullVideoBlock | TwoColumnBlock | GalleryBlock
      → lightbox-image-blocks.tsx
        → ClickableImage → LightboxProvider context → LightboxOverlay
```

---

## Sayfalar

### Ana Sayfa (`app/page.tsx`)
- `HeroVideo` — fixed bg, `h-[50vh] md:h-screen`, `z-[-1]`
- Spacer div: `h-[50vh] md:h-screen` — video'nun üzerine scroll gelsin diye
- `ManifestoSection` — `bg-background` ile video'yu kaplar, `z-10`
- `ProjectShowcaseSlider` — 4 proje, auto-rotate 5s, swipe+keyboard

### Projeler Listesi (`app/projects/`)
- **Server** (`page.tsx`): Sanity'den fetch, `ProjectsClient`'a props
- **Client** (`projects-client.tsx`):
  - Filter bar: `mix-blend-difference`, büyük font, `All / Branding / Digital...`
  - Her satırda: Sol = client/title, Sağ = servis (masaüstü) / gizli (mobil)
  - Sağ servis: aktif filtre seçiliyse o yazıyor, yoksa `services[0]`
  - Hover → arka plan görseli değişir (fixed z-0 image container)

### Proje Detay (`app/projects/[slug]/page.tsx`)
- `main`: `overflow-x-hidden max-w-[100vw]`
- `HeroImageClickable`: `h-[50vh] md:h-[85vh]`, object-cover, lightbox trigger
- `ProjectBlocks`: tüm CMS blokları sırayla render eder
- Lightbox: tüm görseller `collectImages()` ile belge sırasına göre toplanır
- Sağ üst köşe: `[ X ]` butonu → `/projects`'e döner

### Slider (`components/project-showcase-slider.tsx`)
- Mobil: sadece swipe (tıklama alanları `hidden md:flex`)
- Desktop: sol yarı ← prev, sağ yarı → next (cursor: w-resize / e-resize)
- Auto-rotate: 5s, hover'da duraklar
- Client adı mobil font: `text-[15px]` (desktop: `text-[34px]`)
- `data-showcase="active"` → header logoyu gizler (IntersectionObserver)

---

## Ortam Değişkenleri

```env
NEXT_PUBLIC_SITE_URL=https://www.wearenotcreativestudio.com
NEXT_PUBLIC_SANITY_PROJECT_ID=4qdgb5lz
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=<server-only, draft mode için>
SANITY_PREVIEW_SECRET=<server-only, draft aktivasyon için>
```

`.env.local` dosyası `.gitignore`'da — Vercel'e Environment Variables panelinden girilmiş.

---

## Bilinen Kararlar & Geçmiş

- **Locomotive Scroll kaldırıldı** — native browser scroll + React touch events kullanılıyor
- **Vercel Webhook yok** — ISR revalidate:10 ile çözüldü
- **Sanity slug migrate edildi** — eski string slug'dan Sanity slug object'e geçildi, coalesce() her yerde
- **Draft mode secret bypass** — strict secret check Vercel cache sorununa neden oluyordu, server-side token koruması yeterli
- **Gallery max-h** — dikey portrait görseller `max-h-[70vh] md:max-h-[85vh] w-auto object-contain` ile sınırlandırılmış
- **mix-blend-difference** — header ve projeler listesi bu efektle çalışıyor, `text-white` + `color: white` gerekli
- **`projects-client.tsx`** — `pointer-events-none` outer wrapper, `pointer-events-auto` interactive elementler üzerinde

---

## Sık Yapılan İşlemler

### Yeni CMS Bloğu Eklemek
1. `sanity/schemaTypes/blocks.ts` → yeni blok tipi tanımla
2. `components/lightbox-image-blocks.tsx` → render component yaz
3. `components/project-blocks-client.tsx` → switch case'e ekle
4. `app/projects/[slug]/page.tsx` → `collectImages()` içinde gerekirse görsel topla

### Yeni Sayfa Eklemek
1. `app/<sayfa>/page.tsx` oluştur (server component)
2. Sanity schema'sı gerekiyorsa `sanity/schemaTypes/` altına ekle, `schema.ts`'e kaydet
3. `sanity.config.ts` içinde preview URL resolver'a ekle
4. Header navigasyon varsa `components/menu-overlay.tsx`'te link ekle

### Deploy
```bash
git add <dosyalar>
git commit -m "açıklama"
git push origin main
# Vercel otomatik deploy eder
```
`dist/` klasörünü commit etme — Sanity Studio build çıktısı, Next.js build'iyle ilgisiz.

---

## Paket Sürümleri (Kritikler)

| Paket | Sürüm |
|---|---|
| next | 16.1.6 |
| react / react-dom | 19.2.4 |
| sanity | 5.13.0 |
| next-sanity | 12.1.0 |
| @sanity/client | 7.16.0 |
| tailwindcss | 4.2.0 |
| typescript | 5.7.3 |
| @portabletext/react | 6.0.3 |
