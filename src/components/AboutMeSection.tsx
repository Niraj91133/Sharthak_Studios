"use client";

import { useMedia } from "@/hooks/useMedia";

export default function AboutMeSection() {
    const src = useMedia("about-me-photo", "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=2000");

    return (
        <section className="relative w-full bg-black flex items-center justify-center p-0 overflow-hidden" style={{ height: "900px" }}>
            <div className="max-w-[1400px] w-full h-full grid grid-cols-1 md:grid-cols-2 items-center">

                {/* Left Side: Portrait Image */}
                <div className="relative h-full w-full overflow-hidden group">
                    <img
                        src={src}
                        className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000 opacity-90 group-hover:opacity-100"
                        alt="Sonu Sharthak"
                    />
                    {/* Artistic Shadow Fade to Black */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                </div>

                {/* Right Side: Content Area */}
                <div className="relative z-10 px-8 md:px-20 flex flex-col items-start gap-10">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tightest text-white uppercase leading-none">
                            About Me
                        </h2>
                        <div className="h-0.5 w-12 bg-white/20" />
                    </div>

                    <div className="space-y-8 max-w-xl text-left">
                        <p className="text-xl md:text-2xl font-bold leading-tight text-white/90">
                            Hi, I&apos;m <span className="text-white font-black underline decoration-white/20 underline-offset-8">Sonu Sharthak</span> — founder of Sharthak Studio, based in Gaya, Bihar.
                        </p>

                        <p className="text-sm md:text-lg font-medium leading-relaxed text-white/50">
                            I&apos;m a professional wedding photographer and cinematographer, specializing in cinematic storytelling, wedding films, pre-wedding shoots, baby shoots and event coverage.
                        </p>

                        <p className="text-sm md:text-lg font-medium leading-relaxed text-white/50">
                            At Sharthak Studio, we focus on capturing real emotions and turning them into timeless memories. With a professional team and our own studio setup, we deliver premium quality work trusted by clients across Gaya Bihar.
                        </p>
                    </div>

                    {/* Simple Bottom Accent */}
                    <div className="flex items-center gap-4 opacity-20">
                        <div className="w-12 h-px bg-white" />
                        <span className="text-[10px] font-black tracking-[0.5em] uppercase">Sharthak Studio</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
