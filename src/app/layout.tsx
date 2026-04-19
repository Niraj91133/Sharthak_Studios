import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHARTHAK STUDIO | BEST WEDDING PHOTOGRAPHER & CINEMATOGRAPHER | PRE-WEDDING, BABY SHOOT, MATERNITY & EVENT",
  description: "Top-rated cinematic wedding photographer & filmmaker in Bihar. Specializing in luxury weddings, pre-weddings, maternity shoots, and events across Gaya, Patna, Muzaffarpur, and Deoghar. Timeless emotions captured with premium quality.",
  keywords: [
    "sharthak studio", "best wedding photographer in Bihar", "top cinematographer in Gaya",
    "wedding photography Patna", "pre-wedding shoot Muzaffarpur", "maternity shoot Deoghar",
    "event photography Bihar", "baby shoot Gaya", "premium wedding cinema",
    "sharthakstudio.com", "sharthak.studio", "cinematic wedding films India"
  ],
  authors: [{ name: "Sharthak Studio" }],
  openGraph: {
    title: "SHARTHAK STUDIO | Best Wedding Photographer & Cinematographer in Bihar",
    description: "Capturing cinematic stories across Bihar, Gaya, and Patna. Specialized in Weddings, Pre-Weddings, & Events.",
    url: "https://sharthakstudio.com",
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
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

import { MediaProvider } from "@/context/MediaContext";
import ScrollToTopOnLoad from "@/components/ScrollToTopOnLoad";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
        suppressHydrationWarning
      >
        <MediaProvider>
          <ScrollToTopOnLoad />
          {children}
        </MediaProvider>
      </body>
    </html>
  );
}
