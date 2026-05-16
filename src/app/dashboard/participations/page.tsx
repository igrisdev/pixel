"use client";

import React, { useEffect, useState } from "react";
import { Users, Folder, FileCode, FileText, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useDataStore } from "@/store/useDataStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Project, AcademicProduct } from "@/types";
import BadgeEstado from "@/components/ui/BadgeEstado";

export default function ParticipationsPage() {
  const { participatedProjects, loadParticipatedProjects, members, loadMembers } = useDataStore();
  const { currentUser } = useAuthStore();
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    Promise.all([
      loadParticipatedProjects(currentUser.id),
      loadMembers(),
    ]).finally(() => setLoading(false));
  }, [currentUser, loadParticipatedProjects, loadMembers]);

  const toggleProject = (projectId: number) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const isUserParticipantInProduct = (product: AcademicProduct): boolean => {
    if (!currentUser) return false;
    return (product.participations || []).some((p) => p.memberId === currentUser.id);
  };

  const getUserRoleInProduct = (product: AcademicProduct): string | null => {
    if (!currentUser) return null;
    const participation = (product.participations || []).find((p) => p.memberId === currentUser.id);
    return participation?.productRole || null;
  };

  const getMemberById = (memberId: number) => {
    return members.find((m) => m.id === memberId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F37021]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white pixel-border p-6 md:p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8 border-b-2 border-gray-100 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#1E293B] flex items-center">
          <Users className="w-6 h-6 mr-3 text-[#F37021]" /> Mis Participaciones
        </h2>
        <div className="text-sm text-gray-500 font-mono">
          {participatedProjects.length} proyecto{participatedProjects.length !== 1 ? 's' : ''}
        </div>
      </div>

      {participatedProjects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 bg-gray-50">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium mb-2">
            No participas en ningún proyecto aún.
          </p>
          <p className="text-gray-400 text-sm">
            Cuando te agreguen como participante en un producto académico, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {participatedProjects.map((project) => {
            const userProducts = (project.products || []).filter(isUserParticipantInProduct);
            const isExpanded = expandedProjects.has(project.id);

            return (
              <div
                key={project.id}
                className="border-4 border-[#1E293B] overflow-hidden"
              >
                <div
                  className="bg-[#F8F9FA] p-6 border-b-2 border-gray-200 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleProject(project.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-[#F37021] text-white text-[10px] font-mono px-2 py-1 inline-block border border-[#1E293B]">
                          PROYECTO
                        </span>
                        <BadgeEstado estado={project.approvalStatus} />
                        {project.createdBy === currentUser?.id && (
                          <span className="bg-[#2D5A27] text-white text-[10px] font-mono px-2 py-1 inline-block border border-[#1E293B]">
                            CREADOR
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#1E293B] mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 max-w-3xl line-clamp-2">
                        {project.objective}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right text-sm">
                        <div className="text-gray-500 font-mono">
                          {userProducts.length} producto{userProducts.length !== 1 ? 's' : ''} donde participas
                        </div>
                        <div className="text-gray-400">
                          de {(project.products || []).length} total
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(project.products || []).map((product) => {
                        const isParticipant = isUserParticipantInProduct(product);
                        const userRole = getUserRoleInProduct(product);

                        return (
                          <div
                            key={product.id}
                            className={`border-2 p-4 ${
                              isParticipant
                                ? "border-[#F37021] bg-orange-50"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {product.categoryType === "DEVELOPMENT" ? (
                                  <FileCode className="w-4 h-4 text-blue-500" />
                                ) : product.categoryType === "EVENT" ? (
                                  <Calendar className="w-4 h-4 text-purple-500" />
                                ) : (
                                  <FileText className="w-4 h-4 text-green-500" />
                                )}
                                <span className={`text-[10px] font-mono px-2 py-0.5 ${
                                  product.categoryType === "DEVELOPMENT"
                                    ? "bg-blue-100 text-blue-700"
                                    : product.categoryType === "EVENT"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-green-100 text-green-700"
                                }`}>
                                  {product.categoryType === "DEVELOPMENT"
                                    ? "DESARROLLO"
                                    : product.categoryType === "EVENT"
                                    ? "EVENTO"
                                    : "ESCRITO"}
                                </span>
                              </div>
                              {isParticipant && (
                                <span className="bg-[#F37021] text-white text-[10px] font-bold px-2 py-0.5">
                                  PARTICIPAS
                                </span>
                              )}
                            </div>

                            <h4 className="font-bold text-[#1E293B] mb-1 line-clamp-1">
                              {product.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {product.description}
                            </p>

                            {isParticipant && userRole && (
                              <div className="text-xs font-mono text-[#F37021] font-semibold bg-white px-2 py-1 border border-[#F37021] inline-block">
                                Tu rol: {userRole}
                              </div>
                            )}

                            {product.technologies && product.technologies.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {product.technologies.slice(0, 4).map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {product.technologies.length > 4 && (
                                  <span className="text-[10px] text-gray-400">
                                    +{product.technologies.length - 4}
                                  </span>
                                )}
                              </div>
                            )}

                            {(product.participations || []).length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-[10px] font-mono text-gray-500 mb-2">
                                  EQUIPO ({(product.participations || []).length})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {(product.participations || []).map((part) => {
                                    const member = getMemberById(part.memberId);
                                    return (
                                      <div
                                        key={part.id}
                                        className={`flex items-center gap-1 text-xs ${
                                          part.memberId === currentUser?.id
                                            ? "text-[#F37021] font-semibold"
                                            : "text-gray-600"
                                        }`}
                                      >
                                        {member?.photoUrl ? (
                                          <img
                                            src={member.photoUrl}
                                            alt={part.memberName}
                                            className="w-5 h-5 rounded-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px]">
                                            {part.memberName.charAt(0)}
                                          </div>
                                        )}
                                        <span className="truncate max-w-[80px]">
                                          {part.memberName.split(' ')[0]}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {(project.products || []).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Este proyecto no tiene productos académicos aún.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}