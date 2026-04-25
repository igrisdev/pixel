"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function AdminAuditoriaCRUD() {
  const { projects, deleteProject } = useStore();

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "ATENCIÓN: ¿Eliminar este proyecto del sistema de forma permanente? Esta acción no se puede deshacer.",
      )
    ) {
      deleteProject(id);
    }
  };

  return (
    <div className="bg-white pixel-border p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#1E293B] mb-6">
        Auditoría Global de Proyectos
      </h2>
      <div className="space-y-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-2 border-gray-200 p-4 bg-[#F8F9FA] hover:border-[#F37021] transition gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={p.img}
                alt={p.title}
                className="w-16 h-16 object-cover border border-[#1E293B] hidden sm:block"
              />
              <div>
                <h3 className="font-bold text-[#1E293B] text-lg">{p.title}</h3>
                <p className="text-xs text-gray-500 font-mono mt-1 bg-white px-2 py-1 inline-block border border-gray-200">
                  {p.type} | {p.date}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-4 py-2 border-2 border-red-200 hover:border-red-600 transition font-bold text-xs flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" /> ELIMINAR PROYECTO
            </button>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-gray-500 italic p-4 text-center">
            No hay proyectos registrados en el catálogo.
          </p>
        )}
      </div>
    </div>
  );
}
