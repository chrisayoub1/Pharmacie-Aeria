import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Preloader } from "@/components/site/preloader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const SITE_URL = "https://pharmacie-aeria.ma";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Pharmacie Aeria | Pharmacie à Casablanca",
  description:
    "Pharmacie Aeria à Aeria Mall, Casablanca. Découvrez notre pharmacie, nos produits de santé et de parapharmacie et contactez-nous.",
  keywords: [
    "pharmacie Casablanca",
    "pharmacie Aeria Mall",
    "parapharmacie Casablanca",
    "pharmacie de proximité",
    "conseil pharmaceutique",
    "Pharmacie Aeria",
  ],
  authors: [{ name: "Pharmacie Aeria" }],
  creator: "Pharmacie Aeria",
  publisher: "Pharmacie Aeria",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Pharmacie Aeria | Pharmacie à Casablanca",
    description:
      "Pharmacie Aeria à Aeria Mall, Casablanca. Votre santé, notre priorité.",
    url: SITE_URL,
    siteName: "Pharmacie Aeria",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pharmacie Aeria — Aeria Mall, Casablanca",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pharmacie Aeria | Pharmacie à Casablanca",
    description:
      "Pharmacie Aeria à Aeria Mall, Casablanca. Votre santé, notre priorité.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Pharmacy",
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Pharmacy",
  name: "Pharmacie Aeria",
  description:
    "Pharmacie de proximité à Aeria Mall, Casablanca. Produits de santé, parapharmacie et conseil pharmaceutique.",
  image: `${SITE_URL}/og-image.png`,
  logo: `${SITE_URL}/icon-512.png`,
  telephone: "+212529122323",
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Aeria Mall",
    addressLocality: "Casablanca",
    postalCode: "20000",
    addressCountry: "MA",
  },
  areaServed: "Casablanca",
  currenciesAccepted: "MAD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f766e" />
      </head>
      <body
        className={`${inter.variable} ${fraunces.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Preloader />
        {children}
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
