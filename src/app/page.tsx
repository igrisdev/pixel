"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import StudentCard from "@/components/ui/StudentCard";
import ProjectCard from "@/components/ui/ProjectCard";
import EscalatorCard from "@/components/ui/EscalatorCard";
import gsap from "gsap"; // Importamos GSAP nativamente desde npm

export default function HomePage() {
  const router = useRouter();
  const { students, projects } = useStore();
  const [searchInput, setSearchInput] = useState("");

  // Referencias para GSAP
  const escalatorRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  // Asegurarnos de que solo renderizamos talento activo
  const activeStudents = students.filter((s) => !s.vetado);

  // Lógica de Búsqueda
  const handleSearchSubmit = () => {
    if (searchInput.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchInput)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const handleQuickFilter = (badge: string) => {
    router.push(`/search?query=${encodeURIComponent(badge)}`);
  };

  // Efecto GSAP - Animación Escalera
  useEffect(() => {
    if (escalatorRef.current) {
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(escalatorRef.current, {
        yPercent: -50,
        ease: "none",
        duration: 20,
      });
      return () => {
        tl.kill();
      };
    }
  }, [students]);

  // Efecto GSAP - Contadores
  useEffect(() => {
    if (metricsRef.current) {
      const targets = metricsRef.current.querySelectorAll(".counter");
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            targets.forEach((target) => {
              const endValue = target.getAttribute("data-value");
              gsap.fromTo(
                target,
                { innerHTML: 0 },
                {
                  innerHTML: endValue,
                  duration: 2,
                  ease: "power2.out",
                  snap: { innerHTML: 1 },
                  onUpdate: function () {
                    target.innerHTML =
                      Math.round(Number(this.targets()[0].innerHTML)) + "+";
                  },
                },
              );
            });
            observer.disconnect();
          }
        });
      });
      observer.observe(metricsRef.current);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <main>
      {/* 1. HERO SECTION & BUSCADOR */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="col-span-1 lg:col-span-7">
              <div className="inline-block bg-[#1E293B] text-white px-3 py-1 text-xs font-mono mb-6 pixel-border">
                V.2026 - SEMILLERO PIXEL
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D5A27] tracking-tight mb-4 flex items-center gap-3 whitespace-nowrap">
                Buscador de{" "}
                <span className="text-[#F37021] pixel-font text-2xl md:text-3xl lg:text-4xl mt-2">
                  TALENTO
                </span>
              </h1>
              <p className="text-lg text-[#334155] mb-10 max-w-xl">
                Explora el catálogo de competencias y perfiles tecnológicos de
                UNIMAYOR.
              </p>

              {/* Input de Búsqueda */}
              <div className="bg-white p-2 pixel-border flex items-center max-w-xl shadow-lg relative z-20">
                <Search className="text-[#2D5A27] w-6 h-6 ml-3 mr-2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar tecnología, rol o nombre..."
                  className="w-full py-3 px-2 outline-none text-[#334155] font-medium bg-transparent"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="bg-[#2D5A27] text-white px-6 py-3 font-bold hover:bg-[#1f3f1b] transition"
                >
                  Buscar
                </button>
              </div>

              {/* Filtros Rápidos */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-sm font-semibold text-[#334155] mr-2 mt-1">
                  Filtros rápidos:
                </span>
                {["React", "Node.js", "Frontend", "Egresados"].map((badge) => (
                  <span
                    key={badge}
                    onClick={() => handleQuickFilter(badge)}
                    className="bg-[#1E293B] text-white px-3 py-1 text-xs font-mono cursor-pointer hover:bg-[#F37021] transition rounded-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* GSAP Escalera Eléctrica */}
            <div className="col-span-1 lg:col-span-5 h-[500px] relative overflow-hidden hidden md:block border-4 border-[#1E293B] bg-white rounded-sm shadow-xl mask-image-gradient">
              <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>

              <div
                ref={escalatorRef}
                className="flex flex-col gap-4 px-6 pt-4 w-full"
              >
                {[...activeStudents.slice(0, 4)].map((student) => (
                  <EscalatorCard key={`a-${student.id}`} student={student} />
                ))}
                {[...activeStudents.slice(0, 4)].map((student) => (
                  <EscalatorCard key={`b-${student.id}`} student={student} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute top-0 right-0 w-1/3 h-full bg-[#f1f5f9] opacity-50"
          style={{
            backgroundImage: "radial-gradient(#CBD5E1 2px, transparent 2px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
      </section>

      {/* 2. GRID DE ESTUDIANTES */}
      <section className="bg-[#1E293B] py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                <span className="text-[#F37021]">/</span> Talento Destacado
              </h2>
              <p className="text-gray-400">
                Nuestros desarrolladores e investigadores listos para la
                industria.
              </p>
            </div>
            <button
              onClick={() => handleQuickFilter("Estudiante")}
              className="hidden sm:flex items-center text-white font-mono text-sm hover:text-[#F37021] transition"
            >
              Ver todos <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE DE PROYECTOS */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#2D5A27] mb-4">
              Proyectos Tecnológicos
            </h2>
            <p className="text-[#334155] max-w-2xl mx-auto">
              Software funcional, investigación aplicada e impacto social
              desarrollado desde 2022.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => handleQuickFilter("Proyecto")}
              className="bg-transparent border-2 border-[#2D5A27] text-[#2D5A27] px-8 py-3 font-bold hover:bg-[#2D5A27] hover:text-white transition pixel-border"
            >
              EXPLORAR MÁS PROYECTOS
            </button>
          </div>
        </div>
      </section>

      {/* 4. CIFRAS ANIMADAS GSAP */}
      <section className="py-16 border-y-4 border-[#1E293B] bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#2D5A27 1px, transparent 1px), linear-gradient(90deg, #2D5A27 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div ref={metricsRef} className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div
                className="counter text-5xl md:text-6xl font-bold text-[#2D5A27] pixel-font mb-2"
                data-value={projects.length}
              >
                0
              </div>
              <p className="text-[#334155] font-semibold text-sm uppercase tracking-wider">
                Proyectos DT
              </p>
            </div>
            <div>
              <div
                className="counter text-5xl md:text-6xl font-bold text-[#2D5A27] pixel-font mb-2"
                data-value={students.length}
              >
                0
              </div>
              <p className="text-[#334155] font-semibold text-sm uppercase tracking-wider">
                Integrantes
              </p>
            </div>
            <div>
              <div
                className="counter text-5xl md:text-6xl font-bold text-[#2D5A27] pixel-font mb-2"
                data-value={
                  students.filter((s) => s.status === "EGRESADO").length
                }
              >
                0
              </div>
              <p className="text-[#334155] font-semibold text-sm uppercase tracking-wider">
                Egresados
              </p>
            </div>
            <div>
              <div
                className="counter text-5xl md:text-6xl font-bold text-[#F37021] pixel-font mb-2"
                data-value="15"
              >
                0
              </div>
              <p className="text-[#334155] font-semibold text-sm uppercase tracking-wider">
                Premios Recibidos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ALIADOS MARQUEE */}
      <section className="py-8 bg-[#F8F9FA] overflow-hidden border-b-2 border-gray-200">
        <style>{`
          @keyframes slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .marquee-container { display: flex; width: 200%; animation: slide 20s linear infinite; }
          .marquee-container:hover { animation-play-state: paused; }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
          <p className="text-xs font-mono text-gray-500">
            APOYAN EL CRECIMIENTO TECNOLÓGICO
          </p>
        </div>
        <div className="marquee-container items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="flex-1 text-center font-bold text-xl text-[#334155] mx-8 whitespace-nowrap"
            >
              {i % 2 === 0
                ? "Institución Universitaria Colegio Mayor"
                : "Subproceso Egresados UNIMAYOR"}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
