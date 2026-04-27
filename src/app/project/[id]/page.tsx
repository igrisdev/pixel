"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Users,
  Code,
  ExternalLink,
  Trophy,
  LayoutDashboard,
  FileText,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useDataStore } from "@/store/useDataStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const { projects } = useDataStore();
  const { currentUser } = useAuthStore();

  const project = projects.find((p) => p.id === Number(id));

  const esDueñoOAdmin =
    currentUser?.role === "ADMIN" || project?.createdBy === currentUser?.id;

  if (!project || (project.approvalStatus !== "ACTIVE" && !esDueñoOAdmin)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#F8F9FA]">
        <AlertCircle className="w-16 h-16 text-[#F37021] mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">
          Proyecto no disponible
        </h1>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Este proyecto no existe o se encuentra actualmente en estado de
          revisión por los administradores.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-[#1E293B] text-white px-6 py-2 font-bold hover:bg-[#F37021] transition pixel-border"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const productosVisibles = project.products || [];

  const todosLosIntegrantes =
    productosVisibles.flatMap((p) => p.participations || []) || [];
  const uniqueTeam = Array.from(
    new Map(todosLosIntegrantes.map((p) => [p.memberId, p])).values(),
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center text-[#334155] hover:text-[#F37021] font-mono text-xs mb-8 transition"
      >
        &larr; VOLVER AL CATÁLOGO
      </button>

      {project.approvalStatus !== "ACTIVE" && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-8 font-medium">
          ⚠️ Este proyecto macro se encuentra actualmente en estado:{" "}
          <strong>{project.approvalStatus}</strong>.
        </div>
      )}

      <div className="bg-white pixel-border overflow-hidden mb-12">
        <div className="w-full h-64 md:h-96 relative border-b-4 border-[#1E293B]">
          <img
            src={project.coverImageUrl || undefined}
            alt={project.title}
            className="w-full h-full object-cover bg-gray-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-[#1e293b90] to-transparent opacity-90"></div>

          <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#2D5A27] text-white text-xs font-mono px-3 py-1 border border-[#1E293B]">
                PROYECTO MACRO
              </span>
              <span className="text-gray-300 text-sm font-mono flex items-center">
                <Calendar className="w-4 h-4 mr-1" /> {project.startDate} al{" "}
                {project.endDate || "Presente"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {project.awards && (
          <div className="bg-[#FFF4ED] border-b-2 border-[#F37021] px-8 py-4 flex items-center text-[#F37021] font-medium text-sm md:text-base">
            <Trophy className="w-6 h-6 mr-3 flex-shrink-0" />
            <span>{project.awards}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h3 className="text-2xl font-bold text-[#2D5A27] mb-4">
              Objetivo General
            </h3>
            <p className="text-[#334155] text-lg leading-relaxed border-l-4 border-[#2D5A27] pl-4">
              {project.objective}
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-[#1E293B] mb-6 border-b-2 border-gray-200 pb-2">
              Productos Derivados ({productosVisibles.length})
            </h3>
            <div className="space-y-6">
              {productosVisibles.map((product) => {
                // REGLA ESTRICTA: Solo hay links si el product está ACTIVO
                const linksActivos = product.approvalStatus === "ACTIVE";

                return (
                  <div
                    key={product.id}
                    className="bg-[#F8F9FA] border-2 border-gray-200 p-6 hover:border-[#F37021] transition relative"
                  >
                    <div
                      className={`absolute top-0 right-0 text-[10px] font-mono font-bold px-3 py-1 border-b-2 border-l-2 border-gray-200 text-white ${
                        product.categoryType === "DEVELOPMENT"
                          ? "bg-blue-600"
                          : product.categoryType === "WRITING"
                            ? "bg-purple-600"
                            : "bg-[#F37021]"
                      }`}
                    >
                      {product.categoryType}
                    </div>

                    <h4 className="text-xl font-bold text-[#1E293B] mb-2 pr-24 flex items-center gap-2">
                      {product.title}
                      {product.approvalStatus !== "ACTIVE" && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-300 uppercase tracking-wide">
                          PENDIENTE
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-[#334155] mb-4 leading-relaxed">
                      {product.description}
                    </p>

                    {product.categoryType === "DEVELOPMENT" && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.technologies?.map((t) => (
                            <span
                              key={t}
                              className="text-xs bg-white border border-gray-300 px-2 py-1 flex items-center font-mono text-[#334155]"
                            >
                              <Code className="w-3 h-3 mr-1" /> {t}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          {product.repositoryUrl &&
                            (linksActivos ? (
                              <a
                                href={product.repositoryUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs bg-[#1E293B] text-white px-3 py-2 flex items-center hover:bg-gray-800 transition"
                              >
                                Ver Código
                              </a>
                            ) : (
                              <span className="text-xs bg-gray-200 text-gray-500 px-3 py-2 flex items-center cursor-not-allowed border border-gray-300">
                                <Lock className="w-3 h-3 mr-1.5" /> Código no
                                disponible
                              </span>
                            ))}

                          {product.demoUrl &&
                            (linksActivos ? (
                              <a
                                href={product.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs bg-[#F37021] text-white px-3 py-2 flex items-center hover:bg-[#e06015] transition"
                              >
                                <LayoutDashboard className="w-4 h-4 mr-2" /> Ver
                                Demo
                              </a>
                            ) : (
                              <span className="text-xs bg-gray-200 text-gray-500 px-3 py-2 flex items-center cursor-not-allowed border border-gray-300">
                                <Lock className="w-3 h-3 mr-1.5" /> Demo no
                                disponible
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {product.categoryType === "WRITING" && (
                      <div className="mb-4 flex gap-3 items-center text-sm font-medium text-[#334155]">
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1 text-purple-600" />{" "}
                          {product.publicationSource || "Documento Académico"}
                        </span>
                        {product.documentUrl &&
                          (linksActivos ? (
                            <a
                              href={product.documentUrl}
                              target="_blank"
                              className="text-blue-600 hover:underline flex items-center text-xs"
                            >
                              Leer documento{" "}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          ) : (
                            <span className="text-gray-400 flex items-center text-xs cursor-not-allowed bg-gray-100 px-2 py-1 border border-gray-200">
                              <Lock className="w-3 h-3 mr-1" /> Documento
                              pendiente
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-[10px] font-mono text-gray-400 mb-2">
                        AUTORES / DESARROLLADORES DEL PRODUCTO
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.participations?.map((part) => (
                          <div
                            key={part.id}
                            className="flex items-center bg-white border border-gray-200 px-2 py-1 text-xs"
                          >
                            <img
                              src={part.memberPhotoUrl || undefined}
                              alt=""
                              className="w-4 h-4 mr-2 border border-gray-400 object-cover"
                            />
                            <span className="font-semibold mr-1">
                              {part.memberName}
                            </span>
                            <span className="text-gray-500 italic">
                              ({part.productRole})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {uniqueTeam.length > 0 && (
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white pixel-border p-6">
              <h3 className="text-lg font-bold text-[#1E293B] mb-6 flex items-center border-b border-gray-100 pb-3">
                <Users className="w-5 h-5 mr-2 text-[#F37021]" /> Equipo del
                Proyecto
              </h3>
              <div className="space-y-3">
                {uniqueTeam.map((member, i) => (
                  <Link
                    href={`/profile/${member.memberId}`}
                    key={i}
                    className="bg-[#F8F9FA] border border-transparent p-3 flex items-center cursor-pointer hover:border-[#1E293B] hover:bg-white transition group block"
                  >
                    <img
                      src={member.memberPhotoUrl || undefined}
                      alt={member.memberName}
                      className="w-10 h-10 border border-[#1E293B] mr-3 object-cover bg-gray-200"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#1E293B] group-hover:text-[#F37021]">
                        {member.memberName}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                        Ver perfil &rarr;
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
