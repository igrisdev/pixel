import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  // Página privada: no aporta nada en buscadores.
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
