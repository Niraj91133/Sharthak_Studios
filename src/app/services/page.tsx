import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SEO_SERVICES, buildBreadcrumbSchema, buildServicePath } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Photography & Cinematography Services | Sharthak Studio",
  description:
    "Explore Sharthak Studio services for wedding photography, cinematography, pre-wedding shoots, baby shoots, maternity portraits, event coverage, and reels across Bihar.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Photography & Cinematography Services | Sharthak Studio",
    description:
      "Explore premium visual storytelling services from Sharthak Studio across weddings, films, pre-wedding shoots, events, maternity, baby shoots, and brand reels.",
    url: `${SITE_URL}/services`,
  },
};

export default function ServicesIndexPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <main className="min-h-screen bg-black px-6 py-16 text-white md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-black uppercase tracking-[0.42em] text-white/30">
            Service Index
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-black uppercase italic tracking-tight md:text-7xl">
            Explore Every Core Service From Sharthak Studio
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/68 md:text-lg">
            These pages are built to help visitors and search engines understand exactly what Sharthak Studio offers across weddings, films, pre-wedding stories, maternity portraits, baby shoots, events, and commercial reels.
          </p>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {SEO_SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={buildServicePath(service.slug)}
                className="border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
              >
                <div className="text-[10px] font-black uppercase tracking-[0.34em] text-white/30">
                  {service.titlePrefix}
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase tracking-tight">
                  {service.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/68">{service.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
