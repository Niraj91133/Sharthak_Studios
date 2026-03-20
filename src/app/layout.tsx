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
  title: "SHARTHAK STUDIO | Premium Wedding Cinema",
  description: "Luxury wedding photography and cinematography studio capturing timeless emotions with premium video editing and cinema quality.",
  keywords: ["sharthak studio", "sharthakstudio.com", "sharthak.studio", "wedding photography", "wedding cinematography", "premium wedding cinema", "wedding studio", "professional photographers India"],
  authors: [{ name: "Sharthak Studio" }],
  openGraph: {
    title: "SHARTHAK STUDIO | Premium Wedding Cinema",
    description: "Luxury wedding photography and cinematography studio capturing timeless emotions.",
    url: "https://sharthakstudio.com",
    siteName: "Sharthak Studio",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

import { MediaProvider } from "@/context/MediaContext";

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
          {children}
        </MediaProvider>
      </body>
    </html>
  );
}
