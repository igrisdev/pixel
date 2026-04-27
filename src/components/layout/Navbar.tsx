"use client"; // Necesario para Zustand y hooks de Next.js

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Consumimos el estado de Zustand
  const { userRole, logout } = useAuthStore();

  // No mostramos el Navbar en la página de Login
  if (pathname === "/login") return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#F8F9FA] border-b-2 border-[#1E293B] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo (Redirige al inicio) */}
          <Link href="/" className="flex items-center cursor-pointer group">
            <img src="pixel_normal.svg" alt="logo" className="h-10" />
          </Link>

          {/* Links Centrales */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`font-semibold transition hover:text-[#2D5A27] ${pathname === "/" ? "text-[#2D5A27]" : "text-[#334155]"}`}
            >
              Inicio
            </Link>
            <Link
              href="/search"
              className={`font-semibold transition hover:text-[#2D5A27] ${pathname === "/search" ? "text-[#2D5A27]" : "text-[#334155]"}`}
            >
              Explorar
            </Link>
            {/* <Link
              href="#"
              className="text-[#334155] font-semibold hover:text-[#2D5A27] transition"
            >
              Semillero
            </Link> */}
          </div>

          {/* Menú de Usuario / Login */}
          <div className="flex items-center space-x-4">
            {userRole ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-[#2D5A27] font-bold text-sm flex items-center hover:text-[#F37021] transition"
                >
                  <User className="w-4 h-4 mr-2" /> Mi Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 transition"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="pixel-border-accent bg-[#F37021] text-white px-4 py-2 text-sm font-bold hover:bg-[#e06015] hover-lift"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
