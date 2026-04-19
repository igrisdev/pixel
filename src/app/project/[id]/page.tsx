"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  //  Github,
  ExternalLink,
  Trophy,
  Code,
  Users,
} from "lucide-react";

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { projects } = useStore();

  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-[#1E293B] mb-4">
          Proyecto no encontrado
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

  return (
    <main className="py-12 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Imagen Cabecera */}
        <div className="w-full h-64 md:h-96 relative border-4 border-[#1E293B] mb-8 overflow-hidden bg-gray-200">
          <img
            src={project.img}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-[#F37021] text-white px-3 py-1 font-mono text-sm border-2 border-[#1E293B]">
            {project.type}
          </div>
          <div className="absolute bottom-4 right-4 bg-white text-[#1E293B] px-3 py-1 font-mono text-sm border-2 border-[#1E293B]">
            {project.date}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contenido Principal */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-[#1E293B] mb-6">
              {project.title}
            </h1>

            <div className="mb-8 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="flex items-center bg-gray-100 border border-gray-300 text-[#2D5A27] font-semibold text-sm px-3 py-1"
                >
                  <Code className="w-4 h-4 mr-1" /> {t}
                </span>
              ))}
            </div>

            <div className="prose max-w-none mb-10">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">
                Objetivo
              </h2>
              <p className="text-[#334155] text-lg leading-relaxed mb-6">
                {project.objective}
              </p>

              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">
                Descripción
              </h2>
              <p className="text-[#334155] leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.awards && (
              <div className="bg-[#fff7ed] border-l-4 border-[#F37021] p-6 mb-10 flex items-start">
                <Trophy className="w-8 h-8 text-[#F37021] mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-[#1E293B] mb-1">
                    Reconocimientos
                  </h3>
                  <p className="text-[#F37021] font-medium">{project.awards}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white pixel-border p-6 mb-8">
              <h3 className="font-bold text-lg text-[#1E293B] mb-4 border-b-2 border-gray-100 pb-2 flex items-center">
                <Users className="w-5 h-5 mr-2 text-[#2D5A27]" /> Equipo
                Desarrollador
              </h3>
              <div className="space-y-4">
                {project.team.map((member, idx) => (
                  <Link
                    href={`/profile/${member.studentId}`}
                    key={idx}
                    className="flex items-center group"
                  >
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-10 h-10 rounded-none border-2 border-[#1E293B] mr-3 group-hover:border-[#F37021] transition"
                    />
                    <div>
                      <h4 className="font-bold text-[#334155] group-hover:text-[#F37021] transition text-sm">
                        {member.name}
                      </h4>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1E293B] text-white px-4 py-3 font-bold hover:bg-[#F37021] transition pixel-border flex items-center justify-center"
                >
                  {/* <Github className="w-5 h-5 mr-2" /> */}
                  Repositorio
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-[#2D5A27] border-2 border-[#2D5A27] px-4 py-3 font-bold hover:bg-[#2D5A27] hover:text-white transition shadow-[4px_4px_0px_#2D5A27] flex items-center justify-center"
                >
                  <ExternalLink className="w-5 h-5 mr-2" /> Ver Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
