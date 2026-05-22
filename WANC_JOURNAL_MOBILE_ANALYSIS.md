# WANC Journal — Mobil Davranış Analizi

Tarih: 2026-04-30
Branch: `claude/reverent-margulis` (HEAD: `1386064`)
Yöntem: Salt-okunur kod analizi. Hiçbir değişiklik yapılmadı.

Hedef kitle: bu raporu okuyacak geliştirici, mobil davranıştaki sorunları **`md:` breakpoint altında (< 768 px)** kontrol edecek.

---

## 1. HEADER & FIXED ELEMANLAR

### Site Header
- **Path:** `components/header.tsx`
- **`position: fixed`** + `top-0 left-0 w-full`
- **`z-index: 1000`** (`z-[1000]`)
- **`mix-blend-mode: difference`** (inline style)
- Outer: `pointer-events-none`, inner butonlar `pointer-events-auto`
- **Outer padding** = header'ın yüksekliğini belirler:
  - Mobile: `px-8 py-8` → padding-top 32 px, padding-bottom 32 px
  - md+: `md:px-[60px] md:py-[50px]` → padding-top 50 px, padding-bottom 50 px
- Logo (`<Link>`): `text-[24px] md:text-[40px] lg:text-[60px]`, `font-black leading-[0.8]`
- Hamburger butonu: `w-[40px] h-[22px] md:w-[60px] md:h-[35px]`

### Hesaplanmış toplam header yüksekliği
| Viewport | py + max(logo, hamburger) + py | Toplam |
|---|---|---|
| Mobile (< md, 375 px) | 32 + max(24, 22) + 32 | **~88 px** |
| Tablet (md+) | 50 + max(40, 35) + 50 | **~140 px** |
| Desktop (lg+) | 50 + max(60, 35) + 50 | **~160 px** |

