# WANC Ana Sayfa — Mevcut Durum Analizi

Tarih: 2026-05-21
Branch: `claude/reverent-margulis` (HEAD: `ef36006`)
Yöntem: Salt-okunur kod analizi. Hiçbir değişiklik yapılmadı.

---

## 1. SAYFA YAPISI (`app/page.tsx`)

### Render sırası (HomePage component'inde)
```
<main>
  <HeroVideo videoUrl={homeData?.heroVideoUrl} />
  <div className="h-[50vh] md:h-screen" />        ← spacer (video fixed olduğu için)
  <ManifestoSection headline body />
  <ProjectShowcaseSlider projects={selectedProjects} />
  <section> CTA bloğu </section>
</main>
```

### GROQ query'leri (preview / non-preview için iki sürüm)

**Ana homepage query:**
```groq
*[_type == "homepage"][0] {
  "heroVideoUrl": heroVideo.asset->url,
  headline,
  manifestoText,
  aboutText,
  ctaLabel,
  ctaHeadline,
  ctaButtonText,
  "selectedProjects": selectedProjects[]->{
    _id,
    "slug": coalesce(slug.current, slug),
    title, client, industry, services, excerpt,
    "heroImage": heroImage.asset->url,
    "image": heroImage.asset->url,
    order
  }[coalesce(published, true) == true]
}
```

**Fallback projects query** (sadece `selectedProjects` boşsa çalışıyor):
```groq
*[_type == "project" && coalesce(published, true) == true]
  | order(order asc) {...projectFields}[0...4]
```

### ISR
- `export const revalidate = 10` — **10 saniye** (sitenin diğer rotaları 30s)
- `next: { tags: ["homepage"] }` ve `["project"]` cache tag'leri ile fetch — webhook revalidate hazır ama tetiklemiyor

### Promise.all
- **YOK.** İki ardışık `await client.fetch(...)` çağrısı. Fallback ihtiyacı oluştuğunda sequential. Bu zararsız çünkü ikinci fetch sadece `selectedProjects` boş kalırsa çalışıyor.

---

## 2. HERO VIDEO (`components/hero-video.tsx`)

### Video kaynağı
- **`videoUrl` prop'tan** geliyor — `app/page.tsx`'ten `homeData.heroVideoUrl`
- GROQ projection: `"heroVideoUrl": heroVideo.asset->url`
- Sanity'de `homepage.heroVideo` (type: file, accept: video/*) tek alandan beslenir

### Proje adı / şehir metni
- **YOK.** Hero video üstünde hardcoded proje adı veya şehir metni RENDER EDİLMİYOR.
- Component sadece video + dark overlay'den ibaret. Hiçbir yazı eklenmemiş.
- (Slogan / başlık manifesto'da, slider'da görünüyor — hero video üzerinde değil.)

### Overlay
- **VAR.** `<div className="absolute inset-0 bg-[#000000]/30" />` — full-cover, %30 siyah saydam katman (readability için).

### Animasyon / transition
- **Yok.** Sadece `loop muted autoPlay playsInline` video tag attribute'leri.
- `transition` veya `animation` class'ı tanımlı değil.

### Scroll davranışı
- `useEffect` ile scroll dinleniyor.
- `scrollY > vh * 1.2` olduğunda `isVisible=false` → component `return null` döner.
- Avantaj: scroll edildikten sonra video DOM'dan kalkar (performans).
- **Risk:** Geri scroll edildiğinde video yeniden mount olur ve **baştan** oynamaya başlar (playback state korunmuyor).

### Mobile davranışı
- Container: `fixed top-0 left-0 w-screen h-[50vh] md:h-screen z-[-1]`
- Mobile: 50vh yükseklik (yarım ekran)
- md+: 100vh (tam ekran)
- Video: `min-width: 100%, min-height: 100%, width: auto, height: auto` + center-translate — bütün hizalama inline CSS

---

## 3. MANIFESTO SECTION (`components/manifesto-section.tsx`)

