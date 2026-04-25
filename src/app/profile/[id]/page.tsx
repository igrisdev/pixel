"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ExternalLink, Download, Code, MapPin, Trophy } from "lucide-react";

type ParticipationMock = {
  id: number;
  title: string;
  type: string;
  role: string;
  date: string;
  tech?: string[];
  source?: string;
  location?: string;
  isProjectHead: boolean;
};

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { students } = useStore();

  const student = students.find((s) => s.id === Number(id));

  if (!student || student.vetado) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-[#1E293B] mb-4">
          Perfil no encontrado
        </h1>
        <button
          onClick={() => router.back()}
          className="text-[#F37021] hover:underline font-bold"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  // Extendemos los datos con el mock del diseño original
  // Agregamos fallbacks seguros (|| []) para evitar errores de TypeScript
  const mockProfile = {
    ...student,
    email:
      student.email_personal ||
      student.name.split(" ")[0].toLowerCase() + "@unimayor.edu.co",
    bio: "Apasionado por la tecnología y la investigación aplicada. Investigador en el semillero Pixel participando activamente en el desarrollo de soluciones de software.",
    skillsHard: (student.tech || []).concat(["Git", "Scrum", "API REST"]),
    skillsSoft: [
      "Liderazgo técnico",
      "Resolución de problemas",
      "Trabajo colaborativo",
      "Redacción científica",
    ],
    // Le asignamos el tipo como un arreglo de ParticipationMock
    participations: [
      {
        id: 100,
        title: "Pixel Core Engine",
        type: "DESARROLLO",
        role: student.role,
        date: "Mar 2024 - Nov 2024",
        tech: student.tech || [],
        isProjectHead: true,
      },
      {
        id: 101,
        title: "Visibilización de Talento IT",
        type: "ESCRITO",
        role: "Co-autor",
        date: "Jun 2024 - Dic 2024",
        source: "Revista Ingeniería UNIMAYOR",
        isProjectHead: false,
      },
      {
        id: 102,
        title: "Encuentro Regional RedCOLSI",
        type: "EVENTO",
        role: "Ponente",
        date: "Oct 2024",
        location: "Universidad del Cauca, Popayán",
        isProjectHead: false,
      },
    ] as ParticipationMock[],
  };
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center text-[#334155] hover:text-[#F37021] font-mono text-xs mb-8 transition"
      >
        &larr; VOLVER
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUMNA IZQUIERDA: Tarjeta de Identidad (Sticky) */}
        <div className="lg:col-span-4">
          <div className="bg-white pixel-border p-6 sticky top-24">
            <div className="flex flex-col items-center text-center">
              <img
                src={mockProfile.img}
                alt={mockProfile.name}
                className="w-32 h-32 border-4 border-[#1E293B] mb-4 object-cover"
              />
              <span
                className={`text-[10px] font-mono px-2 py-1 border border-[#1E293B] mb-3 ${
                  mockProfile.status === "EGRESADO"
                    ? "bg-[#2D5A27] text-white"
                    : "bg-gray-100 text-[#334155]"
                }`}
              >
                {mockProfile.status}
              </span>
              <h1 className="text-2xl font-bold text-[#2D5A27] mb-1">
                {mockProfile.name}
              </h1>
              <h2 className="text-[#334155] font-medium mb-6">
                {mockProfile.role}
              </h2>

              <button className="w-full bg-[#F37021] text-white font-bold py-3 pixel-border flex items-center justify-center hover:bg-[#e06015] hover-lift mb-6">
                <Download className="w-5 h-5 mr-2" /> DESCARGAR CV
              </button>

              <div className="w-full border-t border-gray-200 pt-6">
                <p className="text-xs text-gray-500 font-mono mb-3 text-left">
                  ENLACES PROFESIONALES
                </p>
                <div className="flex flex-col space-y-3">
                  {mockProfile.enlaces &&
                    mockProfile.enlaces.map((enlace) => (
                      <a
                        key={enlace.id}
                        href={enlace.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center text-[#334155] hover:text-[#2D5A27] transition group"
                      >
                        <ExternalLink className="w-5 h-5 mr-3 group-hover:scale-110 transition" />
                        <span className="text-sm font-medium">
                          {enlace.plataforma}
                        </span>
                      </a>
                    ))}
                  <a
                    href={`mailto:${mockProfile.email}`}
                    className="flex items-center text-[#334155] hover:text-[#2D5A27] transition group mt-4 pt-4 border-t border-gray-100"
                  >
                    <span className="text-xs font-mono break-all">
                      {mockProfile.email}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Contenido Principal */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white pixel-border p-8">
            <h3 className="text-xl font-bold text-[#1E293B] mb-4 flex items-center">
              <span className="w-2 h-6 bg-[#2D5A27] mr-3 inline-block"></span>{" "}
              Perfil Profesional
            </h3>
            <p className="text-[#334155] leading-relaxed">{mockProfile.bio}</p>
          </div>

          <div className="bg-white pixel-border p-8">
            <h3 className="text-xl font-bold text-[#1E293B] mb-6 flex items-center">
              <span className="w-2 h-6 bg-[#F37021] mr-3 inline-block"></span>{" "}
              Matriz de Competencias
            </h3>
            <div className="mb-6">
              <p className="text-xs text-gray-500 font-mono mb-3">
                TÉCNICAS (HARD SKILLS)
              </p>
              <div className="flex flex-wrap gap-2">
                {mockProfile.skillsHard.map((skill) => (
                  <span
                    key={skill}
                    className="bg-[#1E293B] text-white text-sm px-3 py-1 font-mono border border-transparent cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono mb-3">
                TRANSVERSALES (SOFT SKILLS)
              </p>
              <div className="flex flex-wrap gap-2">
                {mockProfile.skillsSoft.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-100 text-[#334155] text-sm px-3 py-1 font-mono border border-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white pixel-border p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-[#1E293B] flex items-center">
                <span className="w-2 h-6 bg-[#2D5A27] mr-3 inline-block"></span>{" "}
                Portafolio y Trayectoria
              </h3>
            </div>
            <div className="relative border-l-2 border-[#1E293B] ml-3 space-y-8 pb-4">
              {mockProfile.participations.map((part) => {
                let typeColor = "bg-[#2D5A27]";
                if (part.type === "ESCRITO") typeColor = "bg-blue-600";
                if (part.type === "EVENTO") typeColor = "bg-purple-600";

                return (
                  <div key={part.id} className="relative pl-8">
                    <div
                      className={`absolute -left-[11px] top-1 w-5 h-5 ${typeColor} border-2 border-[#1E293B]`}
                    ></div>
                    <div className="bg-[#F8F9FA] border border-gray-200 p-5 hover:border-[#1E293B] transition group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-[#1E293B] group-hover:text-[#F37021] transition">
                          {part.title}
                        </h4>
                        <span className="text-xs font-mono text-gray-500">
                          {part.date}
                        </span>
                      </div>
                      <p className="text-[#2D5A27] font-semibold text-sm mb-3">
                        {part.role}
                      </p>

                      {/* Aquí aplicamos el Optional Chaining (?.) */}
                      {part.type === "DESARROLLO" && part.tech && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {part.tech?.map((t: string) => (
                            <span
                              key={t}
                              className="text-xs bg-white border border-gray-300 px-2 py-1 flex items-center text-[#334155]"
                            >
                              <Code className="w-3 h-3 mr-1" /> {t}
                            </span>
                          ))}
                        </div>
                      )}
                      {part.type === "ESCRITO" && (
                        <p className="text-sm text-[#334155] italic">
                          Publicado en: {part.source}
                        </p>
                      )}
                      {part.type === "EVENTO" && (
                        <p className="text-sm text-[#334155] flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-500" />{" "}
                          {part.location}
                        </p>
                      )}
                      {part.isProjectHead && (
                        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center text-xs text-[#F37021] font-bold">
                          <Trophy className="w-4 h-4 mr-1" /> Líder de Proyecto
                          Principal
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
