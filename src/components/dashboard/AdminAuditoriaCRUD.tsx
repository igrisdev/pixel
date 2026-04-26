"use client";

import React, { useState } from "react";
import { Trash2, Search, Eye, Edit3, Loader2 } from "lucide-react"; // Añadimos Loader2
import Link from "next/link";
import { useStore } from "@/store/useStore";
import BadgeEstado from "@/components/ui/BadgeEstado";

export default function AdminAuditoriaCRUD() {
  const { proyectos, deleteProyecto, updateProyecto } = useStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<
    "TODOS" | "ACTIVO" | "PENDIENTE" | "RECHAZADO"
  >("TODOS");

  // NUEVO: Estado para bloqueos asíncronos
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "ATENCIÓN: ¿Eliminar este proyecto macro del sistema de forma permanente? Esta acción no se puede deshacer.",
      )
    ) {
      setLoadingAction(`eliminar-${id}`);
      try {
        await deleteProyecto(id);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleCambiarEstado = async (
    id: number,
    nuevoEstado: "ACTIVO" | "PENDIENTE" | "RECHAZADO",
  ) => {
    if (
      window.confirm(
        `¿Estás seguro de cambiar el estado de este proyecto a ${nuevoEstado}?`,
      )
    ) {
      setLoadingAction(`estado-${id}`);
      try {
        await updateProyecto(id, { estado_aprobacion: nuevoEstado });
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const proyectosFiltrados = proyectos.filter((p) => {
    const coincideBusqueda = p.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const coincideEstado =
      filterEstado === "TODOS" || p.estado_aprobacion === filterEstado;
    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="bg-white pixel-border p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-[#1E293B]">
          Auditoría Global de Proyectos ({proyectos.length})
        </h2>

        {/* BUSCADOR Y FILTROS */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          {/* ... (Mismo código de filtros) ... */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar proyecto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 text-sm focus:border-[#F37021] outline-none"
            />
          </div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value as any)}
            className="border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-[#F37021] cursor-pointer"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVO">Solo Activos</option>
            <option value="PENDIENTE">Solo Pendientes</option>
            <option value="RECHAZADO">Solo Rechazados</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {proyectosFiltrados.map((p) => (
          <div
            key={p.id}
            className={`flex flex-col xl:flex-row justify-between items-start xl:items-center border-2 p-4 transition gap-4 ${
              loadingAction?.includes(p.id.toString())
                ? "border-gray-300 bg-gray-100 opacity-70" // Estilo si está cargando
                : "border-gray-200 bg-[#F8F9FA] hover:border-[#F37021]"
            }`}
          >
            <div className="flex items-center gap-4 w-full xl:w-auto">
              <img
                src={p.img || undefined}
                alt={p.titulo}
                className="w-16 h-16 object-cover border border-[#1E293B] hidden sm:block bg-gray-200"
              />
              <div className="flex-1">
                <h3 className="font-bold text-[#1E293B] text-lg flex items-center gap-2 flex-wrap">
                  {p.titulo}
                  <BadgeEstado estado={p.estado_aprobacion} />
                </h3>
                <p className="text-xs text-gray-500 font-mono mt-1 bg-white px-2 py-1 inline-block border border-gray-200">
                  ID: {p.id} | Fecha inicio: {p.fecha_inicio} | Productos:{" "}
                  {p.productos?.length || 0}
                </p>
              </div>
            </div>

            {/* ACCIONES DE AUDITORÍA */}
            <div className="flex gap-2 w-full xl:w-auto flex-wrap">
              {/* Select para estado con deshabilitado dinámico */}
              <div
                className={`flex-1 sm:flex-none border-2 transition flex items-center px-2 ${
                  loadingAction !== null
                    ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                    : "border-gray-300 bg-white hover:border-[#F37021]"
                }`}
              >
                {loadingAction === `estado-${p.id}` ? (
                  <Loader2 className="w-4 h-4 text-gray-500 mr-2 animate-spin" />
                ) : (
                  <Edit3 className="w-4 h-4 text-gray-500 mr-2" />
                )}
                <select
                  value={p.estado_aprobacion}
                  disabled={loadingAction !== null}
                  onChange={(e) =>
                    handleCambiarEstado(p.id, e.target.value as any)
                  }
                  className="w-full text-xs font-bold text-[#1E293B] py-2 outline-none bg-transparent cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value="ACTIVO">Hacer ACTIVO</option>
                  <option value="PENDIENTE">Pasar a PENDIENTE</option>
                  <option value="RECHAZADO">Marcar RECHAZADO</option>
                </select>
              </div>

              {/* Botón Detalles */}
              <Link
                href={`/project/${p.id}`}
                className={`flex-1 sm:flex-none px-4 py-2 border-2 transition font-bold text-xs flex items-center justify-center ${
                  loadingAction !== null
                    ? "text-gray-400 border-gray-200 pointer-events-none"
                    : "text-[#1E293B] bg-white hover:bg-[#1E293B] hover:text-white border-[#1E293B]"
                }`}
              >
                <Eye className="w-4 h-4 mr-2" /> DETALLES
              </Link>

              {/* Botón Eliminar */}
              <button
                onClick={() => handleDelete(p.id)}
                disabled={loadingAction !== null}
                className="flex-1 sm:flex-none px-4 py-2 border-2 transition font-bold text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border-red-200 hover:border-red-600"
              >
                {loadingAction === `eliminar-${p.id}` ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                ELIMINAR
              </button>
            </div>
          </div>
        ))}

        {proyectosFiltrados.length === 0 && (
          <p className="text-gray-500 italic p-8 text-center border-2 border-dashed border-gray-300">
            No se encontraron proyectos que coincidan con la búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}
