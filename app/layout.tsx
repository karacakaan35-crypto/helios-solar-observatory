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
  const title = "Helios — Etkileşimli Güneş Gözlemevi";
  const description =
    "Güneş Sistemi’ni Kepler yörüngeleri, seçilebilir gezegenler ve ayarlanabilir zamanla çalışan canlı bir Three.js simülasyonunda keşfedin.";

  return {
    metadataBase: baseUrl,
    title,
    description,
    openGraph: {
      title,
      description: "Güneş Sistemimizin canlı ve sinematik bir modeli.",
      type: "website",
      images: [{ url: new URL("/og-v2.jpg", baseUrl), width: 1200, height: 675, alt: "Helios etkileşimli Güneş Sistemi gözlemevi — 19 Mayıs 2081" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "Güneş Sistemimizin canlı ve sinematik bir modeli.",
      images: [new URL("/og-v2.jpg", baseUrl)],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
