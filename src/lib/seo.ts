import { SITE_URL } from "@/lib/site";

export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoService = {
  slug: string;
  name: string;
  shortName: string;
  titlePrefix: string;
  summary: string;
  detailedIntro: string;
  deliverables: string[];
  highlights: string[];
  process: string[];
  keywords: string[];
  faqs: SeoFaq[];
};

export type SeoCity = {
  slug: string;
  name: string;
  region: string;
  summary: string;
  audience: string;
  venueTypes: string[];
  nearbyAreas: string[];
  strengths: string[];
  keywords: string[];
};

export const SEO_SERVICES: SeoService[] = [
  {
    slug: "wedding-photography",
    name: "Wedding Photography",
    shortName: "Wedding Photography",
    titlePrefix: "Wedding Photographer",
    summary:
      "Premium wedding photography focused on candid emotions, family rituals, portraits, and story-led coverage with a polished editorial look.",
    detailedIntro:
      "Our wedding photography coverage is built for couples who want real emotion, clean compositions, flattering light, and timeless storytelling. We document the full rhythm of the wedding day, from pre-ceremony moments to high-energy baraat frames and intimate family reactions.",
    deliverables: [
      "Bride and groom portraits with cinematic posing guidance",
      "Candid family moments, rituals, and crowd reactions",
      "High-resolution edited photo gallery for album and social sharing",
      "Coverage planning support for timeline, locations, and key family portraits",
    ],
    highlights: [
      "Balanced candid and portrait coverage",
      "Consistent color grading for albums and reels",
      "Team coordination for baraat, varmala, and reception flow",
      "Optimized for luxury albums, Instagram carousels, and teaser posts",
    ],
    process: [
      "Discovery call to understand venue, family flow, and style references",
      "Shot planning for rituals, portraits, and couple time",
      "On-ground coverage with a structured team and lighting support",
      "Curated edits, delivery planning, and album-ready photo selection",
    ],
    keywords: [
      "wedding photographer",
      "candid wedding photography",
      "bridal portrait photography",
      "cinematic wedding photos",
    ],
    faqs: [
      {
        question: "What does your wedding photography coverage usually include?",
        answer:
          "Coverage typically includes candid moments, rituals, portraits, couple sessions, family photographs, and carefully edited final images suited for albums, prints, and social posting.",
      },
      {
        question: "Do you guide couples who are not comfortable posing?",
        answer:
          "Yes. We keep the direction natural and simple so portraits feel relaxed rather than forced. That is especially helpful for couples doing their first professional shoot.",
      },
      {
        question: "Can you cover both day and night wedding events?",
        answer:
          "Yes. We plan coverage according to venue lighting, event timing, and crowd movement so key moments stay consistently well documented across all functions.",
      },
      {
        question: "Is wedding photography available outside Gaya?",
        answer:
          "Yes. Sharthak Studio serves Gaya and nearby cities across Bihar for wedding photography, pre-wedding sessions, and event coverage.",
      },
    ],
  },
  {
    slug: "wedding-cinematography",
    name: "Wedding Cinematography",
    shortName: "Wedding Cinematography",
    titlePrefix: "Wedding Cinematographer",
    summary:
      "Cinematic wedding films with emotional pacing, premium edits, sound-led storytelling, and social-ready highlight reels.",
    detailedIntro:
      "Our wedding cinematography is designed for couples who want a film, not just clips. We focus on movement, emotion, sound, and visual sequencing so your wedding memories feel immersive and rewatchable.",
    deliverables: [
      "Teaser edits and highlight reels for Instagram and WhatsApp sharing",
      "Main wedding film with sound design and music-led pacing",
      "Coverage of rituals, bride and groom prep, family reactions, and reception highlights",
      "Vertical and horizontal edits based on platform needs",
    ],
    highlights: [
      "Story-driven edits instead of random montage clips",
      "Smooth camera motion and cinematic composition",
      "Sound layering for vows, family reactions, and live ambience",
      "Fast turnaround planning for social teaser moments",
    ],
    process: [
      "Event blueprint and scene planning",
      "Coverage of prep, rituals, portraits, and crowd energy",
      "Footage curation and edit sequencing",
      "Final delivery of teaser, highlights, and wedding film assets",
    ],
    keywords: [
      "wedding cinematography",
      "cinematic wedding film",
      "wedding videography",
      "wedding reels",
    ],
    faqs: [
      {
        question: "What is the difference between wedding videography and cinematography?",
        answer:
          "Wedding cinematography is more story-led and edit-driven. It focuses on emotion, pacing, sound, and visual direction instead of only documenting events in sequence.",
      },
      {
        question: "Do you create short reels for Instagram too?",
        answer:
          "Yes. Along with the main film, we can plan short-form teaser edits and vertical reels that work well for social media previews.",
      },
      {
        question: "Can the same team handle photography and cinematography together?",
        answer:
          "Yes. We plan both teams together so photo and video coverage complement each other instead of competing for the same moment.",
      },
      {
        question: "Do you travel for destination weddings in Bihar and nearby cities?",
        answer:
          "Yes. We regularly cover weddings across Gaya, Patna, Muzaffarpur, Deoghar, and surrounding locations based on schedule and requirements.",
      },
    ],
  },
  {
    slug: "pre-wedding-shoot",
    name: "Pre Wedding Shoot",
    shortName: "Pre Wedding Shoot",
    titlePrefix: "Pre Wedding Photographer",
    summary:
      "Stylized pre-wedding shoots with concept planning, outfit guidance, location selection, and cinematic storytelling for save-the-date and social content.",
    detailedIntro:
      "A strong pre-wedding shoot should look personal, not generic. We help couples create a visual style that feels natural to them while still delivering premium-looking portraits and reels.",
    deliverables: [
      "Concept and mood planning based on couple personality",
      "Location and timing recommendations for the best light",
      "Photo and video assets for invitations, save-the-date, and reels",
      "Edited portraits suitable for album prints and social posting",
    ],
    highlights: [
      "Concept-first planning instead of random posing",
      "Location guidance around Bihar and nearby destinations",
      "Balanced candid chemistry with premium portrait direction",
      "Optimized shoot flow for multiple looks in a single session",
    ],
    process: [
      "Reference discussion and creative direction",
      "Location shortlist and timing finalization",
      "Shoot-day posing support and visual sequencing",
      "Edit curation for teaser reels and final gallery delivery",
    ],
    keywords: [
      "pre wedding shoot",
      "pre wedding photography",
      "couple shoot",
      "save the date shoot",
    ],
    faqs: [
      {
        question: "Do you help choose locations for the pre-wedding shoot?",
        answer:
          "Yes. We suggest locations based on travel feasibility, light, privacy, styling, and the kind of visual mood the couple wants.",
      },
      {
        question: "Can you shoot both photos and reels in one pre-wedding session?",
        answer:
          "Yes. We plan the session so photos and video complement each other, saving time while still producing premium output in both formats.",
      },
      {
        question: "How should couples prepare for the shoot?",
        answer:
          "We usually guide couples on outfit combinations, timing, reference mood, and what to carry so the session feels smoother and more expressive.",
      },
      {
        question: "Is a pre-wedding shoot only for weddings?",
        answer:
          "Mostly couples book it before weddings, but engagement shoots, anniversary sessions, and romantic couple portraits can follow a similar format too.",
      },
    ],
  },
  {
    slug: "baby-shoot",
    name: "Baby Shoot",
    shortName: "Baby Shoot",
    titlePrefix: "Baby Shoot Photographer",
    summary:
      "Warm, safe, and expressive baby shoots designed around comfort, natural expressions, and family-friendly storytelling.",
    detailedIntro:
      "Baby shoots work best when the pace is calm and the environment feels safe. We plan around the baby’s comfort, family coordination, and gentle styling to create cheerful, timeless portraits.",
    deliverables: [
      "Solo baby portraits and parent-baby frames",
      "Studio-style and lifestyle-style coverage options",
      "Edited images for albums, wall frames, and announcements",
      "Guidance on timing, props, and outfit coordination",
    ],
    highlights: [
      "Comfort-first workflow with flexible pacing",
      "Soft tones and cheerful family-focused images",
      "Parent involvement to create natural reactions",
      "Useful for birthdays, milestone memories, and keepsake albums",
    ],
    process: [
      "Pre-shoot comfort planning and outfit discussion",
      "Gentle session pacing around the baby’s mood",
      "Multiple family-friendly frame variations",
      "Polished edit delivery with print-friendly selections",
    ],
    keywords: [
      "baby shoot",
      "baby photography",
      "first birthday shoot",
      "family baby portraits",
    ],
    faqs: [
      {
        question: "When is the best time to schedule a baby shoot?",
        answer:
          "The best time depends on the child’s routine and the kind of session you want. We usually suggest timing that aligns with the baby being rested and comfortable.",
      },
      {
        question: "Can parents and siblings join the baby shoot?",
        answer:
          "Yes. Family participation often creates the most natural expressions and makes the final gallery more meaningful.",
      },
      {
        question: "Do you offer birthday baby shoots too?",
        answer:
          "Yes. Birthday milestone sessions are one of the most popular formats, especially when parents want a mix of portraits and celebration coverage.",
      },
      {
        question: "What kind of photos are delivered?",
        answer:
          "You receive edited portraits suited for sharing, printing, and preserving milestone memories in albums and frames.",
      },
    ],
  },
  {
    slug: "maternity-shoot",
    name: "Maternity Shoot",
    shortName: "Maternity Shoot",
    titlePrefix: "Maternity Photographer",
    summary:
      "Elegant maternity photography with soft direction, graceful posing, and family-centered portraits designed to feel intimate and timeless.",
    detailedIntro:
      "Maternity portraits should feel calm, confident, and personal. We create sessions that highlight emotion, connection, and graceful styling without making the experience feel stiff or overly posed.",
    deliverables: [
      "Solo maternity portraits and family frames",
      "Guided posing for natural and flattering photographs",
      "Indoor or outdoor styling based on comfort and look",
      "Edited images suitable for keepsakes, announcements, and albums",
    ],
    highlights: [
      "Comfort-focused posing and paced sessions",
      "Elegant styling direction with soft editorial framing",
      "Partner and family inclusion where preferred",
      "Ideal for announcement posts, prints, and memory books",
    ],
    process: [
      "Consultation for styling and comfort priorities",
      "Session planning with simple pose guidance",
      "Portrait flow designed around confidence and ease",
      "Refined edit curation and final image delivery",
    ],
    keywords: [
      "maternity shoot",
      "maternity photography",
      "pregnancy photoshoot",
      "baby bump portraits",
    ],
    faqs: [
      {
        question: "Do you guide posing during maternity shoots?",
        answer:
          "Yes. Gentle direction is a big part of the session so you feel comfortable, relaxed, and confident in every frame.",
      },
      {
        question: "Can partners or children join the maternity shoot?",
        answer:
          "Yes. Family inclusion often adds warmth and gives the gallery a more personal story.",
      },
      {
        question: "Do you offer indoor and outdoor maternity sessions?",
        answer:
          "Yes. The setup depends on the look you prefer, privacy needs, travel comfort, and available light.",
      },
      {
        question: "What style of edits do you deliver?",
        answer:
          "We keep the look clean, flattering, and timeless so the images remain meaningful long after current trends change.",
      },
    ],
  },
  {
    slug: "event-photography",
    name: "Event Photography",
    shortName: "Event Photography",
    titlePrefix: "Event Photographer",
    summary:
      "Structured event photography for celebrations, corporate gatherings, cultural programs, and family functions with fast, organized coverage.",
    detailedIntro:
      "Event photography requires speed, anticipation, and coverage discipline. We document stage moments, audience reactions, guest portraits, decor, and overall atmosphere so the event is preserved comprehensively.",
    deliverables: [
      "Wide event coverage plus stage and guest moments",
      "Team coverage for crowd flow and important milestones",
      "Edited event gallery for recap posts and archives",
      "Useful visual assets for organizers, brands, and families",
    ],
    highlights: [
      "Coverage planned around schedule-critical moments",
      "Balanced stage, decor, audience, and networking photos",
      "Suitable for social recaps, press sharing, and archives",
      "Flexible for private, public, and business events",
    ],
    process: [
      "Event brief and key-moment planning",
      "Coverage allocation based on stage flow and audience zones",
      "Rapid capture of guest interactions and highlight moments",
      "Post-event edit selection for fast, usable delivery",
    ],
    keywords: [
      "event photographer",
      "event photography",
      "corporate event photography",
      "celebration photography",
    ],
    faqs: [
      {
        question: "What kinds of events do you cover?",
        answer:
          "We cover private celebrations, stage programs, brand events, family gatherings, and other occasions that need organized visual documentation.",
      },
      {
        question: "Can you cover large guest events?",
        answer:
          "Yes. Coverage is planned according to crowd size, movement, and stage timing so important moments are not missed.",
      },
      {
        question: "Do event photos work for marketing and social media recaps?",
        answer:
          "Yes. We deliver images that are useful for announcements, event recap posts, press sharing, and brand communication.",
      },
      {
        question: "Do you also offer event reels or video coverage?",
        answer:
          "Yes. Event reels and video add-ons can be planned depending on the type of event and the final deliverables you need.",
      },
    ],
  },
  {
    slug: "reels-and-commercial-shoot",
    name: "Reels and Commercial Shoot",
    shortName: "Commercial Shoot",
    titlePrefix: "Reels and Commercial Photographer",
    summary:
      "Short-form content and commercial visuals for creators, brands, products, and businesses that need crisp, modern marketing assets.",
    detailedIntro:
      "For creators and businesses, visual quality directly affects trust. We create commercial photos and reels that feel modern, clean, and platform-ready while staying practical for local businesses and growing brands.",
    deliverables: [
      "Short-form reels for Instagram, WhatsApp, and ads",
      "Product, founder, and service-focused commercial visuals",
      "Visual content for local business promotion and launches",
      "Edited media formatted for social and campaign use",
    ],
    highlights: [
      "Content shaped around conversions and platform retention",
      "Useful for salons, boutiques, cafes, studios, and personal brands",
      "Fast-moving shot flow with commercial clarity",
      "Brand-friendly visuals without overcomplicating production",
    ],
    process: [
      "Creative brief around offer, audience, and posting goals",
      "Shot list for products, founder presence, and service moments",
      "Content capture in vertical and campaign-friendly formats",
      "Edit delivery for posting consistency and campaign use",
    ],
    keywords: [
      "commercial shoot",
      "brand reels",
      "instagram reels shoot",
      "business photography",
    ],
    faqs: [
      {
        question: "Who usually books reels and commercial shoots?",
        answer:
          "Local businesses, founders, creators, and service brands often book these shoots to improve their content quality and posting consistency.",
      },
      {
        question: "Can you create content specifically for Instagram Reels?",
        answer:
          "Yes. We can plan content in vertical formats with shots and pacing that work better for reels and short-form marketing.",
      },
      {
        question: "Do you shoot products as well as people?",
        answer:
          "Yes. Depending on the project, we can cover products, services, team interactions, founder portraits, and customer-facing moments.",
      },
      {
        question: "Is this useful for local businesses in Bihar?",
        answer:
          "Yes. Clean and strategic visual content can make a big difference for local businesses trying to stand out in crowded social feeds.",
      },
    ],
  },
];

