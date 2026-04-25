import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SEO_CITIES, buildBreadcrumbSchema, buildCityPath } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Locations We Serve",
  description:
    "Discover the city-specific photography and cinematography pages Sharthak Studio serves across Gaya, Patna, Muzaffarpur, Bodh Gaya, Deoghar, Rajgir, and nearby regions.",
  alternates: {
    canonical: "/locations",
  },
  openGraph: {
    title: "Locations We Serve | Sharthak Studio",
    description:
      "Browse city-specific photography, wedding film, pre-wedding, event, maternity, and baby shoot pages served by Sharthak Studio.",
    url: `${SITE_URL}/locations`,
  },
};

export default function LocationsIndexPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <main className="min-h-screen bg-black px-6 py-16 text-white md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-black uppercase tracking-[0.42em] text-white/30">
            Location Index
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-black uppercase italic tracking-tight md:text-7xl">
            City Pages Built For Local Search Across Bihar
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/68 md:text-lg">
            These location pages improve local relevance for search terms like wedding photographer in Gaya, pre wedding shoot in Patna, or baby shoot in Muzaffarpur while keeping the design aligned with the rest of the site.
          </p>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {SEO_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={buildCityPath(city.slug)}
                className="border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
              >
                <div className="text-[10px] font-black uppercase tracking-[0.34em] text-white/30">
                  {city.region}
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase tracking-tight">
                  {city.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/68">{city.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
