import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorar proyectos e integrantes",
  description:
    "Busca proyectos de software, artículos, ponencias y perfiles por competencia, tecnología o nombre dentro del Semillero Pixel de UNIMAYOR.",
  alternates: { canonical: "/search" },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
