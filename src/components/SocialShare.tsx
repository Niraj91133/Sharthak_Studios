"use client";

import { useMemo, useState } from "react";

type SocialShareProps = {
  title: string;
  text?: string;
  className?: string;
};

export default function SocialShare({ title, text, className = "" }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const links = useMemo(() => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(text || title);

    return {
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };
  }, [shareUrl, text, title]);

  async function handleNativeShare() {
    if (typeof navigator === "undefined" || !navigator.share) return;
    await navigator.share({ title, text, url: shareUrl });
  }

  async function handleCopy() {
    if (!shareUrl || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={className}>
      <div className="text-[10px] font-black uppercase tracking-[0.34em] text-current/40">Share</div>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex min-h-10 items-center rounded-full border border-current/15 px-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:bg-current hover:text-white"
        >
          Share
        </button>
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center rounded-full border border-current/15 px-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:bg-current hover:text-white"
        >
          WhatsApp
        </a>
        <a
          href={links.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center rounded-full border border-current/15 px-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:bg-current hover:text-white"
        >
          X
        </a>
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center rounded-full border border-current/15 px-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:bg-current hover:text-white"
        >
          LinkedIn
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-10 items-center rounded-full border border-current/15 px-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:bg-current hover:text-white"
        >
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
