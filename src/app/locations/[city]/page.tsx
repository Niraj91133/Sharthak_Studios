import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { getAllBlogs } from "@/lib/server/publicSiteData";
import { getPublishedMediaSlots, selectMediaForService } from "@/lib/server/publicMediaSlots";
import { getPublicSiteSettings } from "@/lib/server/siteSettings";
import {
  SEO_CITIES,
  SEO_SERVICES,
  buildBreadcrumbSchema,
  buildCityPath,
  buildFaqSchema,
  buildServiceCityPath,
  getSeoCity,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

type CityPageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return SEO_CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getSeoCity(citySlug);

  if (!city) {
    return { title: "Location Not Found" };
  }

  return {
    title: `Photographer in ${city.name}, ${city.region}`,
    description: `${city.summary} Explore wedding photography, cinematography, pre-wedding, maternity, baby, event, and reels coverage in ${city.name}.`,
    alternates: {
      canonical: buildCityPath(city.slug),
    },
    keywords: city.keywords,
    openGraph: {
      title: `Photographer in ${city.name} | Sharthak Studio`,
      description: `${city.summary} Local coverage for weddings, films, events, maternity, baby shoots, and commercial content.`,
      url: `${SITE_URL}${buildCityPath(city.slug)}`,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { city: citySlug } = await params;
  const city = getSeoCity(citySlug);

  if (!city) {
    notFound();
  }

  const [settings, slots, blogs] = await Promise.all([
    getPublicSiteSettings(),
    getPublishedMediaSlots(),
    getAllBlogs(),
  ]);
  const heroService = SEO_SERVICES[0];
  const visualPack = selectMediaForService(slots, heroService, city.name);

  const cityFaqs = [
    {
      question: `Do you provide photography and cinematography in ${city.name}?`,
      answer: `Yes. ${settings.name} covers ${city.name} for wedding photography, wedding films, pre-wedding shoots, baby shoots, maternity portraits, events, and selected commercial projects based on schedule.`,
    },
    {
      question: `What kinds of shoots are most common in ${city.name}?`,
      answer: `Clients in ${city.name} most often book wedding coverage, pre-wedding sessions, family events, and portrait-led shoots that need polished editing and dependable team coordination.`,
    },
    {
      question: `Can you travel to nearby areas around ${city.name}?`,
      answer: `Yes. Nearby areas such as ${city.nearbyAreas.join(", ")} can be planned as part of the same booking depending on event timing and logistics.`,
    },
    {
      question: `Why use a dedicated city page for SEO?`,
      answer: `A location page helps search engines understand that the service is relevant to people searching specifically for photographers or cinematographers in ${city.name}, which can improve local discoverability.`,
    },
  ];

  const intro = [
    `${city.summary} ${city.audience}`,
    `In ${city.name}, we usually work across ${city.venueTypes.join(", ")}. That means the visual approach has to stay flexible while still feeling premium and well-directed.`,
    `This location page supports local SEO, but it also gives visitors a clearer idea of how ${settings.name} approaches real shoots in ${city.name} and nearby places such as ${city.nearbyAreas.join(", ")}.`,
  ];

  const links = SEO_CITIES.filter((entry) => entry.slug !== city.slug)
    .slice(0, 6)
    .map((entry) => ({
      href: buildCityPath(entry.slug),
      label: `${entry.name} Coverage`,
      description: entry.summary,
    }));

  const coverageLinks = SEO_SERVICES.slice(0, 7).map((service) => ({
    href: buildServiceCityPath(service.slug, city.slug),
    label: `${service.shortName} in ${city.name}`,
    description: service.summary,
  }));

  const serviceCards = SEO_SERVICES.slice(0, 8).map((service) => ({
    href: buildServiceCityPath(service.slug, city.slug),
    label: `${service.shortName} in ${city.name}`,
    description: service.summary,
  }));

  const stories = blogs
    .filter((blog) => {
      const haystack = `${blog.title} ${blog.excerpt} ${blog.category}`.toLowerCase();
      return haystack.includes(city.name.toLowerCase()) || city.nearbyAreas.some((area) => haystack.includes(area.toLowerCase()));
    })
    .slice(0, 3)
    .map((blog) => ({
      href: `/blog/${blog.id}`,
      title: blog.title,
      description: blog.excerpt,
      image: blog.image,
    }));

  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: city.name, path: buildCityPath(city.slug) },
  ]);

  const faqJsonLd = buildFaqSchema(cityFaqs);

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${settings.name} in ${city.name}`,
    description: city.summary,
    areaServed: [city.name, ...city.nearbyAreas],
    telephone: settings.phoneDisplay,
    email: settings.email,
    url: `${SITE_URL}${buildCityPath(city.slug)}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.city,
      addressRegion: settings.state,
      postalCode: settings.postalCode,
      addressCountry: settings.country,
    },
    sameAs: [settings.instagramUrl],
    serviceArea: {
      "@type": "Place",
      name: city.name,
    },
  };

  return (
    <SeoLandingPage
      eyebrow={`Location Page • ${city.name}, ${city.region}`}
      title={`Photographer In ${city.name}, ${city.region}`}
      description={`Explore premium wedding photography, cinematography, event coverage, pre-wedding, baby, maternity, and reels support in ${city.name}. ${city.strengths.join(" • ")}.`}
      intro={intro}
      highlights={city.strengths}
      deliverables={[
        `Wedding, pre-wedding, maternity, baby, event, and reels coverage options in ${city.name}`,
        `Visual planning that fits ${city.name} venues such as ${city.venueTypes.join(", ")}`,
        `Coverage support for nearby areas like ${city.nearbyAreas.join(", ")}`,
        `Edited images and films suitable for albums, announcements, and social sharing`,
      ]}
      process={[
        `Schedule discussion for ${city.name} venue flow and travel timing`,
        "Coverage planning around rituals, portraits, or campaign goals",
        "Shoot execution with a balance of candid moments and directed frames",
        "Edited delivery designed for both memory preservation and online sharing",
      ]}
      faqs={cityFaqs}
      links={links}
      coverageLinks={coverageLinks}
      serviceCards={serviceCards}
      stories={stories}
      gallery={visualPack.gallery.map((item, index) => ({
        src: item.uploadedFileUrl,
        alt: `${city.name} portfolio image ${index + 1} from ${settings.name}`,
      }))}
      heroImage={visualPack.hero ? { src: visualPack.hero.uploadedFileUrl, alt: `${settings.name} portfolio image for ${city.name}` } : null}
      secondaryImage={visualPack.secondary ? { src: visualPack.secondary.uploadedFileUrl, alt: `${city.name} location showcase by ${settings.name}` } : null}
      summaryCards={[
        { label: "Location", value: `${city.name}, ${city.region}` },
        { label: "Nearby", value: city.nearbyAreas.slice(0, 2).join(" • ") },
        { label: "Venue Fit", value: city.venueTypes[0] || "Events" },
      ]}
      ctaLabel={`Check ${city.name} Availability`}
      ctaHref={settings.whatsappHref}
      breadcrumbJsonLd={breadcrumbJsonLd}
      faqJsonLd={faqJsonLd}
      pageJsonLd={pageJsonLd}
      settings={settings}
    />
  );
}