### `JournalCloseButton` (yeni — v3)
- Path: `components/journal-close-button.tsx`
- Sadece `pathname.startsWith('/blog/') && pathname !== '/blog'` koşulunda render
- `position: fixed`, `z-[1100]` (header'dan üstte)
- `right-8 md:right-[60px]` (mobile 32 px, md+ 60 px)
- **`top-[68px] md:top-[112px] lg:top-[132px]`** (logo'nun hemen altı)
- Boyut: **`w-9 h-9` (mobile = 36×36 px)**, `md:w-10 md:h-10` (md+ = 40×40 px)
- Font: `text-[22px] md:text-[26px]`
- `hover:text-foreground` (mobile'da hover yok — touch ile farkedilmez)

### Sayfa içerik offset
- **`/blog`** (`blog-client.tsx` `<main>`): `pt-[80px] md:pt-[100px]` → mobile 80 px, md 100 px.
- **`/blog/[slug]`** (`<main>`): `pt-[80px] md:pt-[100px]` → aynı.

> **Tutarsızlık (uyarı):** Mobile header yüksekliği hesaplanan **~88 px**, ama `pt-[80px]` veriliyor. Aradaki **−8 px** açığı, sayfa nav'ının (`Journal` etiketi + sayaç) header'ın saçaklarına denk gelmesine yol açabilir. md+'da header ~140 px, ama `pt-[100px]` veriliyor — burada açık **−40 px**: site logo'su yazı sayfası nav'ının üstüne yaklaşır.

---

## 2. INDEX SAYFASI MOBİL (`/blog` — `blog-client.tsx`)

### Header bar (içerideki, site header'ı değil)
- Container: `flex justify-between items-center px-4 md:px-7 py-3 border-b border-foreground`
  - Mobile padding: **px = 16 px**, **py = 12 px**
- "WeAreNotCreative": `text-[9px] font-bold tracking-[.2em] uppercase`
- "/ Journal": `text-[9px] tracking-[.15em] uppercase text-foreground/35`
- "01 / 03" sayacı: `text-[9px] tracking-[.12em] text-foreground/35`
- **Tüm metin 9 px** — sub-pixel range, mobilde okunabilirlik sınırda.

### Slider
- `cardRatio` (`getCardRatio()`):
  - `< 768 px`: **`0.85`** (kart viewport'un %85'i)
  - `< 1024 px`: `0.60`
  - `else`: `0.55`
- Kart yüksekliği: `h-[260px] md:h-[300px] lg:h-[340px] 2xl:h-[400px]`
- Kart içi padding: `p-4 md:p-5` → mobile **16 px**
- Kart border: `border-r border-white/5` (kartlar arası ayraç)
- Cover image:
  - `src={`${post.coverImage}?w=900&q=80&auto=format`}` — **`sizes` prop yok** (plain `<img>`, `next/image` değil)
  - `className="absolute inset-0 w-full h-full object-cover block pointer-events-none select-none"`
  - `draggable={false}`
- Overlay (sabit gradient): `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.25), rgba(0,0,0,0.1))`
- Kart içeriği fontları:
  - postType: `text-[7px] tracking-[.22em] uppercase text-white/40` → **7 px, çok küçük**
  - title (h2): `text-[13px] md:text-[14px] lg:text-[16px] 2xl:text-[18px] font-black leading-[1.05]`
  - "Oku" CTA: `text-[8px] tracking-[.18em] uppercase text-white/40`

### Scrollbar bandı
- Container: `bg-foreground flex items-stretch`
- Ok butonları:
  - `bg-transparent border-none text-white/35 hover:text-white text-[16px] px-6 py-2.5`
  - Mobile padding: **px = 24 px**, py = 10 px
  - **Hesaplanmış buton yüksekliği: text-16 + py-2.5 × 2 = ~36 px → 44 px touch target altında**
  - Genişlik: 16 + 24×2 = 64 px ✓
- Progress fill: `bg-white/65`, width `100/posts.length %`, `transition-all duration-500`

### Arşiv listesi
- Divider: `flex items-center px-4 md:px-7 pt-2.5 gap-3` (mobile px = 16 px)
- Satır container: `relative overflow-hidden cursor-pointer group` (no padding here)
- Satır iç: `flex justify-between items-center px-4 md:px-7 py-2.5 border-b border-foreground/[0.08]`
  - Mobile padding: **px = 16 px, py = 10 px**
- İndex etiketi: `text-[9px] text-foreground/25 tracking-[.08em] w-6 flex-shrink-0`
- Başlık (`<Link>`): `text-[11px] md:text-[12px] tracking-[-0.01em] uppercase ... truncate`
- Tarih: `text-[9px] tracking-[.1em] text-foreground/25 ... whitespace-nowrap ml-4`
- **Hesaplanmış satır yüksekliği: py-2.5 × 2 + text-12 line-height(~1.4) = 20 + 17 ≈ 37 px → 44 px altında.**

---

## 3. YAZI SAYFASI MOBİL (`/blog/[slug]`)

### Genel
- Body wrapper: `xl:max-w-[900px] xl:mx-auto 2xl:max-w-[1100px]`
- Mobile için max-width yok → tam genişlik.
- Üst offset: `pt-[80px] md:pt-[100px]` (yukarıda anlatılan açık)
- Body padding (blocks container): `px-4 md:px-7 xl:max-w-[900px] xl:mx-auto 2xl:max-w-[1100px]`
  - **Mobile: px = 16 px**

### Nav
- `flex justify-between items-center px-4 md:px-7 py-3 border-b border-foreground`
- Mobile: px = 16 px, py = 12 px
- "Journal" (NON-LINK label): `text-[9px] tracking-[.18em] uppercase text-foreground/40`
- Sayaç: `text-[9px] tracking-[.1em] text-foreground/30`

### Hero
- `grid grid-cols-1 md:grid-cols-2 border-b border-foreground` — **mobile tek sütun ✓**
- Cover panel: `relative overflow-hidden min-h-[200px] md:min-h-[240px] bg-[#111] order-1 md:order-2`
  - Mobile: `order-1` (yani **görsel üstte** ✓)
  - Yükseklik: **mobile `min-h-[200px]`** (sadece minimum; içerik ne kadar yer gerektirirse o)
  - Image: `absolute inset-0 w-full h-full object-cover opacity-90`
- Title panel: `flex flex-col justify-between p-7 md:border-r border-foreground order-2 md:order-1`
  - Mobile: `order-2` (görsel altında), **`p-7` = 28 px padding** (mobile için fazla)
  - **`md:border-r` → mobilde sol border-r KAYBOLUYOR ✓**
- Başlık (h1): `text-[clamp(20px,3.5vw,36px)] font-black leading-[.95] tracking-[-0.04em] uppercase`
- Meta:
  - `text-[8px] tracking-[.2em] uppercase text-foreground/40` (postType + tarih)
  - Yazar / Tarih çiftleri: label 7 px, değer 10 px — **çok küçük**

### Lead
- Outer: `px-7 py-6 border-b border-foreground/10` — Mobile px = 28 px (header ve body'den daha geniş, tutarsız)
- İç p: `text-[16px] leading-[1.62] font-light border-l-[1.5px] border-foreground pl-5 ml-0 md:ml-10 max-w-[620px]`
  - **`ml-0` mobile (md:ml-10) ✓**
  - **`border-l` mobilde KORUNUYOR ✓**
  - `pl-5` = 20 px padding-left
  - `max-w-[620px]` (mobilde genellikle viewport'tan dar olur, dolayısıyla sınırı zorlamaz)

---

## 4. JOURNAL-BLOCKS MOBİL (`journal-blocks.tsx`)

Body wrapper padding'i `px-4 md:px-7` (mobile 16 px). Blocks bunun içinde render edilir.

### textBlock
- Container: `pt-6 max-w-[580px]`
- **Mobile `max-width`: 580 px** (viewport 375 px'te etkisiz — viewport zaten daha dar)
- `padding-top: 24 px`, padding-x yok (parent veriyor)
- Heading: `text-[12px] font-black uppercase tracking-[-0.015em] mb-2.5`
- Body p (normal): `text-[13px] leading-[1.82] text-foreground/55 mb-3`

### fullImage
- Container: **`-mx-4 md:-mx-7 mt-7`**
  - Mobile: `-mx-4` (negatif 16 px, parent padding'i siler — full-bleed) ✓
- Image: `w-full max-h-[85vh] object-contain block`
- Caption: `px-4 md:px-7 pt-2 text-[9px] tracking-[.08em] text-foreground/40 uppercase`

### fullVideo
- Container: **`-mx-4 md:-mx-7 mt-7`**
- Video: `w-full block` — **`max-height` veya boyut kontrolü YOK.** 4K dikey video tüm ekranı kaplayabilir.
- Caption: aynı padding

### twoColumn — alternatif asimetri
- Even index (`isEven`): `grid grid-cols-1 gap-0 mt-7 items-start -ml-4 md:-ml-7 md:grid-cols-[1.5fr_1fr]`
  - **Mobile: tek sütun ✓**
  - **Negatif margin: `-ml-4` mobile uygulanır** (sol kenara taşar)
  - Sol slot: `order-1` (mobilde üstte)
  - Sağ slot: `px-5 md:px-6 pt-4 md:pt-0 order-2` (mobilde altta)
    - **Sağ slot mobile padding: `px-5 pt-4`** — bu padding parent'ın `-ml-4`'üyle birlikte sol kenarda **+4 px** içeride bırakır
- Odd index: aynı şey ama `-mr-4 md:-mr-7 md:grid-cols-[1fr_1.5fr]` + `order-2 md:order-1` / `order-1 md:order-2`
  - **Mobile: metin slot ÜSTTE, görsel slot ALTTA**
  - Sağ kenara taşar
- renderSlot:
  - image: `w-full max-h-[85vh] object-contain block` ✓
  - video: `w-full block` (**maxHeight yok**)
  - text: PortableText sarmalanmış div, ek padding yok

> **Mobile gözlem:** twoColumn alternatif yön mobilde mantıklı durabilir ama her blok kenara bir tarafa taşıyor. Her iki kenara aynı blokta birden farklı margin uygulanmıyor — taşma yönü blok bazında değişiyor. Bu **görsel bir "şiştik"** etkisi yaratabilir.

### gallery — alternatif yükseklik
- Container: `grid ${cols} gap-1 -mx-4 md:-mx-7 mt-7 items-end`
- `cols`: 1 görsel → `grid-cols-1`, 2+ → **`grid-cols-2` (mobilde de 2 sütun!)**
- Gap: 4 px
- Img alternating:
  - even index: `max-h-[70vh]`
  - odd index: `max-h-[55vh] mt-[8%]`
- Tüm görseller: `w-full object-contain block`
- **Mobilde 2 sütun → her görsel viewport'un ~yarısı = ~180 px geniş. `mt-[8%]` stagger nedeniyle bir görsel diğerinden yukarı/aşağı kayar — `items-end` ile alt sıralı.**

### quote
- Container: **`-mx-4 md:-mx-7 mt-7 bg-foreground px-4 md:px-7 py-6`**
  - Mobile: `-mx-4` ile full-bleed, sonra iç `px-4 py-6` ile içerik nefes alır
- Text: `text-[17px] md:text-[20px] font-black leading-[1.1] tracking-[-0.025em] uppercase text-background max-w-[520px]`
- Author: `mt-3 text-[8px] tracking-[.22em] uppercase text-background/50`

### heroOverride
- Container: `-mx-4 md:-mx-7 mt-7`
- Img: `w-full max-h-[85vh] object-contain block`
- Title (caption): `px-4 md:px-7 pt-3 text-[11px] tracking-[.1em] text-foreground/40 uppercase`

### spacer
- `h-6` (small = 24 px) / `h-12` (medium = 48 px) / `h-20` (large = 80 px)
- **Mobile için ayrıca küçültülmemiş.** Mobile'da large spacer (80 px) ekran yüksekliğine göre fazla.

---

## 5. SONRAKI YAZI BLOĞU MOBİL

- Link: `grid grid-cols-1 md:grid-cols-2 border-t border-foreground mt-12 -mx-4 md:-mx-7 xl:mx-0`
  - **Mobile: tek sütun ✓**
  - **Negatif margin: `-mx-4` mobilde var ✓**
- Sol panel: `flex flex-col justify-between p-7 md:border-r border-foreground min-h-[130px] group-hover:bg-foreground transition-colors duration-200`
  - Mobile padding: **`p-7` = 28 px**, min-height: **130 px**
- **Sağ karanlık panel: `hidden md:flex` → mobilde GİZLENİYOR ✓**

---

## 6. TOUCH TARGET KONTROLÜ (WCAG min 44×44 px)

| Eleman | Mevcut padding/height | Hesaplanan boyut | Durum |
|---|---|---|---|
| **Slider okları** (`← →`) | `text-[16px] px-6 py-2.5` | ~36×64 px | ❌ **height 36 px < 44** |
| **Arşiv satırları** (`onClick={() => go(i)}`) | `py-2.5` + 12 px text + line-height ~1.4 | ~37 px height | ❌ **< 44** |
| **Arşiv satır içi link** (`<Link>` title) | text-12, no extra padding | line-height yüksekliği | ❌ Parent satırla aynı (~37 px) |
| **Yazı sayfası nav "Journal"** | NON-LINK (etiket) | Tıklanmıyor | N/A |
| **`×` butonu (JournalCloseButton)** | `w-9 h-9` mobile, `md:w-10 md:h-10` | **36×36 mobile** / 40×40 md+ | ❌ **mobilde 44 altında** |
| **Slider kartları (Link)** | `h-[260px]` | 260×~318 px | ✓ |
| **"Sonraki yazı" linki** | `min-h-[130px] p-7` | 130×viewport | ✓ |
| **Index header marka/sayaç** | Tıklanmıyor | N/A | N/A |

> Touch target açısından **3 net sorun**: slider okları, arşiv satırları, `×` butonu — hepsi 44 px altında.

---

## 7. GENEL MOBİL SORUNLAR

### Mobilde negatif margin kullanan, `md:` prefix'i olmayan class'lar (kasıtlı full-bleed)
Bunlar **kasıtlı**, hata değil — `-mx-4` mobil için, `md:-mx-7` md+ için doğru çift:
- `journal-blocks.tsx` fullImage: `-mx-4 md:-mx-7`
- `journal-blocks.tsx` fullVideo: `-mx-4 md:-mx-7`
- `journal-blocks.tsx` gallery: `-mx-4 md:-mx-7`
- `journal-blocks.tsx` quote: `-mx-4 md:-mx-7`
- `journal-blocks.tsx` heroOverride: `-mx-4 md:-mx-7`
- `journal-blocks.tsx` twoColumn: `-ml-4 md:-ml-7` veya `-mr-4 md:-mr-7` (asimetrik)
- `[slug]/page.tsx` next-post: `-mx-4 md:-mx-7 xl:mx-0`

### `object-contain` ama mobilde dik boşluk bırakacak görseller
- **`gallery` mobilde 2 sütun (`grid-cols-2`)** + `max-h-[70vh]/55vh` + `object-contain` → her hücre ~180 px geniş, dikey görsel hücre içinde küçük kalır, yanlarda boş. Mobilde 1 sütun (`grid-cols-1`) yapmak daha sağlıklı olur.
- `fullImage` / `fullVideo` `max-h-[85vh]` — mobile'da 85vh = ~700-800 px → genelde tüm ekranı kaplar, sıkıntı yok. `object-contain` ile yatay görsellerde alt/üst siyah/şeffaf bant oluşabilir.

### `grid-cols-2` ama mobilde dar kalacak grid'ler
- **`gallery` `grid-cols-2` mobilde de aktif** (üstte). Görsel dar.

### Sabit genişlik tanımları
- `blog-client.tsx` arşiv index span: `w-6` (24 px) — küçük ama OK.
- Slider kart: `flex: '0 0 ${cardRatio * 100}%'` → mobile 85% — OK.
- `[slug]/page.tsx` hero next-post img: `w-full` ✓
- `JournalCloseButton`: **`w-9 h-9`** = 36 px sabit, mobile için küçük (yukarıda).

### `overflow-hidden` eksik olan görsel container'ları
- Hero sağ panel: `relative overflow-hidden min-h-[200px]` ✓
- Slider kartları: `relative overflow-hidden` ✓
- Sonraki yazı sağ panel: `relative overflow-hidden` ✓
- **`journal-blocks.tsx` fullImage/heroOverride wrapper'ı `overflow-hidden` yok** — `object-contain` ile sığdığı için sorun değil, ancak `max-h-[85vh]` constraint kabuk içinde değil de hücre boyutuyla sınırlı olduğu için içerik wrapper'dan taşmaz.

### `whitespace-nowrap` kullanan ama mobilde taşabilecek metinler
- Arşiv tarih: `whitespace-nowrap ml-4 flex-shrink-0` → uzun tarih (örn. "Apr 23, 2026") başlık alanını sıkıştırır, başlık `truncate` ile elipsiz olur. Mobile dar viewport'ta başlık 20-30 karakter sonra elipsiz.
- "Tüm Yazılar" divider etiketi: `whitespace-nowrap` ✓
- "Son" etiketi: yazı sayfasından **v3'te kaldırıldı**.

### Önemli bir uyarı — Touch hedef + nav etiket çatışması
Yazı sayfası nav'ında "Journal" **link değil** (sadece `<span>`). Kullanıcı geri dönmek için **sadece sağ üstteki `×`** kullanmalı. Mobile'da 36×36 px `×` **kullanıcı için bulması zor** olabilir; özellikle ilk kez ziyaret edenler için.

### Sayfa ofset açığı
- Mobile `pt-[80px]`, fakat hesaplanan header `~88 px` → **8 px açık**.
- md+ `pt-[100px]`, fakat hesaplanan header `~140 px` → **40 px açık**.
- Etki: nav etiketi ve site header'ı çakışabilir, özellikle Türkçe karakterlerin descender'larında.

---

## 8. TAILWIND RESPONSIVE PREFIX KULLANIMI

### `sm:` (640 px) — **0 adet**. Hiç kullanılmamış.

### `md:` (768 px) — **çok yoğun** kullanım, en az 50+ kullanım
| Property | Örnek |
|---|---|
| `md:px-7`, `md:px-[60px]` | Padding |
| `md:py-[50px]`, `md:pt-[100px]` | Vertical padding |
| `md:grid-cols-2`, `md:grid-cols-[1.5fr_1fr]` | Grid |
| `md:order-1`, `md:order-2` | Order swap |
| `md:border-r` | Border |
| `md:flex`, `md:hidden`, `md:hidden` | Display |
| `md:text-[14px]`, `md:text-[16px]`, `md:text-[20px]` | Font sizes |
| `md:min-h-[240px]` | Min height |
| `md:gap-4` | Gap |
| `md:ml-10`, `md:-mx-7`, `md:-ml-7`, `md:-mr-7` | Margins |
| `md:right-[60px]`, `md:top-[112px]` | Positioning |
| `md:w-10`, `md:h-10` | Size |
| `md:p-5`, `md:p-6` | Padding |

### `lg:` (1024 px) — sınırlı kullanım
- `lg:h-[340px]` (slider kart yüksekliği)
- `lg:text-[16px]` (slider kart başlık)
- `lg:text-[60px]` (site logo)
- `lg:top-[132px]` (close button)
- `lg:grid-cols-[1fr_1.4fr]` — **Bekle, bu yok artık**. v3'te asimetri index'e bağlı, lg kontrolünden çıkarıldı. (Doğru — v3'te `md:grid-cols-[1.5fr_1fr]` / `md:grid-cols-[1fr_1.5fr]` index-driven.)

### `xl:` (1280 px) — 2-3 kullanım
- `xl:max-w-[900px]`
- `xl:mx-auto` / `xl:mx-0`
- `xl:max-h-[500px]` (renderSlot image — *halen var mı kontrol: hayır, v3 rewrite'da `max-h-[85vh]` oldu*)

### `2xl:` (1536 px) — 3 kullanım
- `2xl:h-[400px]` (slider kart yüksekliği)
- `2xl:text-[18px]` (slider kart başlık)
- `2xl:max-w-[1100px]` (body ve next-post container)

### Mobil-first kullanımı doğru mu?
**Evet, doğru uygulanmış.** Tüm class'lar mobile-first paradigmasıyla yazılmış:
- Base class mobile için (`text-[13px]`, `px-4`, `grid-cols-1`, `pt-[80px]`)
- `md:` ile büyütülüyor / dönüştürülüyor (`md:text-[14px]`, `md:px-7`, `md:grid-cols-2`, `md:pt-[100px]`)
- Bir tane bile ters paradigm (`md:` ile küçültüp base'i büyük tutma) yok.

`md:` breakpoint çok yoğun, ama tasarımın hot-spot'u burada (mobile vs tablet+). `sm:` (640 px) hiç yok — bu, telefonlar arasında ince ayrıştırma yapmadığını gösterir. iPhone SE (375 px) ve iPhone Pro Max (430 px) aynı kuralları görür.

---

## ÖZET — Kritik Mobil Bulgular

| # | Bulgu | Etki |
|---|---|---|
| 1 | `pt-[80px]` mobile header (~88 px) için **−8 px açık**, `pt-[100px]` md+ (~140 px) için **−40 px açık** | Nav etiketi site header arkasına girer / çakışır |
| 2 | `×` butonu mobile `36×36 px` (WCAG min 44) | Touch hedefi yetersiz |
| 3 | Slider okları `~36 px` height | Touch hedefi yetersiz |
| 4 | Arşiv satırları `~37 px` height | Touch hedefi yetersiz |
| 5 | `gallery` mobile `grid-cols-2` | Görseller dar (~180 px), tasarım amacını mobil zayıflatıyor |
| 6 | Mobil `sm:` (640 px) breakpoint hiç kullanılmamış | Geniş telefonlarla küçük telefonlar arasında ayrıştırma yok |
| 7 | `fullVideo` mobile `max-height` yok | 4K dikey video tüm ekranı kaplayabilir |
| 8 | Hero title panel `p-7` (28 px) mobile için fazla | Küçük ekranda nefes alanı + içerik dengesi bozulur |
| 9 | Yazı sayfası geri dönüş yalnız `×` ile | Yeni ziyaretçi keşfetmekte zorlanabilir |
| 10 | Arşiv satırı `text-[11px]` title + tarih `text-[9px]` mobilde okunabilirlik sınırda | Yaşlı / az gören kullanıcılar için zor |
| 11 | Spacer `large` (`h-20` = 80 px) mobile için aşırı | Akış kesintiye uğrar |
| 12 | Cover image plain `<img>`, `next/image` değil | Mobile bandwidth daha fazla |

Rapor sonu.
