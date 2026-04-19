import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
  title: "Pixel Portafolio | UNIMAYOR",
  description:
    "Catálogo de competencias técnicas y transversales del Semillero Pixel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${pixelFont.variable} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
