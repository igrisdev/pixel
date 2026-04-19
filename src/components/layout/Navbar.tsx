"use client"; // Necesario para Zustand y hooks de Next.js

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Consumimos el estado de Zustand
  const { userRole, logout } = useStore();

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
            <div className="w-8 h-8 mr-3 flex flex-col items-center justify-center">
              <div className="w-4 h-4 bg-[#2D5A27] mb-1 pixel-border group-hover:scale-105 transition-transform"></div>
              <div className="w-6 h-4 bg-[#F37021] pixel-border group-hover:scale-105 transition-transform"></div>
            </div>
            <span className="pixel-font text-[#2D5A27] text-sm md:text-base mt-1">
              PIXEL<span className="text-[#F37021]">PORTAFOLIO</span>
            </span>
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
            <Link
              href="#"
              className="text-[#334155] font-semibold hover:text-[#2D5A27] transition"
            >
              Semillero
            </Link>
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
