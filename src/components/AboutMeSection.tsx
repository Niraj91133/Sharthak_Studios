"use client";

import { useMedia } from "@/hooks/useMedia";

export default function AboutMeSection() {
    const src = useMedia("about-me-photo", "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=2000");

    return (
        <section className="relative w-full overflow-hidden bg-black flex items-center justify-center p-0" style={{ height: "1000px" }}>
            <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />

            {/* Background Image with Cinematic Gradient */}
            <div className="absolute inset-0 z-0">
                <img
                    src={src}
                    className="w-full h-full object-cover"
                    alt="Sonu Sharthak"
                />
                {/* Multi-stage gradient to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl px-8 md:px-24 flex flex-col items-start gap-12">

                <div className="space-y-4">
                    <h2
                        className="text-6xl md:text-9xl text-white"
                        style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                        About Me
                    </h2>
                </div>

                <div className="max-w-3xl space-y-8">
                    <p className="text-lg md:text-2xl font-medium leading-relaxed text-white/90 drop-shadow-md">
                        Hi, I&apos;m <span className="text-white font-black tracking-wide">Sonu Sharthak</span> — founder of Sharthak Studio, based in <span className="underline decoration-[#B6FF00]/50 decoration-2 underline-offset-8">Gaya, Bihar</span>.
                    </p>

                    <p className="text-sm md:text-xl font-normal leading-relaxed text-white/70">
                        I&apos;m a professional wedding photographer and cinematographer, specializing in cinematic storytelling, wedding films, pre-wedding shoots, baby shoots and event coverage.
                    </p>

                    <p className="text-sm md:text-xl font-normal leading-relaxed text-white/70">
                        At Sharthak Studio, we focus on capturing real emotions and turning them into timeless memories. With a professional team and our own studio setup, we deliver premium quality work trusted by clients across Gaya Bihar.
                    </p>
                </div>

                {/* Vertical Accent Line */}
                <div className="h-24 w-[2px] bg-[#B6FF00] shadow-[0_0_15px_#B6FF00]" />
            </div>

            {/* Artistic Subtle Overlay Edge */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
        </section>
    );
}
