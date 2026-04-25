import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white md:px-10 md:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="text-[10px] font-black uppercase tracking-[0.42em] text-white/30">
          404
        </p>
        <h1 className="mt-5 text-4xl font-black uppercase italic tracking-tight md:text-7xl">
          This Page Is Missing, But The Story Is Still Here
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
          The URL may have changed or the page may not exist yet. Explore the service and location pages below to keep browsing Sharthak Studio.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center border border-white bg-white px-6 text-[10px] font-black uppercase tracking-[0.26em] text-black transition-colors hover:bg-transparent hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="inline-flex min-h-12 items-center border border-white/15 px-6 text-[10px] font-black uppercase tracking-[0.26em] text-white/76 transition-colors hover:border-white hover:text-white"
          >
            Services
          </Link>
          <Link
            href="/locations"
            className="inline-flex min-h-12 items-center border border-white/15 px-6 text-[10px] font-black uppercase tracking-[0.26em] text-white/76 transition-colors hover:border-white hover:text-white"
          >
            Locations
          </Link>
          <Link
            href="/blog"
            className="inline-flex min-h-12 items-center border border-white/15 px-6 text-[10px] font-black uppercase tracking-[0.26em] text-white/76 transition-colors hover:border-white hover:text-white"
          >
            Blog
          </Link>
        </div>
      </div>
    </main>
  );
}
