"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  //   Github,
  //   Linkedin,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // El footer original se oculta en el dashboard y login para maximizar espacio
  if (pathname === "/login" || pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="bg-[#1E293B] text-white pt-16 pb-8 border-t-4 border-[#2D5A27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Columna 1: Branding */}
          <div>
            <div className="flex items-center mb-6">
              <Link
                href="/"
                className="flex items-center cursor-pointer group text-white "
              >
                <img
                  src="pixel_big.svg"
                  alt="logo"
                  className="h-16 text-white"
                />
              </Link>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Catálogo tecnológico diseñado para la visibilización de
              competencias y el fortalecimiento de la inserción laboral del
              Semillero Pixel (I+D en Informática).
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 bg-[#334155] rounded-sm flex items-center justify-center hover:bg-[#F37021] transition"
              >
                {/* <Github className="w-4 h-4 text-white" /> */}
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-[#334155] rounded-sm flex items-center justify-center hover:bg-[#F37021] transition"
              >
                {/* <Linkedin className="w-4 h-4 text-white" /> */}
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm border-b border-[#334155] pb-2 inline-block">
              Plataforma
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-[#F37021] text-sm transition flex items-center"
                >
                  <ChevronRight className="w-3 h-3 mr-2" /> Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-gray-400 hover:text-[#F37021] text-sm transition flex items-center"
                >
                  <ChevronRight className="w-3 h-3 mr-2" /> Explorar Talento
                </Link>
              </li>
              <li>
                <Link
                  href="/search?query=Proyecto"
                  className="text-gray-400 hover:text-[#F37021] text-sm transition flex items-center"
                >
                  <ChevronRight className="w-3 h-3 mr-2" /> Proyectos Destacados
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-[#F37021] text-sm transition flex items-center"
                >
                  <ChevronRight className="w-3 h-3 mr-2" /> Acceso Integrantes
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm border-b border-[#334155] pb-2 inline-block">
              Institución
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-400 text-sm">
                <MapPin className="w-5 h-5 mr-3 text-[#2D5A27] flex-shrink-0" />
                <span>
                  Sede Bicentenario, Popayán
                  <br />
                  Cauca, Colombia
                </span>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Mail className="w-5 h-5 mr-3 text-[#2D5A27] flex-shrink-0" />
                <span>egresados@unimayor.edu.co</span>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Phone className="w-5 h-5 mr-3 text-[#2D5A27] flex-shrink-0" />
                <span>(+57) 602 833 3390</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Suscripción / Egresados */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm border-b border-[#334155] pb-2 inline-block">
              Red de Egresados
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              ¿Buscas talento tecnológico para tu empresa? Contáctanos
              directamente.
            </p>
            <button className="w-full bg-transparent border-2 border-[#F37021] text-[#F37021] hover:bg-[#F37021] hover:text-white px-4 py-3 text-sm font-bold transition flex items-center justify-center group">
              Contactar a Pixel{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Línea inferior legal */}
        <div className="border-t border-[#334155] pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-mono">
          <p>
            © 2026 Institución Universitaria Colegio Mayor del Cauca. Todos los
            derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">
              Términos de Uso
            </a>
            <a href="#" className="hover:text-white transition">
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
