import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  SITE_URL,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from "@/lib/site";

// Configuración de fuentes de Next.js
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel", // Creamos la variable CSS
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase permite que Next resuelva las URLs relativas (canónicas,
  // imágenes de Open Graph) a URLs absolutas.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    // Cada página aporta su título y se le añade la marca automáticamente.
    template: `%s | ${SITE_SHORT_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_SHORT_NAME,
  authors: [{ name: SITE_SHORT_NAME }],
  creator: SITE_SHORT_NAME,
  publisher: "Institución Universitaria Colegio Mayor del Cauca",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Datos estructurados: ayudan a Google a entender qué es el sitio y a mostrar
  // el cuadro de búsqueda y la ficha de la organización en los resultados.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        parentOrganization: {
          "@type": "CollegeOrUniversity",
          name: "Institución Universitaria Colegio Mayor del Cauca",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Popayán",
          addressRegion: "Cauca",
          addressCountry: "CO",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "es-CO",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?query={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="es">
      <body className={`${inter.className} ${pixelFont.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
