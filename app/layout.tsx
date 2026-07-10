import type { Metadata } from "next";
import { headers } from "next/headers";
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

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const title = "Helios — Interactive Solar Observatory";
  const description =
    "Explore the Solar System in a live Three.js simulation with Keplerian orbits, selectable worlds, and adjustable time.";

  return {
    metadataBase: baseUrl,
    title,
    description,
    openGraph: {
      title,
      description: "A live, cinematic model of our Solar System.",
      type: "website",
      images: [{ url: new URL("/og.png", baseUrl), width: 1680, height: 944, alt: "Helios interactive Solar System observatory" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "A live, cinematic model of our Solar System.",
      images: [new URL("/og.png", baseUrl)],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
