"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Loader2 } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";
import EscalatorCard from "@/components/ui/EscalatorCard";
import { useDataStore } from "@/store/useDataStore";
import gsap from "gsap";
import MemberCard from "@/components/ui/MemberCard";

export default function HomePage() {
  const router = useRouter();
  const { members, projects, loadMembers, loadProjects } = useDataStore();
  const [searchInput, setSearchInput] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [metrics, setMetrics] = useState({ proyectos: 0, miembros: 0, egresados: 0 });

  const escalatorRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([loadMembers(), loadProjects()]).finally(() =>
      setIsLoadingData(false),
    );
  }, [loadMembers, loadProjects]);

  useEffect(() => {
    if (!isLoadingData) {
      setMetrics({
        proyectos: projects.filter(p => p.approvalStatus === "ACTIVE").length,
        miembros: members.filter(m => m.systemRole !== "ADMIN").length,
        egresados: members.filter(m => m.academicStatus === "GRADUATE" && m.systemRole !== "ADMIN").length,
      });
    }
  }, [isLoadingData, projects, members]);

  const activeStudents = members
    .filter((s) => !s.isBanned && s.systemRole !== "ADMIN")
    .slice(0, 8);

  const proyectosActivos = projects
    .filter((p) => p.approvalStatus === "ACTIVE")
    .slice(0, 6);

  const escalatorGrid = isLoadingData ? (
    <div className="flex flex-col gap-4 px-6 pt-4 w-full">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 border-2 border-gray-300 p-3 flex items-center animate-pulse"
        >
          <div className="w-12 h-12 bg-gray-300 rounded border-2 border-gray-400 mr-4"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
            <div className="flex gap-1">
              <div className="h-5 w-12 bg-gray-300 rounded"></div>
              <div className="h-5 w-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-4 px-6 pt-4 w-full">
      {[...activeStudents.slice(0, 8)].map((student) => (
        <EscalatorCard key={`a-${student.id}`} member={student} />
      ))}
      {[...activeStudents.slice(0, 8)].map((student) => (
        <EscalatorCard key={`b-${student.id}`} member={student} />
      ))}
    </div>
  );

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

  const handleNavigateWithFilter = (type: string) => {
    router.push(`/search?type=${type}`);
  };

  // Efecto GSAP - Animación Escalera (solo cuando no hay loading)
  useEffect(() => {
    if (escalatorRef.current && !isLoadingData && activeStudents.length > 0) {
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
  }, [isLoadingData, activeStudents.length]);

  // Efecto GSAP - Contadores
  useEffect(() => {
    if (metricsRef.current && !isLoadingData) {
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
  }, [isLoadingData, metrics]);

  const studentGrid = isLoadingData ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse border border-gray-700">
          <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-3"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto mb-3"></div>
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            <div className="h-5 w-12 bg-gray-700 rounded"></div>
            <div className="h-5 w-12 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {activeStudents.map((student) => (
        <MemberCard key={student.id} member={student} />
      ))}
    </div>
  );

  const proyectosGrid = isLoadingData ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border-2 border-gray-200 overflow-hidden animate-pulse">
          <div className="h-40 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {proyectosActivos.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );

  return (
    <main>
      {/* 1. HERO SECTION & BUSCADOR */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Fondo decorativo que cubre toda la sección */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(#CBD5E1 2px, transparent 2px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
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
                {["React", "Node.js", "Frontend"].map((badge) => (
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
            <div className="col-span-1 lg:col-span-5 h-[500px] relative overflow-hidden hidden md:block rounded-sm shadow-xl mask-image-gradient">
              <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>

              <div ref={escalatorRef}>
                {escalatorGrid}
              </div>
            </div>
          </div>
        </div>
        
      </section>

{/* 2. GRID DE ESTUDIANTES */}
      <div>
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
                onClick={() => handleNavigateWithFilter("EGRESADO")}
                className="hidden sm:flex items-center text-white font-mono text-sm hover:text-[#F37021] transition"
              >
                Ver todos <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {studentGrid}
          </div>
        </section>
      </div>

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

              {proyectosGrid}

              <div className="text-center mt-12">
                <button
                  onClick={() => handleNavigateWithFilter("PROYECTO")}
                  className="bg-transparent border-2 cursor-pointer border-[#2D5A27] text-[#2D5A27] px-8 py-3 font-bold hover:bg-[#2D5A27] hover:text-white transition pixel-border"
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
            <div
              ref={metricsRef}
              className="max-w-7xl mx-auto px-4 relative z-10"
            >
              {isLoadingData ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 w-24 bg-gray-200 rounded mx-auto mb-2"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded mx-auto"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                  <div
                    className="counter text-5xl md:text-6xl font-bold text-[#2D5A27] pixel-font mb-2"
                    data-value={metrics.proyectos}
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
                    data-value={metrics.miembros}
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
                    data-value={metrics.egresados}
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
)}
          </div>
          </section>
    </main>
  );
}