export const SEO_CITIES: SeoCity[] = [
  {
    slug: "gaya",
    name: "Gaya",
    region: "Bihar",
    summary:
      "Gaya remains the home base of Sharthak Studio, making it ideal for responsive planning, venue familiarity, and smooth on-ground execution.",
    audience:
      "Couples, families, and businesses in Gaya usually prefer dependable teams that understand local venue flow, event timing, and regional wedding energy.",
    venueTypes: ["banquet halls", "open lawns", "home ceremonies", "temple-town celebrations"],
    nearbyAreas: ["Bodh Gaya", "Manpur", "Sherghati", "Tekari"],
    strengths: [
      "Strong local coordination and faster planning",
      "Experience with family-driven wedding schedules",
      "Easy access for pre-wedding and studio-style sessions",
    ],
    keywords: ["photographer in Gaya", "wedding photographer Gaya", "cinematographer Gaya"],
  },
  {
    slug: "patna",
    name: "Patna",
    region: "Bihar",
    summary:
      "Patna shoots often need polished execution, faster movement between venues, and visuals that feel modern, premium, and social-first.",
    audience:
      "Clients in Patna usually look for premium presentation, reliable team coordination, and media that works for both family memories and public sharing.",
    venueTypes: ["city banquet venues", "luxury hotels", "rooftop events", "engagement halls"],
    nearbyAreas: ["Danapur", "Phulwari", "Bihta", "Hajipur"],
    strengths: [
      "Premium framing suited for urban venues",
      "Fast coordination across multi-event schedules",
      "Content style suited for modern weddings and social reels",
    ],
    keywords: ["wedding photographer Patna", "pre wedding shoot Patna", "event photography Patna"],
  },
  {
    slug: "muzaffarpur",
    name: "Muzaffarpur",
    region: "Bihar",
    summary:
      "Muzaffarpur events often combine family warmth with large guest movement, which makes organized coverage and strong candid timing especially important.",
    audience:
      "Families and couples here usually value dependable coverage of rituals, portraits, crowd moments, and polished post-event delivery.",
    venueTypes: ["marriage halls", "community venues", "family residences", "open-air functions"],
    nearbyAreas: ["Sitamarhi", "Darbhanga", "Vaishali", "Motihari"],
    strengths: [
      "Good fit for large family celebrations",
      "Balanced ritual and portrait documentation",
      "Useful for both wedding and milestone coverage",
    ],
    keywords: ["wedding photographer Muzaffarpur", "baby shoot Muzaffarpur", "event photographer Muzaffarpur"],
  },
  {
    slug: "deoghar",
    name: "Deoghar",
    region: "Jharkhand",
    summary:
      "Deoghar projects often need a calm visual approach with strong location sense, especially for devotional, family, and destination-style coverage.",
    audience:
      "Clients in Deoghar often want polished, respectful coverage that blends atmosphere, portraiture, and meaningful family moments.",
    venueTypes: ["pilgrimage-area venues", "resort properties", "family gatherings", "traditional celebrations"],
    nearbyAreas: ["Jasidih", "Dumka", "Banka", "Madhupur"],
    strengths: [
      "Strong fit for emotional and destination-like stories",
      "Great for maternity, wedding, and family storytelling",
      "Visual approach suited to both rituals and portraits",
    ],
    keywords: ["photographer Deoghar", "wedding photographer Deoghar", "maternity shoot Deoghar"],
  },
  {
    slug: "bodh-gaya",
    name: "Bodh Gaya",
    region: "Bihar",
    summary:
      "Bodh Gaya offers a calmer visual backdrop that works especially well for pre-wedding sessions, portraits, and intimate celebration coverage.",
    audience:
      "Couples and families often choose Bodh Gaya for shoots that need quieter spaces, travel-friendly planning, and a more composed visual mood.",
    venueTypes: ["boutique stays", "outdoor backdrops", "peaceful ceremony spaces", "destination-style settings"],
    nearbyAreas: ["Gaya", "Dobhi", "Wazirganj", "Rajauli"],
    strengths: [
      "Excellent for pre-wedding and portrait-led sessions",
      "Peaceful visual mood for cinematic frames",
      "Convenient extension of Gaya-based coordination",
    ],
    keywords: ["pre wedding shoot Bodh Gaya", "photographer Bodh Gaya", "couple shoot Bodh Gaya"],
  },
  {
    slug: "nawada",
    name: "Nawada",
    region: "Bihar",
    summary:
      "Nawada events benefit from teams that can work flexibly across family venues, community setups, and fast-changing celebration timelines.",
    audience:
      "Clients in Nawada usually need practical, reliable teams that can still deliver premium-looking visuals for weddings and celebrations.",
    venueTypes: ["family venues", "community grounds", "private functions", "ceremony spaces"],
    nearbyAreas: ["Rajauli", "Hisua", "Warisaliganj", "Sheikhpura"],
    strengths: [
      "Reliable coverage for practical event conditions",
      "Strong fit for weddings and family functions",
      "Polished edits that elevate local celebrations",
    ],
    keywords: ["wedding photographer Nawada", "event photographer Nawada", "baby shoot Nawada"],
  },
  {
    slug: "aurangabad-bihar",
    name: "Aurangabad",
    region: "Bihar",
    summary:
      "Aurangabad wedding and event shoots often need balanced ritual coverage, portraits, and adaptable travel planning across nearby towns.",
    audience:
      "Families here usually want trustworthy teams that can handle traditional rituals and still create modern, high-quality visuals.",
    venueTypes: ["wedding venues", "family houses", "open grounds", "regional banquet spaces"],
    nearbyAreas: ["Daudnagar", "Rafiganj", "Dehri", "Obra"],
    strengths: [
      "Strong coverage for traditional wedding timelines",
      "Good fit for portrait and candid balance",
      "Travel-friendly planning from Gaya region",
    ],
    keywords: ["wedding photographer Aurangabad Bihar", "event photography Aurangabad Bihar"],
  },
  {
    slug: "rajgir",
    name: "Rajgir",
    region: "Bihar",
    summary:
      "Rajgir works well for scenic sessions, engagement stories, and destination-style celebrations that need a stronger sense of place.",
    audience:
      "Clients choosing Rajgir usually want portraits and films that feel a bit more cinematic, travel-oriented, and visually distinct.",
    venueTypes: ["resorts", "hillside backdrops", "engagement venues", "outdoor couple-shoot spots"],
    nearbyAreas: ["Nalanda", "Bihar Sharif", "Silao", "Hisua"],
    strengths: [
      "Excellent for scenic pre-wedding visuals",
      "Destination-style presentation within the region",
      "Useful for intimate and premium-feel sessions",
    ],
    keywords: ["pre wedding shoot Rajgir", "photographer Rajgir", "cinematographer Rajgir"],
  },
];

export function getSeoService(slug: string) {
  return SEO_SERVICES.find((service) => service.slug === slug);
}

export function getSeoCity(slug: string) {
  return SEO_CITIES.find((city) => city.slug === slug);
}

export function getAllServiceSlugs() {
  return SEO_SERVICES.map((service) => ({ service: service.slug }));
}

export function getAllCitySlugs() {
  return SEO_CITIES.map((city) => ({ city: city.slug }));
}

export function getAllServiceCitySlugs() {
  return SEO_SERVICES.flatMap((service) =>
    SEO_CITIES.map((city) => ({
      service: service.slug,
      city: city.slug,
    })),
  );
}

export function buildServicePath(serviceSlug: string) {
  return `/services/${serviceSlug}`;
}

export function buildCityPath(citySlug: string) {
  return `/locations/${citySlug}`;
}

export function buildServiceCityPath(serviceSlug: string, citySlug: string) {
  return `/services/${serviceSlug}/${citySlug}`;
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildFaqSchema(faqs: SeoFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
