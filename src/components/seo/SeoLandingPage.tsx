import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
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
      className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-white px-4 text-[10px] font-black uppercase tracking-[0.22em] text-black transition-colors hover:bg-black hover:text-white"
    >
      {label}
    </Link>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-[10px] font-black uppercase tracking-[0.38em] text-black/35">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-black uppercase italic tracking-tight text-black md:text-5xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-black/65 md:text-base">{copy}</p>
    </div>
  );
}

function ServiceLinkCard({ item }: { item: LinkCard }) {
  return (
    <Link
      href={item.href}
      className="group border border-black/10 bg-white p-5 transition-colors hover:bg-black hover:text-white"
    >
      <div className="text-[10px] font-black uppercase tracking-[0.32em] text-black/30 transition-colors group-hover:text-white/35">
        Explore
      </div>
      <h3 className="mt-3 text-lg font-black uppercase tracking-tight">{item.label}</h3>
      {item.description ? (
        <p className="mt-3 text-sm leading-7 text-black/65 transition-colors group-hover:text-white/70">
          {item.description}
        </p>
      ) : null}
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

      <main className="min-h-screen bg-[#f4efe8] text-black">
        <section className="relative overflow-hidden border-b border-black/8 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),rgba(244,239,232,0.45)_45%,rgba(0,0,0,0.02)_100%)]">
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="relative mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.34em] text-black/40">
              <Link href="/" className="hover:text-black">
                Home
              </Link>
              <span>/</span>
              <Link href="/services" className="hover:text-black">
                Services
              </Link>
              <span>/</span>
              <Link href="/locations" className="hover:text-black">
                Locations
              </Link>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.42em] text-black/40">
                  {eyebrow}
                </p>
                <h1 className="mt-5 max-w-5xl text-4xl font-black uppercase italic leading-[0.92] tracking-tight md:text-7xl">
                  {title}
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-black/70 md:text-lg">
                  {description}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center rounded-full border border-black bg-black px-6 text-[10px] font-black uppercase tracking-[0.26em] text-white transition-colors hover:bg-transparent hover:text-black"
                  >
                    {ctaLabel}
                  </a>
                  <a
                    href={settings.phoneHref}
                    className="inline-flex min-h-12 items-center rounded-full border border-black/15 px-6 text-[10px] font-black uppercase tracking-[0.26em] text-black/70 transition-colors hover:border-black hover:text-black"
                  >
                    Call {settings.phoneDisplay}
                  </a>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {summaryCards.map((card) => (
                    <div key={card.label} className="rounded-[28px] border border-black/10 bg-white/80 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                      <div className="text-[10px] font-black uppercase tracking-[0.32em] text-black/35">{card.label}</div>
                      <div className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-black">{card.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[320px] overflow-hidden rounded-[34px] border border-black/10 bg-black shadow-[0_32px_90px_rgba(0,0,0,0.12)]">
                  {heroImage ? (
                    <Image
                      src={heroImage.src}
                      alt={heroImage.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#111,#444)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <div className="text-[10px] font-black uppercase tracking-[0.36em] text-white/55">Visual Story</div>
                    <div className="mt-2 max-w-xs text-sm leading-7 text-white/82">
                      Premium frames selected from your uploaded portfolio so the page feels real, not templated.
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="relative min-h-[152px] overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
                    {secondaryImage ? (
                      <Image
                        src={secondaryImage.src}
                        alt={secondaryImage.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 24vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(145deg,#ddd,#b8b0a3)]" />
                    )}
                  </div>
                  <div className="rounded-[28px] border border-black/10 bg-[#111] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                    <div className="text-[10px] font-black uppercase tracking-[0.36em] text-white/35">Service Areas</div>
                    <p className="mt-4 text-sm leading-7 text-white/72">
                      {settings.serviceAreas.join(" • ")}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {coverageLinks.slice(0, 3).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-full border border-white/12 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/78 transition-colors hover:border-white hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-18">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionHeading
              eyebrow="Overview"
              title="A Cleaner Path For Visitors And Search Engines"
              copy="The layout is intentionally more visual, more navigable, and more service-aware. Visitors can understand this service quickly, browse related offers, and move deeper into local pages without the page feeling bloated."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {intro.map((paragraph, index) => (
                <div key={`${paragraph}-${index}`} className="rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
                  <div className="text-[10px] font-black uppercase tracking-[0.32em] text-black/30">0{index + 1}</div>
                  <p className="mt-4 text-sm leading-7 text-black/70">{paragraph}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-black/8 bg-[#111] text-white">
          <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-18">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Service Universe"
                title="Users Should Discover More Than One Offer"
                copy="Is page par sirf ek service nahi, pura ecosystem visible hona chahiye. Isliye related services ko ek clean discovery strip me rakha gaya hai."
              />
              <a
                href={settings.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center self-start rounded-full border border-white/15 px-6 text-[10px] font-black uppercase tracking-[0.26em] text-white/78 transition-colors hover:border-white hover:text-white"
              >
                Ask For Full Package
              </a>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {serviceCards.map((item) => (
                <ServiceLinkCard key={item.href} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-18">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <SectionHeading
                eyebrow="Portfolio Frames"
                title="Uploaded Images Now Anchor The Layout"
                copy="Yeh collage uploaded media se fill hota hai, isliye service pages ab text-only nahi lagte. Real portfolio images page ko trust aur polish dono dete hain."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:grid-rows-2">
              {visibleGallery.map((item, index) => (
                <div
                  key={`${item.src}-${index}`}
                  className={[
                    "relative overflow-hidden rounded-[30px] border border-black/10 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.08)]",
                    index === 0 ? "sm:col-span-2 min-h-[320px]" : "min-h-[210px]",
                  ].join(" ")}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={index === 0 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, 25vw"}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-black/8 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-18">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <SectionHeading
                  eyebrow="Included"
                  title="Deliverables That Feel Structured"
                  copy="Service pages ko professional feel dene ke liye deliverables aur process dono ko cleaner cards me organize kiya gaya hai."
                />
                <div className="mt-8 grid gap-4">
                  {deliverables.map((item) => (
                    <div key={item} className="rounded-[24px] border border-black/10 bg-[#f8f5f0] p-5 text-sm leading-7 text-black/72">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="rounded-[34px] border border-black/10 bg-[#111] p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.10)] md:p-8">
                  <div className="text-[10px] font-black uppercase tracking-[0.36em] text-white/35">How It Flows</div>
                  <div className="mt-8 space-y-5">
                    {process.map((item, index) => (
                      <div key={item} className="flex gap-4 border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
                        <div className="text-[11px] font-black uppercase tracking-[0.36em] text-white/35">0{index + 1}</div>
                        <p className="text-sm leading-7 text-white/72">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-[30px] border border-black/10 bg-[#efe6da] p-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.36em] text-black/35">Why Clients Book This</div>
                  <ul className="mt-5 space-y-3">
                    {highlights.map((highlight) => (
                      <li key={highlight} className="text-sm leading-7 text-black/72">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-18">
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              eyebrow="Keep Browsing"
              title="Related Pages, Nearby Cities, And Journal Stories"
              copy="Is section ka goal simple hai: user ko dead-end par chhodna nahi. Agar visitor wedding photography dekh raha hai, usse pre-wedding, cinematography, local city pages, aur related stories bhi dikhni chahiye."
            />

            <div className="grid gap-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.36em] text-black/35">Related Landing Pages</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {links.map((item) => (
                    <LinkPill key={item.href} href={item.href} label={item.label} />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.36em] text-black/35">Nearby Coverage</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {coverageLinks.map((item) => (
                    <LinkPill key={item.href} href={item.href} label={item.label} />
                  ))}
                </div>
              </div>

              {stories.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {stories.map((story) => (
                    <Link key={story.href} href={story.href} className="group overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
                      <div className="relative h-48 bg-black">
                        {story.image ? (
                          <Image
                            src={story.image}
                            alt={story.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : null}
                      </div>
                      <div className="p-5">
                        <div className="text-[10px] font-black uppercase tracking-[0.32em] text-black/30">Journal</div>
                        <h3 className="mt-3 text-lg font-black uppercase tracking-tight">{story.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-black/65">{story.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="border-t border-black/8 bg-[#111] text-white">
          <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-18">
            <SectionHeading
              eyebrow="FAQ"
              title="Common Questions"
              copy="Helpful answers are still important for users and SEO, so the FAQ stays present but visually cleaner and easier to scan on mobile."
            />

            <div className="mt-10 grid gap-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 open:bg-white/[0.06]">
                  <summary className="cursor-pointer list-none text-sm font-black uppercase tracking-[0.18em] text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-white/72">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
