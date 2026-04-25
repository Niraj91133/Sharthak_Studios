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
  buildFaqSchema,
  buildServiceCityPath,
  buildServicePath,
  getSeoService,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

type ServicePageProps = {
  params: Promise<{ service: string }>;
};

export function generateStaticParams() {
  return SEO_SERVICES.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { service: serviceSlug } = await params;
  const service = getSeoService(serviceSlug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: `${service.name} in Bihar`,
    description: `${service.summary} Explore ${service.name.toLowerCase()} by Sharthak Studio across Gaya, Patna, Muzaffarpur, Deoghar, Rajgir, and nearby areas.`,
    alternates: {
      canonical: buildServicePath(service.slug),
    },
    keywords: service.keywords,
    openGraph: {
      title: `${service.name} | Sharthak Studio`,
      description: `${service.summary} Available across Bihar with planning support, premium edits, and polished storytelling.`,
      url: `${SITE_URL}${buildServicePath(service.slug)}`,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { service: serviceSlug } = await params;
  const service = getSeoService(serviceSlug);

  if (!service) {
    notFound();
  }

  const [settings, slots, blogs] = await Promise.all([
    getPublicSiteSettings(),
    getPublishedMediaSlots(),
    getAllBlogs(),
  ]);
  const visualPack = selectMediaForService(slots, service);

  const intro = [
    `${service.name} by ${settings.name} is built for clients who want clarity, polish, and a dependable visual team. ${service.detailedIntro}`,
    `Because ${settings.name} is based in ${settings.city}, ${settings.state}, the team can also coordinate smoothly across nearby locations like ${settings.serviceAreas.slice(0, 4).join(", ")} and surrounding parts of Bihar.`,
    `This page exists to make the service easier to discover in Google, but the promise behind it is practical: clear communication, thoughtful planning, and a final output that feels premium without looking generic.`,
  ];

  const links = SEO_SERVICES.filter((entry) => entry.slug !== service.slug)
    .slice(0, 6)
    .map((entry) => ({
      href: buildServicePath(entry.slug),
      label: entry.shortName,
      description: entry.summary,
    }));

  const coverageLinks = SEO_CITIES.slice(0, 8).map((city) => ({
    href: buildServiceCityPath(service.slug, city.slug),
    label: `${service.shortName} in ${city.name}`,
    description: city.summary,
  }));

  const serviceCards = SEO_SERVICES.slice(0, 8).map((entry) => ({
    href: buildServicePath(entry.slug),
    label: entry.shortName,
    description: entry.summary,
  }));

  const stories = blogs
    .filter((blog) => {
      const haystack = `${blog.title} ${blog.excerpt} ${blog.category}`.toLowerCase();
      return service.keywords.some((keyword) => haystack.includes(keyword.toLowerCase())) || haystack.includes(service.shortName.toLowerCase());
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
  ]);

  const faqJsonLd = buildFaqSchema(service.faqs);

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.name} by ${settings.name}`,
    description: service.summary,
    provider: {
      "@type": "LocalBusiness",
      name: settings.name,
      areaServed: settings.serviceAreas,
      telephone: settings.phoneDisplay,
      email: settings.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: settings.city,
        addressRegion: settings.state,
        postalCode: settings.postalCode,
        addressCountry: settings.country,
      },
    },
    serviceType: service.name,
    areaServed: SEO_CITIES.map((city) => city.name),
    url: `${SITE_URL}${buildServicePath(service.slug)}`,
  };

  return (
    <SeoLandingPage
      eyebrow={`Service Page • ${service.titlePrefix}`}
      title={`${service.name} In Gaya, Bihar And Nearby Cities`}
      description={`${service.summary} We serve couples, families, and businesses across Bihar with thoughtful planning, polished delivery, and reliable communication.`}
      intro={intro}
      highlights={service.highlights}
      deliverables={service.deliverables}
      process={service.process}
      faqs={service.faqs}
      links={links}
      coverageLinks={coverageLinks}
      serviceCards={serviceCards}
      stories={stories}
      gallery={visualPack.gallery.map((item, index) => ({
        src: item.uploadedFileUrl,
        alt: `${service.name} portfolio image ${index + 1} by ${settings.name}`,
      }))}
      heroImage={visualPack.hero ? { src: visualPack.hero.uploadedFileUrl, alt: `${service.name} hero image by ${settings.name}` } : null}
      secondaryImage={visualPack.secondary ? { src: visualPack.secondary.uploadedFileUrl, alt: `${service.name} featured portfolio image by ${settings.name}` } : null}
      summaryCards={[
        { label: "Base", value: `${settings.city}, ${settings.state}` },
        { label: "Best For", value: service.shortName },
        { label: "Coverage", value: `${SEO_CITIES.length}+ city pages` },
      ]}
      ctaLabel={`Book ${service.shortName}`}
      ctaHref={settings.whatsappHref}
      breadcrumbJsonLd={breadcrumbJsonLd}
      faqJsonLd={faqJsonLd}
      pageJsonLd={pageJsonLd}
      settings={settings}
    />
  );
}