### Sanity alanları + fallback'ler
| Prop | Sanity field | Fallback değeri |
|---|---|---|
| `headline` | `homepage.headline` | **"Design as a Cultural Practice."** |
| `body` | `homepage.manifestoText` | **"We work with independent brands, cultural institutions and creative leaders who need clarity without compromise. From identity systems to editorial direction — we shape how ideas become visible."** |

### Layout
- **Tek sütunlu vertical flow.** `<section>` içinde `<p>` (eyebrow) → `<h1>` (headline) → `<p>` (body) → `<div>` (CTA).
- **Grid YOK, flex YOK.** Düz blok düzen.
- Sağ taraf **boş.** Sayfanın yarısı görsel olarak boş kalıyor (mobile sorun değil, desktop'ta zayıf).

### Font / boyut
- Eyebrow ("Manifesto"): `font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground`
- Headline: `font-black text-[8vw] md:text-[5.5vw] leading-[0.88] uppercase tracking-[-0.03em] max-w-[95%] text-balance`
- Body: `font-light text-[16px] md:text-[20px] leading-[1.65] text-muted-foreground max-w-[560px]` + `md:ml-[6ch]` indent
- CTA link: `font-medium text-[13px] md:text-[14px] uppercase tracking-[0.15em] border-b-2 border-foreground`

### CTA
- **`href="/contact"`** → contact sayfasına gider
- Metni: **`"Start a Project"`** (hardcoded; Sanity'den gelmiyor — `ctaButtonText` farklı bir alan, footer CTA'sında kullanılıyor)

### Padding
- `px-8 py-32 md:px-[60px] md:py-[180px]` — desktop'ta 180 px dikey, oldukça büyük

### Animasyon
- **Yok.** Statik HTML. Hover'da CTA `opacity-60` (`transition-opacity`).

---

## 4. PROJECT SHOWCASE SLIDER (`components/project-showcase-slider.tsx`)

### Kaç proje
- `projects.slice(0, 4)` — **tam 4 slide** (yorum: "Require exactly 4 slides per user specs")
- Daha az gelirse o kadarını gösterir. Daha fazla gelirse ilk 4'ünü.
- Projeler `app/page.tsx`'ten geliyor: önce Sanity'deki `homepage.selectedProjects` referansları, boşsa `order asc` ile son 4 project doc.
- **Hangi projeler:** SSG çıktısından bilinen slug'lar: `nocturnal-bloom`, `outkastpeople`, `social-media-feed2`, ve diğer 27 proje. Hangi 4'ünün ilk geldiği Tunç'un Studio'da set ettiği `homepage.selectedProjects` referans listesine bağlı (kod statik olarak bilmiyor).

### Kart içeriği (slide başına)
Her slide bir full-bleed görseldir (`heroImage`, `object-cover`). Üstüne **4 ayrı beyaz blok** binmiş "editorial overlay":

1. **Brand Row** (alt-sol, +12 vh): mavi yuvarlak "W" logo + beyaz arka planlı "WeAreNotCreative" etiketi
2. **Client Name** (sol-alt, +40-70 ml offset): büyük beyaz arka planlı `client || title` (`text-[11px] md:text-[28px] font-black uppercase`)
3. **Description** (sol-alt, +15-30 ml offset): beyaz arka planlı excerpt kutusu (max 240 px width, 11/12 px text)
4. **Dots block** (description'ın yanında): beyaz arka planlı, slide göstergesi (siyah/gri dot, 4 adet, 5×5 px)
5. **Right CTA** (sağ-alt): "VIEW PROJECTS" buton — saydam, beyaz border, hover'da invert (`bg-white text-black`). `/projects/${slug}`'a gider.

> ⚠️ **Önemli bulgu:** Her slide'da görselin üstünde **dört beyaz dikdörtgen blok** var (brand label, client name, description, dots). Bu büyük olasılıkla kullanıcının daha önce "beyaz overlay" diye şikayet ettiği şeydi — `from-black/25` gradient değil, bu beyaz bloklar görsel okunaklığını bozuyor. Önceki turda gradient overlay'i kaldırdım ama bu beyaz bloklar **hâlâ duruyor**.

### Navigation
- **Auto-rotate:** 5 saniye (hover'da duraklar)
- **Klavye:** `←` / `→` ok tuşları
- **Mouse (md+):** Görselin sol yarısı `cursor: w-resize`, sağ yarısı `cursor: e-resize` — tıklama prev/next
- **Touch (mobile):** swipe (50 px threshold)
- **Dots:** sadece **görüntüleme**, tıklanabilir değil

### Mix-blend-mode
- **Bu component'ta KULLANILMAMIŞ.** (Sitenin geri kalanında — `Header`'da var: `mixBlendMode: "difference"`.)
- Bunun yan etkisi: header beyaz logo'su slider üstünde "difference" ile renk değiştiriyor. Hero görselin parlaklığına göre logo siyah/beyaz olarak değişir. IntersectionObserver bunu fark etmiş ve `body.dataset.showcase = "active"` set ediyor — `globals.css`:
  ```
  body[data-showcase="active"] .header-logo-container {
    opacity: 0;
    pointer-events: none;
  }
  ```
  → Slider görünürken header LOGO'su tamamen GİZLENİYOR (sadece hamburger kalıyor).

### Mobile davranışı
- Section height: `h-[60vh] md:h-screen` (mobile 60vh, desktop tam ekran)
- Navigation halves (`hidden md:flex`) — mobile'da yok
- Touch swipe aktif (`touchAction: pan-y`)
- Brand row + client name + dots: padding ve font değerleri md: ile büyüyor

### Hover efektleri
- "VIEW PROJECTS" butonu: hover → bg beyaz, text siyah (inline onMouseEnter/Leave)
- Auto-rotate hover'da duruyor
- Görselde başka hover state yok

---

## 5. HOMEPAGE SANITY SCHEMA

`sanity/schemaTypes/homepage.ts`:

| Alan | Tip | Açıklama |
|---|---|---|
| `heroVideo` | `file` (accept: video/*) | Arka plan video |
| `headline` | `string` | Manifesto büyük başlığı |
| `manifestoText` | `text` (4 rows) | Manifesto body paragrafı |
| `selectedProjects` | `array of references to project` | Slider'da gösterilecek projeler. **Sayı limiti yok** (kodda ilk 4 alınıyor) |
| `ctaLabel` | `string` | Footer CTA eyebrow |
| `ctaHeadline` | `string` | Footer CTA büyük başlık |
| `ctaButtonText` | `string` | Footer CTA buton metni |
| `aboutText` | `text` (3 rows) | **Schema'da var ama kodda KULLANILMIYOR** — fetch ediliyor (`aboutText` projeksiyonda) ama render edilmiyor |

### Aranan ama olmayan alanlar
- **`featuredProjects`** alanı **yok** — onun yerine `selectedProjects` adlı alan var. İsim farklı, işlev aynı.
- **Journal/blog ile ilgili alan yok** — ana sayfada Journal preview / latest post bölümü yok. Eklemek istiyorsan schema'ya yeni field gerek.
- **Hero için title/subtitle alanı yok** — hero üzerine yazı koymak istersen schema'ya alan eklenmesi lazım.

### Schema-kod uyumsuzlukları
1. `aboutText` schema'da var, GROQ'ta projeksiyona dahil, **ama hiçbir component kullanmıyor** → dead data
2. Schema'da `selectedProjects`'in min/max sayısı tanımsız — kod tek başına 4 ile sınırlandırıyor

---

## 6. ANİMASYONLAR VE KÜTÜPHANELER

### Animasyon kütüphaneleri
- **Framer Motion:** **YOK** (package.json'da yok)
- **GSAP:** **YOK**
- **Lenis / Locomotive Scroll:** **YOK** (CLAUDE.md'de "Locomotive Scroll kaldırıldı" notu var)
- **React Spring / anime.js:** **YOK**
- **`tw-animate-css`** kütüphanesi var (devDependency) — Tailwind v4 için animasyon utility extension'ı
- **`embla-carousel-react`** kurulu — kullanılıyor mu kontrol edilmedi (kullanılıyorsa ana sayfada değil)

### Mevcut animasyon kullanımı (ana sayfada)
- `HeroVideo` — yok
- `ManifestoSection` — sadece CTA hover `transition-opacity`
- `ProjectShowcaseSlider`:
  - Slide geçişi: `transition-opacity duration-1000 ease-in-out`
  - Dot color: `transition-colors duration-300`
  - VIEW PROJECTS hover: inline JS, transition yok
- CTA bloğu: hover `transition-opacity`

### Scroll dinleyiciler / IntersectionObserver
- **`HeroVideo`:** `scroll` listener (passive) — video'yu unmount/mount eder
- **`ProjectShowcaseSlider`:** `IntersectionObserver` (threshold 0.1) — `body.dataset.showcase` toggle ediyor; header logo'sunu gizliyor
- `ManifestoSection`: yok
- CTA: yok

### CSS animation/keyframes
- `globals.css`'te keyframes yok
- Tailwind utility transitions çoğunlukla `duration-150` ile `duration-1000` arası

---

## 7. BAĞIMLILIKLAR

### Ana sayfada kullanılan component'lar
| Component | Path | Ana sayfa dışında kullanılan yer | Risk |
|---|---|---|---|
| `HeroVideo` | `components/hero-video.tsx` | **Hiçbir yerde** | Dokunmak güvenli |
| `ManifestoSection` | `components/manifesto-section.tsx` | **Hiçbir yerde** | Dokunmak güvenli |
| `ProjectShowcaseSlider` | `components/project-showcase-slider.tsx` | **Hiçbir yerde** | Dokunmak güvenli |
| `Link` (next/link) | next built-in | Her yerde | N/A |

### `SelectedProjects` durumu (önemli)
- **`components/selected-projects.tsx`** dosyası var ama **HİÇBİR YERDE IMPORT EDİLMİYOR.**
- Grep sonucu: sadece kendi dosyasında bulundu, hiçbir import yok.
- **DEAD CODE.** Önceki turlardaki "Selected Projects'i büyüt" değişiklikleri canlı siteye yansımıyor olabilir — çünkü component zaten kullanılmıyor!
- Tile büyütme / grayscale kaldırma değişikliklerim bu dosyada yapılmıştı → site üzerinde gerçekte hiçbir etkisi olmadı.

### homepage dışında çekilen document type'lar
- **`project`** — `selectedProjects` referansları (`->`) ile çekiliyor + fallback query
- (Footer için root layout'tan `siteSettings` çekiliyor — ana sayfaya özel değil)

### Dokunmanın riski
- Üç component (`HeroVideo`, `ManifestoSection`, `ProjectShowcaseSlider`) sadece ana sayfada kullanılıyor → güvenle değiştirilebilir
- `selected-projects.tsx` dead code → silinmesi güvenli
- `project` schema değişikliği → projeler listesini, detayı ve homepage slider'ı etkiler

---

## 8. GERÇEK İÇERİKLER

### Hero üzerindeki proje adı + şehir
- **YOK.** Kodda hardcoded değil, schema'da alan yok.

### Manifesto headline (CMS dolu değilse fallback)
> **"Design as a Cultural Practice."**

### Manifesto body (CMS dolu değilse fallback)
> **"We work with independent brands, cultural institutions and creative leaders who need clarity without compromise. From identity systems to editorial direction — we shape how ideas become visible."**

### Manifesto CTA metni (hardcoded)
> **"Start a Project"** → `/contact`

### Footer CTA (Sanity'den)
- Eyebrow label: `ctaLabel` (örn. "Next Step")
- Büyük başlık: `ctaHeadline` (örn. "LET'S TALK.")
- Buton metni: `ctaButtonText` (default fallback **"Start a Conversation"**) → `/contact`

### Featured projects
- Sanity'deki `homepage.selectedProjects` array'inden geliyor — gerçek başlıklar kodu okuyarak görülemez (Studio'da set edilmiş)
- Fallback olarak `order asc` ile en küçük order'li 4 published project gelir
- Bilinen slug'lar (SSG çıktısından): `nocturnal-bloom`, `outkastpeople`, `social-media-feed2`, +27 daha

### Slider'da gösterilen kart içeriği
- `client || title` (büyük client adı)
- `excerpt` (description kutusu)
- `heroImage` (full-bleed bg)
- "VIEW PROJECTS" CTA

---

## 9. MOBİL DURUM

### Section bazlı padding'ler

| Section | Mobile | md+ |
|---|---|---|
| `HeroVideo` container | `h-[50vh]` | `h-screen` |
| Spacer div | `h-[50vh]` | `h-screen` |
| `ManifestoSection` | `px-8 py-32` | `md:px-[60px] md:py-[180px]` |
| `ProjectShowcaseSlider` | `h-[60vh]` + slider içi `px-[4vw]` | `h-screen` + `md:px-[3.5vw]` |
| Footer CTA | `px-8 py-32` | `md:px-[60px] md:py-[180px]` |

### Hero mobile farkı
- Yükseklik: 50vh vs 100vh
- Video aynı şekilde fixed ve playing
- Overlay aynı (%30 siyah)
- Mobile'da scroll dinleyici aynı şekilde çalışıyor (1.2× viewport)

### Slider mobile davranışı
- **Swipe aktif** (`onTouchStart/Move/End`, 50 px threshold)
- **Klik halves gizli** (`hidden md:flex`) — mobile'da tıklama navigation'ı yok
- **Brand label / client name / description / dots: küçük font + sıkı padding**, mobile için ayarlanmış
- VIEW PROJECTS butonu aynı boyutta (mobile 8/16 padding)

### Responsive hidden/block class'lar
- `ProjectShowcaseSlider` navigation halves: `hidden md:flex`
- `SelectedProjects` (dead): `hidden md:block` ve `block md:hidden` — desktop/mobile için iki ayrı render branch'i
- `Header` (zorunlu): hamburger ve logo `md:` ile boyut değişiyor

### Mobile sorunları (gözlem)
- **Spacer div** (`h-[50vh] md:h-screen`) hero video'nun fixed olduğu için gerekli — DOM akışında yer tutmuyorsa manifesto video'nun arkasına gider. Mobile'da 50vh — küçük telefonda ManifestoSection'a geçiş ani.
- **Manifesto `md:ml-[6ch]`** — body paragrafının 6 karakter sola kayması, mobile'da uygulanmıyor. Mobile'da düz yaslı.
- **Slider editorial overlay** mobile'da brand row + client name + description + dots dikey olarak alt-sol köşede iç içe; client name `bg-white` arkasında `text-[11px]` — küçük telefonda okunabilir ama beyaz kutu görseli ciddi şekilde maskeliyor.

---

## ÖZET — Kritik Bulgular

1. **`SelectedProjects` dead code.** Önceki turlarda yapılan tile büyütme / grayscale kaldırma değişiklikleri etkili olmamış. Component hiçbir yerden import edilmiyor.
2. **"Beyaz overlay" gerçek kaynağı `ProjectShowcaseSlider`'daki 4 beyaz dikdörtgen blok** (brand row, client name, excerpt, dots). Bunlar slide'ı görsel olarak parçalıyor. Önceki turda kaldırılan `from-black/25` gradient'i bunlardan farklı bir şeydi.
3. **`aboutText` schema'da var, kullanılmıyor** → dead Sanity field.
4. **Hero üzerinde başlık/şehir metni yok** — Tunç istiyorsa schema'ya alan eklemek gerek.
5. **Promise.all yok ana sayfada** — homepage fetch + fallback sequential. Sorun değil ama optimize edilebilir.
6. **`HeroVideo` scroll'da unmount/mount oluyor** — playback state korunmuyor, geri scroll'da baştan başlar.
7. **Ana sayfada Journal/blog kartı yok** — son yazıları göstermek istersen yeni section + GROQ gerek.
8. **Header logo'sunu slider gizliyor** (IntersectionObserver + globals.css). Bilinçli karar.
9. **Mobile spacer 50vh** manifesto'ya geçişi sertleştiriyor. Daha yumuşak geçiş için ayar gerekebilir.
10. **Animasyon kütüphanesi yok** — sadece CSS transition. Framer Motion veya scroll-driven animation eklemek istersen yeni paket gerek.

Rapor sonu.
