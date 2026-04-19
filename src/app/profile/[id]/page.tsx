"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  //   Github,
  //   Linkedin,
  ExternalLink,
  Mail,
  Code,
  MapPin,
  Download,
} from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { students, projects } = useStore();

  const student = students.find((s) => s.id === Number(id));

  if (!student || student.vetado) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-[#1E293B] mb-4">
          Perfil no encontrado
        </h1>
        <button
          onClick={() => router.push("/search")}
          className="text-[#F37021] hover:underline font-bold"
        >
          Volver al buscador
        </button>
      </div>
    );
  }

  // Proyectos donde participa este estudiante
  const studentProjects = projects.filter((p) =>
    p.team.some((t) => t.studentId === student.id),
  );

  return (
    <main className="py-12 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tarjeta Principal */}
        <div className="bg-white pixel-border p-8 md:p-12 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8F9FA] rounded-bl-full -z-0"></div>

          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <img
              src={student.img}
              alt={student.name}
              className="w-32 h-32 md:w-48 md:h-48 object-cover border-4 border-[#1E293B] shadow-[8px_8px_0px_#1E293B]"
            />

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`text-xs font-mono px-3 py-1 border-2 border-[#1E293B] ${student.status === "EGRESADO" ? "bg-[#2D5A27] text-white" : "bg-gray-100 text-[#334155]"}`}
                >
                  {student.status}
                </span>
                <span className="flex items-center text-gray-500 text-sm font-mono">
                  <MapPin className="w-3 h-3 mr-1" /> Popayán, CO
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-2">
                {student.name}
              </h1>
              <p className="text-xl text-[#F37021] font-semibold mb-6">
                {student.role}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {student.tech.map((t) => (
                  <span
                    key={t}
                    className="bg-[#1E293B] text-white text-sm px-3 py-1 font-mono hover:bg-[#2D5A27] transition cursor-default"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 border-t-2 border-gray-100 pt-6">
                {student.email_personal && (
                  <a
                    href={`mailto:${student.email_personal}`}
                    className="flex items-center text-[#334155] hover:text-[#2D5A27] transition font-semibold text-sm bg-gray-100 px-4 py-2 border border-gray-300"
                  >
                    <Mail className="w-4 h-4 mr-2" /> {student.email_personal}
                  </a>
                )}
                {student.url_cv && (
                  <a
                    href={student.url_cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#334155] hover:text-[#2D5A27] transition font-semibold text-sm bg-gray-100 px-4 py-2 border border-gray-300"
                  >
                    <Download className="w-4 h-4 mr-2" /> Ver CV
                  </a>
                )}
                {student.enlaces?.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white bg-[#1E293B] hover:bg-[#F37021] transition font-semibold text-sm px-4 py-2 border-2 border-[#1E293B]"
                  >
                    {link.plataforma.toLowerCase() === "github" ? (
                      //   <Github className="w-4 h-4 mr-2" />
                      <div>Git</div>
                    ) : link.plataforma.toLowerCase() === "linkedin" ? (
                      //   <Linkedin className="w-4 h-4 mr-2" />
                      <div>Lin</div>
                    ) : (
                      <ExternalLink className="w-4 h-4 mr-2" />
                    )}
                    {link.plataforma}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Proyectos del Estudiante */}
        {studentProjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-6 flex items-center">
              <Code className="w-6 h-6 mr-2 text-[#2D5A27]" /> Proyectos en los
              que participa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
