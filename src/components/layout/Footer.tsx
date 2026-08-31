"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, MapPin, Mail, Phone, ArrowRight, X } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sendSuccess, setSendSuccess] = useState(false);

  if (pathname === "/login" || pathname.startsWith("/dashboard")) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mailtoLink = `mailto:johanalvarezzz237@gmail.com?subject=${encodeURIComponent(
      `[Pixel] ${formData.subject}`,
    )}&body=${encodeURIComponent(
      `Nombre: ${formData.name}\nCorreo: ${formData.email}\n\nMensaje:\n${formData.message}`,
    )}`;

    window.location.href = mailtoLink;

    setSendSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => {
      setIsModalOpen(false);
      setSendSuccess(false);
    }, 2000);
  };

  return (
    <>
      <footer className="bg-[#1E293B] text-white pt-16 pb-8 border-t-4 border-[#2D5A27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Columna 1: Branding */}
            <div>
              <div className="flex items-center mb-6">
                <Link
                  href="/"
                  className="flex items-center cursor-pointer group text-white"
                >
                  <img
                    src="/pixel_big.svg"
                    alt="logo"
                    className="h-16 text-white"
                  />
                </Link>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Catálogo tecnológico para la visibilización de competencias del
                Semillero Pixel (I+D en Informática).
              </p>
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
                    <ChevronRight className="w-3 h-3 mr-2" /> Proyectos
                    Destacados
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
                  <Phone className="w-5 h-5 mr-3 text-[#2D5A27] flex-shrink-0" />
                  <span>(+57) 602 833 3390</span>
                </li>
              </ul>
            </div>

            {/* Columna 3: Contacto Pixel */}
            <div>
              <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm border-b border-[#334155] pb-2 inline-block">
                Contacto
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                ¿Buscas talento tecnológico para tu empresa? Contáctanos
                directamente.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-transparent border-2 border-[#F37021] text-[#F37021] hover:bg-[#F37021] hover:text-white px-4 py-3 text-sm font-bold transition flex items-center justify-center group cursor-pointer"
              >
                Contactar a Pixel{" "}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Línea inferior legal */}
          <div className="border-t border-[#334155] pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-mono">
            <p>
              © 2026 Institución Universitaria Colegio Mayor del Cauca. Todos
              los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Contacto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-lg mx-4 pixel-border p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-[#F37021] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-[#1E293B] mb-2">
              Contactar a Pixel
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              ¿Buscas talento tecnológico? Envíanos un mensaje y te
              contactaremos.
            </p>

            {sendSuccess ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Mensaje enviado exitosamente. Te contactaremos pronto.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 focus:border-[#F37021] focus:ring-1 focus:ring-[#F37021] outline-none"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Correo *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 focus:border-[#F37021] focus:ring-1 focus:ring-[#F37021] outline-none"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 focus:border-[#F37021] focus:ring-1 focus:ring-[#F37021] outline-none"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 focus:border-[#F37021] focus:ring-1 focus:ring-[#F37021] outline-none resize-none"
                    placeholder="Cuéntanos sobre tu empresa, proyecto o需求..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#F37021] text-white font-bold py-3 hover:bg-[#e06015] transition flex items-center justify-center cursor-pointer"
                >
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
