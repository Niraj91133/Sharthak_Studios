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
  buildServicePath,
  getAllServiceCitySlugs,
  getSeoCity,
  getSeoService,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

type ServiceCityPageProps = {
  params: Promise<{ service: string; city: string }>;
};

export function generateStaticParams() {
  return getAllServiceCitySlugs();
}

export async function generateMetadata({ params }: ServiceCityPageProps): Promise<Metadata> {
  const { service: serviceSlug, city: citySlug } = await params;
  const service = getSeoService(serviceSlug);
  const city = getSeoCity(citySlug);

  if (!service || !city) {
    return { title: "Page Not Found" };
  }

  const title = `${service.titlePrefix} in ${city.name}, ${city.region} | Sharthak Studio`;
  const description = `${service.summary} Dedicated ${service.shortName.toLowerCase()} coverage in ${city.name}, ${city.region} with local planning, polished delivery, and strong storytelling.`;

  return {
    title,
    description,
    alternates: {
      canonical: buildServiceCityPath(service.slug, city.slug),
    },
    keywords: [...service.keywords, ...city.keywords],
    openGraph: {
      title: `${title} | Sharthak Studio`,
      description,
      url: `${SITE_URL}${buildServiceCityPath(service.slug, city.slug)}`,
    },
  };
}

export default async function ServiceCityPage({ params }: ServiceCityPageProps) {
  const { service: serviceSlug, city: citySlug } = await params;
  const service = getSeoService(serviceSlug);
  const city = getSeoCity(citySlug);

  if (!service || !city) {
    notFound();
  }

  const [settings, slots, blogs] = await Promise.all([
    getPublicSiteSettings(),
    getPublishedMediaSlots(),
    getAllBlogs(),
  ]);
  const visualPack = selectMediaForService(slots, service, city.name);

  const localFaqs = [
    {
      question: `Do you offer ${service.shortName.toLowerCase()} in ${city.name}?`,
      answer: `Yes. ${settings.name} offers ${service.shortName.toLowerCase()} in ${city.name}, with planning tailored to the venue style, event schedule, and visual goals of the client.`,
    },
    {
      question: `Why is this page specific to ${city.name}?`,
      answer: `A dedicated page helps visitors searching for ${service.titlePrefix.toLowerCase()} in ${city.name} find locally relevant information instead of only a generic service page.`,
    },
    {
      question: `Can you also cover nearby areas around ${city.name}?`,
      answer: `Yes. Projects can often be planned across ${city.nearbyAreas.join(", ")} and other nearby areas depending on schedule, distance, and event structure.`,
    },
    {
      question: `What makes Sharthak Studio suitable for ${service.shortName.toLowerCase()} in ${city.name}?`,
      answer: `${settings.name} combines local-region familiarity, premium editing, candid storytelling, and clear planning support so the final work feels polished and practical for clients in ${city.name}.`,
    },
  ];

  const intro = [
    `${service.name} in ${city.name}, ${city.region} should feel locally relevant, visually premium, and easy to plan. ${city.summary}`,
    `${service.detailedIntro} In ${city.name}, this often means adapting to ${city.venueTypes.join(", ")} while still delivering a strong balance of candid, portrait, and storytelling frames.`,
    `This page is intentionally detailed to strengthen SEO for ${service.titlePrefix.toLowerCase()} in ${city.name}, but the user-facing goal is simple: make it easy for clients in ${city.name} to understand the kind of work ${settings.name} can deliver.`,
  ];

  const links = [
    {
      href: buildServicePath(service.slug),
      label: `${service.shortName} Overview`,
      description: service.summary,
    },
    {
      href: buildCityPath(city.slug),
      label: `${city.name} Coverage`,
      description: city.summary,
    },
    ...SEO_SERVICES.filter((entry) => entry.slug !== service.slug)
      .slice(0, 3)
      .map((entry) => ({
        href: buildServiceCityPath(entry.slug, city.slug),
        label: `${entry.shortName} in ${city.name}`,
        description: entry.summary,
      })),
  ];

  const coverageLinks = SEO_CITIES.filter((entry) => entry.slug !== city.slug)
    .slice(0, 6)
    .map((entry) => ({
      href: buildServiceCityPath(service.slug, entry.slug),
      label: `${service.shortName} in ${entry.name}`,
      description: entry.summary,
    }));

  const serviceCards = SEO_SERVICES.slice(0, 8).map((entry) => ({
    href: buildServiceCityPath(entry.slug, city.slug),
    label: `${entry.shortName} in ${city.name}`,
    description: entry.summary,
  }));

  const stories = blogs
    .filter((blog) => {
      const haystack = `${blog.title} ${blog.excerpt} ${blog.category}`.toLowerCase();
      return (
        service.keywords.some((keyword) => haystack.includes(keyword.toLowerCase())) ||
        haystack.includes(service.shortName.toLowerCase()) ||
        haystack.includes(city.name.toLowerCase())
      );
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
    { name: "Services", path: "/services" },
    { name: service.name, path: buildServicePath(service.slug) },
    { name: city.name, path: buildServiceCityPath(service.slug, city.slug) },
  ]);

  const faqJsonLd = buildFaqSchema(localFaqs);

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.name} in ${city.name}`,
    description: `${service.summary} Available in ${city.name}, ${city.region}.`,
    provider: {
      "@type": "LocalBusiness",
      name: settings.name,
      telephone: settings.phoneDisplay,
      email: settings.email,
      sameAs: [settings.instagramUrl],
    },
    areaServed: {
      "@type": "City",
      name: city.name,
    },
    serviceType: service.name,
    url: `${SITE_URL}${buildServiceCityPath(service.slug, city.slug)}`,
  };

  return (
    <SeoLandingPage
      eyebrow={`Local Service Page • ${service.shortName} in ${city.name}`}
      title={`${service.titlePrefix} In ${city.name}, ${city.region}`}
      description={`${service.summary} Built for clients searching specifically in ${city.name}, with nearby support across ${city.nearbyAreas.join(", ")} and the wider region.`}
      intro={intro}
      highlights={[...service.highlights.slice(0, 3), ...city.strengths.slice(0, 1)]}
      deliverables={[
        ...service.deliverables.slice(0, 3),
        `${service.shortName} planning adapted for ${city.name} venue types such as ${city.venueTypes.join(", ")}`,
      ]}
      process={[
        `Briefing for ${city.name} schedule, travel, and venue conditions`,
        ...service.process.slice(1, 4),
      ]}
      faqs={localFaqs}
      links={links}
      coverageLinks={coverageLinks}
      serviceCards={serviceCards}
      stories={stories}
      gallery={visualPack.gallery.map((item, index) => ({
        src: item.uploadedFileUrl,
        alt: `${service.name} in ${city.name} portfolio image ${index + 1}`,
      }))}
      heroImage={visualPack.hero ? { src: visualPack.hero.uploadedFileUrl, alt: `${service.name} in ${city.name} hero image` } : null}
      secondaryImage={visualPack.secondary ? { src: visualPack.secondary.uploadedFileUrl, alt: `${service.name} in ${city.name} feature image` } : null}
      summaryCards={[
        { label: "Service", value: service.shortName },
        { label: "City", value: city.name },
        { label: "Nearby", value: city.nearbyAreas.slice(0, 2).join(" • ") },
      ]}
      ctaLabel={`Book ${service.shortName} in ${city.name}`}
      ctaHref={settings.whatsappHref}
      breadcrumbJsonLd={breadcrumbJsonLd}
      faqJsonLd={faqJsonLd}
      pageJsonLd={pageJsonLd}
      settings={settings}
    />
  );
}
