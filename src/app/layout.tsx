import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { MediaProvider } from "@/context/MediaContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import ScrollToTopOnLoad from "@/components/ScrollToTopOnLoad";
import { getPublicSiteSettings } from "@/lib/server/siteSettings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Sharthak Studio",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "sharthak studio", "best wedding photographer in Bihar", "top cinematographer in Gaya",
    "wedding photography Patna", "pre-wedding shoot Muzaffarpur", "maternity shoot Deoghar",
    "event photography Bihar", "baby shoot Gaya", "premium wedding cinema",
    "sharthakstudio.com", "sharthak.studio", "cinematic wedding films India"
  ],
  authors: [{ name: "Sharthak Studio" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: "Sharthak Studio",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publicSettings = await getPublicSiteSettings();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: publicSettings.name,
    url: SITE_URL,
    email: publicSettings.email,
    telephone: publicSettings.phoneDisplay,
    sameAs: [publicSettings.instagramUrl].concat(
      publicSettings.googleBusinessProfileUrl ? [publicSettings.googleBusinessProfileUrl] : [],
    ),
    address: {
      "@type": "PostalAddress",
      streetAddress: publicSettings.addressLine1,
      addressLocality: publicSettings.city,
      addressRegion: publicSettings.state,
      postalCode: publicSettings.postalCode,
      addressCountry: publicSettings.country,
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={organizationSchema} />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <SiteSettingsProvider initialSettings={publicSettings}>
          <MediaProvider>
            <ScrollToTopOnLoad />
            {children}
          </MediaProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
