"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import StudentCard from "@/components/ui/StudentCard";
import ProjectCard from "@/components/ui/ProjectCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("query") || "";

  const { students, projects } = useStore();
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [filterType, setFilterType] = useState<
    "TODO" | "ESTUDIANTE" | "EGRESADO" | "PROYECTO"
  >("TODO");

  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
    router.push("/search");
  };

  const termLower = searchTerm.toLowerCase();

  // Filtrado de estudiantes
  const filteredStudents = students.filter((s) => {
    if (s.vetado) return false;
    if (filterType === "PROYECTO") return false;
    if (filterType !== "TODO" && s.status !== filterType) return false;

    return (
      s.name.toLowerCase().includes(termLower) ||
      s.role.toLowerCase().includes(termLower) ||
      s.tech.some((t) => t.toLowerCase().includes(termLower))
    );
  });

  // Filtrado de proyectos
  const filteredProjects = projects.filter((p) => {
    if (filterType === "ESTUDIANTE" || filterType === "EGRESADO") return false;

    return (
      p.title.toLowerCase().includes(termLower) ||
      p.type.toLowerCase().includes(termLower) ||
      p.tech.some((t) => t.toLowerCase().includes(termLower))
    );
  });

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera del Buscador */}
        <div className="bg-[#1E293B] p-8 pixel-border mb-10">
          <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Search className="w-8 h-8 mr-3 text-[#F37021]" /> Explorar
            Directorio
          </h1>
          <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-3xl">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ej. React, Python, Frontend..."
                className="w-full py-3 px-4 outline-none text-[#334155] font-medium bg-white border-2 border-transparent focus:border-[#F37021]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#F37021] text-white px-8 py-3 font-bold hover:bg-[#e06015] transition pixel-border-accent"
            >
              Buscar
            </button>
          </form>

          {/* Botones de Filtro */}
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            {(["TODO", "ESTUDIANTE", "EGRESADO", "PROYECTO"] as const).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 text-sm font-mono border-2 transition ${filterType === type ? "bg-[#2D5A27] text-white border-[#2D5A27]" : "bg-transparent text-gray-300 border-gray-600 hover:border-gray-400"}`}
                >
                  {type}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Resultados: Estudiantes */}
        {filteredStudents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1E293B] mb-6 border-b-2 border-gray-200 pb-2">
              Talento ({filteredStudents.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </div>
        )}

        {/* Resultados: Proyectos */}
        {filteredProjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-6 border-b-2 border-gray-200 pb-2">
              Proyectos ({filteredProjects.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {filteredStudents.length === 0 && filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-white pixel-border">
            <p className="text-xl font-bold text-[#334155] mb-2">
              No se encontraron resultados.
            </p>
            <p className="text-gray-500">
              Prueba con otros términos de búsqueda o cambia los filtros.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

// Envolvemos en Suspense por el uso de useSearchParams
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center font-bold">Cargando buscador...</div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
