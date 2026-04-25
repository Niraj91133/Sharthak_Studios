import Link from "next/link";
import { SEO_CITIES, SEO_SERVICES, buildCityPath, buildServicePath, buildServiceCityPath } from "@/lib/seo";

export default function HomeSeoSection() {
  const featuredServices = SEO_SERVICES.slice(0, 4);
  const featuredCities = SEO_CITIES.slice(0, 6);

  return (
    <section className="border-y border-white/5 bg-[linear-gradient(180deg,#050505,#111)] px-6 py-16 text-white md:px-10 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.42em] text-white/30">
              Search Friendly, User Friendly
            </p>
            <h2 className="mt-5 max-w-3xl text-3xl font-black uppercase italic tracking-tight md:text-5xl">
              Explore Services, Cities, And Local Landing Pages Without Leaving The Homepage
            </h2>
            <div className="mt-7 space-y-5 text-sm leading-8 text-white/68 md:text-base">
              <p>
                Sharthak Studio is a wedding photographer and cinematographer in Gaya, Bihar serving weddings, pre-wedding shoots, maternity portraits, baby shoots, events, and reels across multiple cities. This section is intentionally crawlable so Google can read real service and location relevance directly from the homepage.
              </p>
              <p>
                Is redesign ka purpose ye hai ki visitor ko ek SEO block jaisa feel na ho. Isliye content ko service cards, city links, aur local combinations ke format me organize kiya gaya hai taaki user organically next page par move kare.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredServices.map((service, index) => (
              <Link
                key={service.slug}
                href={buildServicePath(service.slug)}
                className={[
                  "group rounded-[30px] border border-white/10 p-6 transition-colors",
                  index === 0 ? "bg-white text-black sm:col-span-2" : "bg-white/[0.03] text-white hover:bg-white hover:text-black",
                ].join(" ")}
              >
                <div className="text-[10px] font-black uppercase tracking-[0.34em] opacity-40">
                  Service
                </div>
                <h3 className="mt-3 text-2xl font-black uppercase tracking-tight">{service.shortName}</h3>
                <p className="mt-4 text-sm leading-7 opacity-75">{service.summary}</p>
                <div className="mt-5 text-[10px] font-black uppercase tracking-[0.26em] opacity-70">
                  View Page
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.36em] text-white/30">
              Browse Cities
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {featuredCities.map((city) => (
                <Link
                  key={city.slug}
                  href={buildCityPath(city.slug)}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/12 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/82 transition-colors hover:bg-white hover:text-black"
                >
                  {city.name}
                </Link>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-white/65">
              Local pages help users searching for “wedding photographer in Gaya”, “pre wedding shoot in Patna”, or “baby shoot in Muzaffarpur” discover the most relevant page faster.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white text-black p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.36em] text-black/30">
              Popular Local Paths
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {featuredServices.slice(0, 3).flatMap((service) =>
                featuredCities.slice(0, 2).map((city) => (
                  <Link
                    key={`${service.slug}-${city.slug}`}
                    href={buildServiceCityPath(service.slug, city.slug)}
                    className="rounded-[22px] border border-black/10 bg-[#f6f1ea] p-4 transition-colors hover:bg-black hover:text-white"
                  >
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] text-black/35 transition-colors hover:text-white/35">
                      Local Service
                    </div>
                    <div className="mt-2 text-sm font-black uppercase tracking-tight">
                      {service.shortName} in {city.name}
                    </div>
                  </Link>
                )),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
