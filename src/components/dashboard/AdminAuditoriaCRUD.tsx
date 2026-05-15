"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Search, Eye, Edit3, Loader2, ChevronDown, ChevronRight, FileCode, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import BadgeEstado from "@/components/ui/BadgeEstado";
import { useDataStore } from "@/store/useDataStore";
import { formatDate } from "@/lib/date";

export default function AdminAuditoriaCRUD() {
  const { projects, members, deleteProject, updateProject, loadProjects, loadMembers } = useDataStore();
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "ACTIVE" | "PENDING" | "REJECTED"
  >("ALL");

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());

  useEffect(() => {
    Promise.all([loadProjects(), loadMembers()])
      .finally(() => setIsLoadingData(false));
  }, [loadProjects, loadMembers]);

  const toggleExpanded = (projectId: number) => {
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

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "ATENCIÓN: ¿Eliminar este proyecto macro del sistema de forma permanente? Esta acción no se puede deshacer.",
      )
    ) {
      setLoadingAction(`eliminar-${id}`);
      try {
        await deleteProject(id);
        toast.success("Proyecto eliminado");
      } catch {
        toast.error("No se pudo eliminar el proyecto");
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleCambiarEstado = async (
    id: number,
    nuevoEstado: "ACTIVE" | "PENDING" | "REJECTED",
  ) => {
    if (
      window.confirm(
        `¿Estás seguro de cambiar el estado de este proyecto a ${nuevoEstado}?`,
      )
    ) {
      setLoadingAction(`estado-${id}`);
      try {
        await updateProject(id, { approvalStatus: nuevoEstado });
        toast.success("Estado del proyecto actualizado");
      } catch {
        toast.error("No se pudo actualizar el estado del proyecto");
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleCambiarEstadoProducto = async (
    projectId: number,
    productId: number,
    nuevoEstado: "ACTIVE" | "PENDING" | "REJECTED",
  ) => {
    if (
      window.confirm(
        `¿Estás seguro de cambiar el estado de este producto académico a ${nuevoEstado}?`,
      )
    ) {
      setLoadingAction(`estado-prod-${productId}`);
      try {
        const project = projects.find((p) => p.id === projectId);
        if (!project) return;

        const updatedProducts = (project.products || []).map((prod) =>
          prod.id === productId
            ? { ...prod, approvalStatus: nuevoEstado }
            : prod,
        );

        await updateProject(projectId, {
          approvalStatus: project.approvalStatus,
          products: updatedProducts,
        });
        toast.success("Estado del producto actualizado");
      } catch {
        toast.error("No se pudo actualizar el estado del producto");
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleEliminarProducto = async (projectId: number, productId: number) => {
    if (
      window.confirm(
        "ATENCIÓN: ¿Eliminar este producto académico del sistema? Esta acción no se puede deshacer.",
      )
    ) {
      setLoadingAction(`eliminar-prod-${productId}`);
      try {
        const project = projects.find((p) => p.id === projectId);
        if (!project) return;

        await updateProject(projectId, {
          approvalStatus: project.approvalStatus,
          products: (project.products || []).filter((p) => p.id !== productId),
        });
        toast.success("Producto eliminado");
      } catch {
        toast.error("No se pudo eliminar el producto");
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const proyectosFiltrados = projects.filter((p) => {
    const coincideBusqueda = p.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const coincideEstado =
      filterStatus === "ALL" || p.approvalStatus === filterStatus;
    return coincideBusqueda && coincideEstado;
  });

  if (isLoadingData) {
    return (
      <div className="bg-white pixel-border p-6 shadow-sm min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F37021] mr-3" />
        <span className="text-gray-500 font-mono">Cargando proyectos...</span>
      </div>
    );
  }

  return (
    <div className="bg-white pixel-border p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-[#1E293B]">
          Auditoría Global de Proyectos ({projects.length})
        </h2>

        {/* BUSCADOR Y FILTROS */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-[#F37021] cursor-pointer"
          >
            <option value="ALL">Todos los estados</option>
            <option value="ACTIVE">Solo Activos</option>
            <option value="PENDING">Solo Pendientes</option>
            <option value="REJECTED">Solo Rechazados</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {proyectosFiltrados.map((p) => (
          <div
            key={p.id}
            className={`border-2 p-6 transition ${
              loadingAction?.includes(p.id.toString())
                ? "border-gray-300 bg-gray-100 opacity-70"
                : "border-gray-200 bg-[#F8F9FA] hover:border-[#F37021]"
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              {/* COLUMNA IZQUIERDA: Info del proyecto */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <img
                  src={p.coverImageUrl || undefined}
                  alt={p.title}
                  className="w-16 h-16 object-cover border border-[#1E293B] hidden sm:block bg-gray-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1E293B] text-lg flex items-center gap-2 flex-wrap">
                    {p.title}
                    <BadgeEstado estado={p.approvalStatus as any} />
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1 bg-white px-2 py-1 inline-block border border-gray-200">
                    ID: {p.id} | Fecha inicio: {formatDate(p.startDate)} | Productos: {p.products?.length || 0}
                  </p>
                </div>
              </div>

              {/* TOGGLE PRODUCTOS - Debajo a la izquierda */}
              {(p.products?.length || 0) > 0 && (
                <div className="w-full lg:w-auto">
                  <button
                    onClick={() => toggleExpanded(p.id)}
                    className="flex items-center gap-2 text-sm font-bold text-[#F37021] hover:text-[#d4621a] transition px-3 py-2 bg-[#F8F9FA] border-2 border-gray-200 hover:border-[#F37021] rounded"
                  >
                    {expandedProjects.has(p.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <FileCode className="w-4 h-4" />
                    {expandedProjects.has(p.id) ? "Ocultar" : "Ver"} Productos ({p.products?.length || 0})
                  </button>
                </div>
              )}
            </div>

            {/* SECCIÓN DE PRODUCTOS COLAPSADOS - Fila separada */}
            {expandedProjects.has(p.id) && (p.products?.length || 0) > 0 && (
              <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300 w-full">
                <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">
                  Productos Académicos
                </h4>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {p.products?.map((prod) => (
                    <div
                      key={prod.id}
                      className={`bg-white border-2 border-gray-200 p-4 flex flex-col gap-3 ${
                        loadingAction?.includes(`eliminar-prod-${prod.id}`) || loadingAction?.includes(`estado-prod-${prod.id}`)
                          ? "opacity-50"
                          : "hover:border-[#F37021] transition"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className={`text-[10px] font-mono font-bold px-2 py-1 text-white ${
                              prod.categoryType === "DEVELOPMENT" ? "bg-blue-600" : 
                              prod.categoryType === "WRITING" ? "bg-purple-600" : "bg-[#F37021]"
                            }`}>
                              {prod.categoryType}
                            </span>
                            <h4 className="font-bold text-[#1E293B] text-sm truncate">{prod.title}</h4>
                            <BadgeEstado estado={prod.approvalStatus as any} />
                          </div>
                          {prod.repositoryUrl && (
                            <p className="text-xs text-gray-500 truncate">
                              Repo: {prod.repositoryUrl}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 font-mono mt-1">
                            ID: {prod.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-2">
                        {/* Select estado producto */}
                        <div className="flex-1 border-2 border-gray-200 bg-white flex items-center px-2">
                          {loadingAction === `estado-prod-${prod.id}` ? (
                            <Loader2 className="w-3 h-3 text-gray-500 mr-1 animate-spin" />
                          ) : (
                            <Edit3 className="w-3 h-3 text-gray-500 mr-1" />
                          )}
                          <select
                            value={prod.approvalStatus}
                            disabled={loadingAction !== null}
                            onChange={(e) =>
                              handleCambiarEstadoProducto(p.id, prod.id, e.target.value as any)
                            }
                            className="w-full text-xs font-bold text-[#1E293B] py-2 outline-none bg-transparent cursor-pointer"
                          >
                            <option value="ACTIVE">ACTIVO</option>
                            <option value="PENDING">PENDIENTE</option>
                            <option value="REJECTED">RECHAZADO</option>
                          </select>
                        </div>

                        {/* Botón eliminar producto */}
                        <button
                          onClick={() => handleEliminarProducto(p.id, prod.id)}
                          disabled={loadingAction !== null}
                          className="px-4 py-2 border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition font-bold text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
{loadingAction === `eliminar-prod-${prod.id}` ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </button>
                      </div>
</div>
                  ))}
                </div>
              </div>
            )}

            {/* ACCIONES DE AUDITORÍA DEL PROYECTO */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t-2 border-gray-200">
              {/* Selector de estado del proyecto */}
              <div
                className={`flex items-center border-2 px-3 py-2 ${
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
                  value={p.approvalStatus}
                  disabled={loadingAction !== null}
                  onChange={(e) =>
                    handleCambiarEstado(p.id, e.target.value as any)
                  }
                  className="text-xs font-bold text-[#1E293B] bg-transparent outline-none cursor-pointer"
                >
                  <option value="ACTIVE">Hacer ACTIVO</option>
                  <option value="PENDING">Pasar a PENDIENTE</option>
                  <option value="REJECTED">Marcar RECHAZADO</option>
                </select>
              </div>

              {/* Botón DETALLES */}
              <Link
                href={`/project/${p.id}`}
                className={`flex items-center px-4 py-2 border-2 font-bold text-xs transition ${
                  loadingAction !== null
                    ? "text-gray-400 border-gray-200 pointer-events-none"
                    : "text-[#1E293B] bg-white hover:bg-[#1E293B] hover:text-white border-[#1E293B]"
                }`}
              >
                <Eye className="w-4 h-4 mr-2" /> DETALLES
              </Link>

              {/* Botón ELIMINAR */}
              <button
                onClick={() => handleDelete(p.id)}
                disabled={loadingAction !== null}
                className={`flex items-center px-4 py-2 border-2 font-bold text-xs transition ${
                  loadingAction === `eliminar-${p.id}`
                    ? "bg-gray-100 border-gray-200 text-gray-400"
                    : "text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border-red-200 hover:border-red-600"
                } disabled:cursor-not-allowed`}
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
