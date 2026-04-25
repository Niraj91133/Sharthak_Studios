import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SocialShare from "@/components/SocialShare";
import type { SeoFaq } from "@/lib/seo";
import type { PublicSiteSettings } from "@/lib/site";

type MediaCard = {
  src: string;
  alt: string;
};

type SummaryCard = {
  label: string;
  value: string;
};

type LinkCard = {
  href: string;
  label: string;
  description?: string;
};

type StoryCard = {
  href: string;
  title: string;
  description: string;
  image?: string;
};

type SeoLandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  intro: string[];
  highlights: string[];
  deliverables: string[];
  process: string[];
  faqs: SeoFaq[];
  links: LinkCard[];
  coverageLinks: LinkCard[];
  serviceCards: LinkCard[];
  stories: StoryCard[];
  gallery: MediaCard[];
  heroImage?: MediaCard | null;
  secondaryImage?: MediaCard | null;
  summaryCards: SummaryCard[];
  ctaLabel: string;
  ctaHref: string;
  breadcrumbJsonLd: Record<string, unknown>;
  faqJsonLd: Record<string, unknown>;
  pageJsonLd: Record<string, unknown>;
  settings: PublicSiteSettings & {
    phoneHref: string;
    whatsappHref: string;
    emailHref: string;
    instagramHandle: string;
    instagramUrl: string;
  };
};

function LinkPill({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center rounded-full border border-black/5 bg-white/40 px-5 text-[9px] font-black uppercase tracking-[0.24em] text-black backdrop-blur-md transition-all hover:bg-black hover:text-white hover:scale-105 active:scale-95"
    >
      {label}
    </Link>
  );
}

function SectionHeading({ eyebrow, title, copy, light = false }: { eyebrow: string; title: string; copy: string; light?: boolean }) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4">
        <div className={`h-[1px] w-8 ${light ? "bg-white/20" : "bg-black/10"}`} />
        <p className={`text-[9px] font-black uppercase tracking-[0.5em] ${light ? "text-white/40" : "text-black/35"}`}>{eyebrow}</p>
      </div>
      <h2 className={`mt-6 text-4xl font-black uppercase italic leading-[0.95] tracking-tight ${light ? "text-white" : "text-black"} md:text-6xl lg:text-7xl`}>
        {title}
      </h2>
      <p className={`mt-6 text-base leading-relaxed tracking-tight ${light ? "text-white/60" : "text-black/55"} md:text-lg max-w-2xl`}>
        {copy}
      </p>
    </div>
  );
}

function ServiceLinkCard({ item }: { item: LinkCard }) {
  return (
    <Link
      href={item.href}
      className="group relative border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:bg-white hover:text-black overflow-hidden"
    >
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] transition-opacity group-hover:opacity-10">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 transition-colors group-hover:text-black/30">
        Service Index
      </div>
      <h3 className="mt-4 text-2xl font-black uppercase italic tracking-tighter leading-none">{item.label}</h3>
      {item.description ? (
        <p className="mt-4 text-sm leading-6 opacity-40 group-hover:opacity-70 line-clamp-2">
          {item.description}
        </p>
      ) : null}
      <div className="mt-8 flex items-center gap-2 text-[9px] font-bold tracking-[0.3em] uppercase opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
        View Details →
      </div>
    </Link>
  );
}

