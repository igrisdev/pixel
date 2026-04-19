"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  Calendar,
  Users,
  Code,
  ExternalLink,
  //   Github,
  Trophy,
  LayoutDashboard,
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
          onClick={() => router.back()}
          className="text-[#F37021] hover:underline font-bold"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center text-[#334155] hover:text-[#F37021] font-mono text-xs mb-8 transition"
      >
        &larr; VOLVER
      </button>

      {/* Cabecera del Proyecto Exacta */}
      <div className="bg-white pixel-border overflow-hidden mb-12">
        <div className="w-full h-64 md:h-96 relative border-b-4 border-[#1E293B]">
          <img
            src={project.img}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] to-transparent opacity-80"></div>

          <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#F37021] text-white text-xs font-mono px-3 py-1 border border-[#1E293B]">
                {project.type}
              </span>
              <span className="text-gray-300 text-sm font-mono flex items-center">
                <Calendar className="w-4 h-4 mr-1" /> {project.date}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {project.awards && (
          <div className="bg-[#FFF4ED] border-b-2 border-[#F37021] px-8 py-4 flex items-center text-[#F37021] font-medium">
            <Trophy className="w-6 h-6 mr-3" />
            <span>{project.awards}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h3 className="text-2xl font-bold text-[#2D5A27] mb-4">
              Objetivo Principal
            </h3>
            <p className="text-[#334155] text-lg leading-relaxed border-l-4 border-[#2D5A27] pl-4">
              {project.objective}
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-[#1E293B] mb-4">
              Descripción y Arquitectura
            </h3>
            <p className="text-[#334155] leading-relaxed">
              {project.description}
            </p>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-[#1E293B] mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-[#F37021]" /> Equipo de
              Investigación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.team.map((member, i) => (
                <Link
                  href={`/profile/${member.studentId}`}
                  key={i}
                  className="bg-[#F8F9FA] border border-[#1E293B] p-4 flex items-center cursor-pointer hover:border-[#F37021] hover:bg-white hover-lift transition group"
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-12 h-12 border-2 border-[#1E293B] mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-[#1E293B] group-hover:text-[#2D5A27]">
                      {member.name}
                    </h4>
                    <p className="text-xs text-[#334155] font-mono">
                      {member.role}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white pixel-border p-6">
            <h4 className="font-mono text-xs text-gray-500 mb-4">
              STACK TECNOLÓGICO
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="bg-[#1E293B] text-white text-sm px-3 py-2 font-mono flex items-center"
                >
                  <Code className="w-4 h-4 mr-2 text-[#F37021]" /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white pixel-border p-6">
            <h4 className="font-mono text-xs text-gray-500 mb-4">
              ENLACES DEL PROYECTO
            </h4>
            <div className="space-y-3">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between bg-[#F8F9FA] border border-gray-300 p-3 hover:border-[#2D5A27] hover:text-[#2D5A27] transition text-[#334155] font-medium group"
                >
                  <span className="flex items-center">
                    {/* <Github className="w-5 h-5 mr-3" />
                     */}
                    Repositorio
                  </span>
                  <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between bg-[#F37021] text-white p-3 hover:bg-[#e06015] transition font-medium pixel-border-accent"
                >
                  <span className="flex items-center">
                    <LayoutDashboard className="w-5 h-5 mr-3" /> Ver Demo en
                    Vivo
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
