import type { Metadata } from "next";
import AppContent from "./AppContent";
import JsonLd from "@/components/JsonLd";
import { DEFAULT_DESCRIPTION, DEFAULT_PRICE_RANGE, DEFAULT_TITLE, SITE_URL } from "@/lib/site";
import { getPublicSiteSettings } from "@/lib/server/siteSettings";
import { SEO_CITIES, SEO_SERVICES } from "@/lib/seo";

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
};

export default async function Home() {
  const businessDetails = await getPublicSiteSettings();
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessDetails.name,
    image: `${SITE_URL}/opengraph-image.png`,
    url: SITE_URL,
    telephone: businessDetails.phoneDisplay,
    email: businessDetails.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessDetails.addressLine1,
      addressLocality: businessDetails.city,
      addressRegion: businessDetails.state,
      postalCode: businessDetails.postalCode,
      addressCountry: businessDetails.country,
    },
    areaServed: businessDetails.serviceAreas,
    sameAs: [businessDetails.instagramUrl].concat(
      businessDetails.googleBusinessProfileUrl ? [businessDetails.googleBusinessProfileUrl] : [],
    ),
    priceRange: DEFAULT_PRICE_RANGE,
    founder: businessDetails.founder,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "20:00",
      },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.7955,
      longitude: 85.0002,
    },
    serviceType: SEO_SERVICES.map((service) => service.name),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: businessDetails.name,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "en-IN",
  };

  const homepageFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which areas does Sharthak Studio serve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sharthak Studio is based in ${businessDetails.city}, ${businessDetails.state} and serves ${SEO_CITIES.map((city) => city.name).join(", ")} and nearby areas.`,
        },
      },
      {
        "@type": "Question",
        name: "What services does Sharthak Studio offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `We offer ${SEO_SERVICES.map((service) => service.name).join(", ")} with planning support and polished final delivery.`,
        },
      },
      {
        "@type": "Question",
        name: "How can I find Sharthak Studio on Google Business Profile?",
        acceptedAnswer: {
          "@type": "Answer",
          text: businessDetails.googleBusinessProfileUrl
            ? `You can view the Google Business Profile here: ${businessDetails.googleBusinessProfileUrl}`
            : "A Google Business Profile link can be added from the admin settings once the profile is verified.",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={[localBusinessSchema, websiteSchema, homepageFaqSchema]} />
      <AppContent />
    </>
  );
}