export default function SeoLandingPage({
  eyebrow,
  title,
  description,
  intro,
  highlights,
  deliverables,
  process,
  faqs,
  links,
  coverageLinks,
  serviceCards,
  stories,
  gallery,
  heroImage,
  secondaryImage,
  summaryCards,
  ctaLabel,
  ctaHref,
  breadcrumbJsonLd,
  faqJsonLd,
  pageJsonLd,
  settings,
}: SeoLandingPageProps) {
  const visibleGallery = gallery.slice(0, 5);

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd, faqJsonLd, pageJsonLd]} />

      <main className="min-h-screen bg-[#faf8f5] text-black selection:bg-black selection:text-white overflow-x-hidden">
        {/* Navigation Breadcrumb - Minimal & Floating */}
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-fit px-6">
          <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/40 backdrop-blur-2xl border border-black/[0.03] shadow-2xl">
            <Link href="/" className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity">Home</Link>
            <span className="opacity-10">•</span>
            <Link href="/services" className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity">Services</Link>
            <span className="opacity-10">•</span>
            <Link href="/locations" className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity">Locations</Link>
          </div>
        </nav>

        {/* Hero Section - Bold & Immersive */}
        <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden pt-24 pb-12">
          {/* Subtle noise/grid background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:60px_60px]" />

          <div className="relative mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-[1px] bg-black/20" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40">
                    {eyebrow}
                  </p>
                </div>

                <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.88] tracking-tightest text-black">
                  {title.split(' | ')[0]}
                </h1>

                <p className="mt-8 max-w-xl text-lg leading-relaxed text-black/60 tracking-tight">
                  {description}
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex h-16 items-center justify-center bg-black px-10 text-[10px] font-black uppercase tracking-[0.3em] text-white overflow-hidden transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10">{ctaLabel}</span>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  </a>
                  <a
                    href={settings.phoneHref}
                    className="inline-flex h-16 items-center justify-center border border-black/10 px-10 text-[10px] font-black uppercase tracking-[0.3em] text-black/80 transition-all hover:bg-black/5 hover:border-black"
                  >
                    CONNECT NOW
                  </a>
                </div>

                <div className="mt-16 flex flex-wrap items-center gap-12">
                  {summaryCards.map((card) => (
                    <div key={card.label} className="space-y-1">
                      <div className="text-[9px] font-black uppercase tracking-[0.4em] text-black/30">{card.label}</div>
                      <div className="text-sm font-black uppercase tracking-widest italic">{card.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="aspect-[4/5] relative overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.15)] bg-black">
                  {heroImage ? (
                    <Image
                      src={heroImage.src}
                      alt={heroImage.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-8 -left-8 bg-white p-8 border border-black/[0.03] shadow-2xl max-w-[200px] hidden md:block">
                  <div className="text-[9px] font-black uppercase tracking-[0.4em] text-black/30 mb-2">Verified Story</div>
                  <p className="text-[11px] font-medium leading-relaxed opacity-60">Authentic frames captured exclusively by Sharthak Studio team.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intro Section - Clean & Narrative */}
        <section className="relative py-24 md:py-40 border-t border-black/[0.03]">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid gap-20 lg:grid-cols-[0.8fr_1.2fr]">
              <SectionHeading
                eyebrow="Vision"
                title="Crafting Clean Narrative Visuals"
                copy="We believe every shoot deserves a unique blueprint. Our approach combines traditional values with a modern, editorial aesthetic that lasts forever."
              />

              <div className="space-y-16">
                {intro.map((paragraph, index) => (
                  <div key={index} className="relative pl-12 border-l border-black/5">
                    <span className="absolute -left-[5px] top-0 w-2 h-2 bg-black rounded-full" />
                    <p className="text-lg md:text-xl leading-relaxed text-black/70 font-medium tracking-tight">
                      {paragraph}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Highlight Banner - Dark & Punchy */}
        <section className="bg-black text-white py-32 md:py-48 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:100px_100px]" />

          <div className="mx-auto max-w-7xl px-6 md:px-10 relative">
            <div className="grid gap-24 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div className="space-y-12">
                <SectionHeading
                  light
                  eyebrow="Signature Strengths"
                  title="Why Clients Choose Our Perspective"
                  copy="Excellence isn't an accident. It's the result of high intention, sincere effort, and intelligent execution across every single frame we deliver."
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="p-6 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                      <div className="text-[9px] font-black text-white/30 mb-4 uppercase tracking-[0.4em]">Feature 0{idx + 1}</div>
                      <p className="text-sm font-bold tracking-widest uppercase italic">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative aspect-square">
                <div className="absolute inset-0 border border-white/5 bg-white/[0.02] transform rotate-3" />
                <div className="absolute inset-0 border border-white/10 bg-white/[0.02] transform -rotate-2" />
                <div className="absolute inset-0 overflow-hidden">
                  {secondaryImage ? (
                    <Image src={secondaryImage.src} alt={secondaryImage.alt} fill className="object-cover opacity-60" />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid - Cinematic Masonry Style */}
        <section className="py-24 md:py-40">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
              <SectionHeading
                eyebrow="Portfolio"
                title="Real Moments. Real People."
                copy="Explore a curated selection from our recent coverage. Every image tells a part of a larger story."
              />
              <Link href="/services" className="text-[10px] font-black uppercase tracking-[0.4em] border-b border-black/10 pb-2 hover:border-black transition-all">Browse All Services</Link>
            </div>

            <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
              {visibleGallery.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden group bg-black ${idx === 0 ? "md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-square" : "aspect-square"
                    }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-100 group-hover:opacity-0 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deliverables & Process - Service Details */}
        <section className="bg-white py-32 md:py-48 border-y border-black/[0.03]">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid gap-24 lg:grid-cols-2">
              <div className="space-y-16">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.5em] text-black/30 mb-8">What You Receive</div>
                  <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-12">The Package Details</h3>
                  <div className="grid gap-4">
                    {deliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-6 p-6 bg-[#faf8f5] hover:bg-[#f6f2eb] transition-colors border-l-2 border-black/5">
                        <span className="text-[10px] font-black text-black/20 mt-1">0{i + 1}</span>
                        <p className="text-sm md:text-base font-medium text-black/70 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-black text-white p-12 md:p-20 relative">
                <div className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30 mb-12">The Roadmap</div>
                <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-16">Execution Process</h3>
                <div className="space-y-10">
                  {process.map((step, i) => (
                    <div key={i} className="group flex gap-8">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-black group-hover:bg-white group-hover:text-black transition-all">
                          {i + 1}
                        </div>
                        {i !== process.length - 1 && <div className="w-[1px] flex-1 bg-white/10" />}
                      </div>
                      <div className="pb-10">
                        <p className="text-sm md:text-base font-medium text-white/60 group-hover:text-white transition-colors leading-relaxed pt-2">
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discovery Section - Cross-Linking */}
        <section className="py-32 md:py-48 bg-[#faf8f5]">
          <div className="mx-auto max-w-7xl px-6 md:px-10 text-center mb-24">
            <SectionHeading
              eyebrow="Expand Horizons"
              title="Discover More Coverage"
              copy="Don't stop here. Explore our work in nearby cities or learn about our other premium visual services."
            />
          </div>

          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid gap-16 lg:grid-cols-2">
              <div className="space-y-12">
                <div className="text-[10px] font-black uppercase tracking-[0.52em] text-black/20 text-center lg:text-left">By Service Type</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {serviceCards.slice(0, 8).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group p-5 bg-white border border-black/[0.03] hover:bg-black hover:text-white transition-all text-center lg:text-left"
                    >
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-60 mb-2">Service</div>
                      <div className="text-xs font-black uppercase tracking-widest">{item.label}</div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-12">
                <div className="text-[10px] font-black uppercase tracking-[0.52em] text-black/20 text-center lg:text-left">By Local Coverage</div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {coverageLinks.map((item) => (
                    <LinkPill key={item.href} href={item.href} label={item.label} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - Clean & Accordion */}
        <section className="py-24 md:py-40 border-t border-black/[0.03] bg-white">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center mb-24">
              <div className="text-[9px] font-black uppercase tracking-[0.6em] text-black/20 mb-6">Clarifications</div>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Common Inquiries</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group border border-black/[0.05] bg-[#faf8f5]/50 open:bg-black open:text-white transition-all duration-300">
                  <summary className="cursor-pointer list-none p-8 flex items-center justify-between">
                    <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em]">{faq.question}</span>
                    <span className="text-xl font-light transform group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-8 pb-8">
                    <p className="text-sm md:text-base leading-relaxed opacity-60">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Social Footer */}
        <section className="py-24 bg-black text-white text-center border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6 space-y-12">
            <SocialShare title={title} text={description} className="justify-center" />
            <div className="h-[1px] w-24 bg-white/10 mx-auto" />
            <div className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">
              SHARTHAK STUDIO • {settings.city.toUpperCase()} • BIHAR
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
