# Sharthak Studio — Admin (CMS) Sections Guide (Hinglish)

Ye document `src/app/admin/page.tsx` aur website ke sections (`src/app/AppContent.tsx`) ke basis pe banaya gaya hai. Isme admin me jo sections dikh rahe hain unka **naam**, **kaam**, aur **usse kya impact hota hai** (kyu use karna chahiye) explained hai.

## Admin ka basic logic (samajh lo)

Admin me har “section” ke andar multiple **Media Slots** hote hain.

- **Upload** karoge to file `Cloudinary` pe upload hoti hai (`/api/upload`) aur uska URL `Supabase` table `media_slots` me save hota hai. Saath me browser me `localStorage` me bhi cache hota hai (key: `sharthak_media_slots_v1`).
- **LIVE toggle**:
  - `LIVE = ON` (useOnSite = true) aur slot me uploaded file hai → website pe wahi file dikhayi degi.
  - `LIVE = OFF` ya uploaded file nahi hai → website fallback image/video use karegi (defaults).
- **Clear** karoge to uploaded file remove ho jati hai aur slot fallback par aa jata hai.

> Important: Website pe koi asset tabhi change hota hai jab frontend code usi **slot id** ko use kar raha ho. Agar slot id frontend me use nahi ho rahi, to admin me upload karke bhi website me kuch change nahi dikhega.

---

## Admin me visible sections (current)

Ye sections admin sidebar me show hote hain (list `VALID_SECTIONS` se aati hai).

### 01. MOBILE HERO SECTION

**Admin me kya control hota hai**
- 12 image slots:
  - `mobile-hero-top-01` … `mobile-hero-top-06`
  - `mobile-hero-bot-01` … `mobile-hero-bot-06`

**Website pe kahan effect hona chahiye**
- Intended: Mobile hero top/bottom strips.

**Reality (current code) — kya hoga isse**
- Website ka actual mobile hero (`src/components/MobileHeroSection.tsx`) **in slot ids ko use nahi karta**.
- Mobile hero + desktop strips dono `strip-top-01..06` aur `strip-bot-01..06` use kar rahe hain.

**Meaning**
- Is section me upload karoge to data save hoga, lekin website pe **currently visible change nahi aayega**.

---

### 02. INFINITE STRIPS (DESKTOP)

**Admin me kya control hota hai**
- 12 image slots:
  - Top: `strip-top-01` … `strip-top-06`
  - Bottom: `strip-bot-01` … `strip-bot-06`

**Website pe kahan impact**
- Desktop strips CTA section: `src/components/InfiniteStripsCTASection.tsx`
- Mobile hero strips (mobile view): `src/components/MobileHeroSection.tsx`

**Kyu / kya hoga**
- In slots ko update karne se scrolling marquee strips ke images instantly change ho jaate hain (LIVE ON hone par).

---

### 03. THE COLLECTION (GALLERY)

**Admin me kya control hota hai**
- Gallery items (images) + categories:
  - Fixed slots: `gal-01` … `gal-18`
  - Dynamic slots (admin se add): `gal-dyn-...`
- Category system: har gallery slot ke paas `categoryLabel` hota hai (e.g. WEDDING, PRE-WEDDING).
- Batch upload option: multiple images ek saath add + upload.

**Website pe kahan impact**
- Gallery grid + lightbox: `src/components/GallerySection.tsx`
- Service cards (category previews): `src/components/ServiceCardsSection.tsx` (gallery se categories pick karta hai)

**Kyu / kya hoga**
- New images upload + LIVE ON → website gallery me dikhengi, tabs/categories auto-generate hoti hain.
- Category change → website ke tabs aur filtering me impact.
- Slot delete → gallery se wo image hat jaati hai.

---

### 04. CHOOSE YOUR EXPERTISE

**Admin me kya control hota hai**
- 4 image slots:
  - `expertise-01` … `expertise-04`

**Website pe kahan impact**
- Expertise carousel: `src/components/ExpertiseSection.tsx`

**Kyu / kya hoga**
- Slides ke background/hero visuals change honge.
- Uploaded images par component `object-contain` use karta hai (cropping kam hoti hai).

---

### 05. INSTAGRAM FEED (LATEST WORK)

**Admin me kya control hota hai**
- 4 image slots:
  - `reel-01` … `reel-04`

**Website pe kahan effect hona chahiye**
- Intended: Latest Work / Instagram feed section.

**Reality (current code) — kya hoga isse**
- Website ka Latest Work section (`src/components/LatestWorkSection.tsx`) slot ids **`latest-work-01` … `latest-work-06`** use karta hai.
- `reel-01..04` ids website me use nahi ho rahi.

**Meaning**
- Is section me upload karoge to data save hoga, lekin website Latest Work me **currently change nahi dikhega**.

---

### 06. ABOUT ME SECTION

**Admin me kya control hota hai**
- 1 image slot:
  - `about-me-photo` (Founder portrait)

**Website pe kahan impact**
- About Me section left portrait: `src/components/AboutMeSection.tsx`

**Kyu / kya hoga**
- Founder photo update ho jayegi (LIVE ON).

---

### 07. WHY CHOOSE US (BOOK FLIP)

**Admin me kya control hota hai**
- Total 20 image slots (5 pages × 4 images):
  - Page hero: `why-choose-us-p1-hero` … `why-choose-us-p5-hero`
  - Tiles: `why-choose-us-pX-tile-1/2/3`

**Website pe kahan impact**
- Book flip section pages: `src/components/WhyChooseUsBookFlipSection.tsx`

**Kyu / kya hoga**
- Har “page” ka hero + 3 tiles replace ho jaate hain; page-flip experience me visuals change hote hain.

---

### 08. STUDIO METRICS

**Admin me kya control hota hai**
- 4 text slots:
  - `metric-1` … `metric-4`
- Har metric me:
  - `Value` (e.g. `12+`)
  - `Label` (e.g. `YEARS OF LEGACY`)

**Website pe kahan impact**
- Metrics section: `src/components/WhyChooseUsSection.tsx`

**Kyu / kya hoga**
- Website par animated flip counters me value/label change ho jaata hai.

---

## Admin ke extra panels (sections ke alawa)

### Media Library (Top bar me “Library”)
- Ye saare uploaded files ka grid dikhata hai (`allMedia`).
- Filter by **Section** aur **Type (image/video)**.
- Delete karoge to related slot ka uploaded file clear ho jayega (fallback par chala jayega).

### Journals (Blog Manager)
- New blog/journal entry create + image upload + HTML content save.
- Data `Supabase` table `blogs` me save hota hai.
- “Journal Page” button se `/blog` open hota hai (public page).

---

## Hidden but existing (code me hai, admin me show nahi hota)

### 00. SERVICE CATEGORIES

**Kya hai**
- 8 image slots: `service-card-01` … `service-card-08`

**Kahan use hota hai**
- Services horizontal cards: `src/components/ServiceCardsSection.tsx`

**Kyu important**
- Agar aap chahte ho ki har category (WEDDING/PRE-WEDDING etc.) ka ek fixed “cover image” ho, to ye slots use hote hain.

**Note**
- Ye section admin dashboard me currently filter ho raha hai (isliye sidebar me nahi dikh raha).

