"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import {
  CheckCircle,
  XCircle,
  Folder,
  FileCode,
  FileText,
  MapPin,
  User,
} from "lucide-react";
import BadgeEstado from "@/components/ui/BadgeEstado";

export default function AdminAprobaciones() {
  const { proyectos, students, updateProyecto } = useStore();

  // 1. Filtrar Proyectos Macro pendientes
  const proyectosPendientes = proyectos.filter(
    (p) => p.estado_aprobacion === "PENDIENTE",
  );

  // 2. Extraer todos los Productos pendientes de todos los proyectos (incluso si el proyecto ya está activo)
  const productosPendientes = proyectos.flatMap((p) => {
    const pendientes = (p.productos || []).filter(
      (prod) => prod.estado_aprobacion === "PENDIENTE",
    );
    // Le añadimos la info del proyecto padre para mostrarla en la UI
    return pendientes.map((prod) => ({ ...prod, proyecto_padre: p }));
  });

  // --- LÓGICA DE APROBACIÓN / RECHAZO ---

  const handleAprobarProyecto = (id: number) => {
    if (
      window.confirm("¿Estás seguro de APROBAR y publicar este proyecto macro?")
    ) {
      updateProyecto(id, { estado_aprobacion: "ACTIVO" });
    }
  };

  const handleRechazarProyecto = (id: number) => {
    if (
      window.confirm("¿Rechazar este proyecto? Pasará a estado de corrección.")
    ) {
      updateProyecto(id, { estado_aprobacion: "RECHAZADO" });
    }
  };

  const handleAprobarProducto = (idProyecto: number, idProducto: number) => {
    if (window.confirm("¿Estás seguro de APROBAR este producto académico?")) {
      const project = proyectos.find((p) => p.id === idProyecto);
      if (!project) return;

      const updatedProductos = (project.productos || []).map((prod) =>
        prod.id === idProducto
          ? { ...prod, estado_aprobacion: "ACTIVO" as const }
          : prod,
      );
      updateProyecto(idProyecto, { productos: updatedProductos });
    }
  };

  const handleRechazarProducto = (idProyecto: number, idProducto: number) => {
    if (window.confirm("¿Rechazar este producto académico?")) {
      const project = proyectos.find((p) => p.id === idProyecto);
      if (!project) return;

      const updatedProductos = (project.productos || []).map((prod) =>
        prod.id === idProducto
          ? { ...prod, estado_aprobacion: "RECHAZADO" as const }
          : prod,
      );
      updateProyecto(idProyecto, { productos: updatedProductos });
    }
  };

  // Función auxiliar para obtener el nombre del creador
  const getAutor = (idCreador: number) => {
    const student = students.find((s) => s.id === idCreador);
    return student ? student.name : "Usuario Desconocido";
  };

  return (
    <div className="space-y-8">
      {/* SECCIÓN 1: PROYECTOS MACRO PENDIENTES */}
      <section className="bg-white pixel-border p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#1E293B] flex items-center mb-6 border-b-2 border-gray-100 pb-4">
          <Folder className="w-6 h-6 mr-3 text-[#F37021]" />
          Proyectos Macro Pendientes
          <span className="ml-3 bg-red-100 text-red-600 px-2 py-0.5 rounded text-sm font-bold">
            {proyectosPendientes.length}
          </span>
        </h2>

        {proyectosPendientes.length === 0 ? (
          <p className="text-gray-500 italic text-sm">
            No hay proyectos macro pendientes de revisión.
          </p>
        ) : (
          <div className="space-y-4">
            {proyectosPendientes.map((p) => (
              <div
                key={p.id}
                className="border-2 border-gray-200 p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-[#1E293B]">
                      {p.titulo}
                    </h3>
                    <BadgeEstado estado={p.estado_aprobacion} />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {p.objetivo}
                  </p>
                  <p className="text-xs font-mono text-gray-400 flex items-center">
                    <User className="w-3 h-3 mr-1" /> Autor:{" "}
                    {getAutor(p.creado_por)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAprobarProyecto(p.id)}
                    className="bg-green-100 text-green-700 hover:bg-green-600 hover:text-white px-4 py-2 text-sm font-bold flex items-center transition border border-green-200 hover:border-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> APROBAR
                  </button>
                  <button
                    onClick={() => handleRechazarProyecto(p.id)}
                    className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white px-4 py-2 text-sm font-bold flex items-center transition border border-red-200 hover:border-red-600"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> RECHAZAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECCIÓN 2: PRODUCTOS ACADÉMICOS PENDIENTES */}
      <section className="bg-white pixel-border p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#1E293B] flex items-center mb-6 border-b-2 border-gray-100 pb-4">
          <FileCode className="w-6 h-6 mr-3 text-blue-600" />
          Productos y Entregables Pendientes
          <span className="ml-3 bg-red-100 text-red-600 px-2 py-0.5 rounded text-sm font-bold">
            {productosPendientes.length}
          </span>
        </h2>

        {productosPendientes.length === 0 ? (
          <p className="text-gray-500 italic text-sm">
            No hay productos académicos pendientes de revisión.
          </p>
        ) : (
          <div className="space-y-4">
            {productosPendientes.map((prod) => (
              <div
                key={prod.id}
                className="border-2 border-gray-200 p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-1 inline-block text-white ${prod.tipo_categoria === "DESARROLLO" ? "bg-blue-600" : prod.tipo_categoria === "ESCRITO" ? "bg-purple-600" : "bg-[#F37021]"}`}
                    >
                      {prod.tipo_categoria}
                    </span>
                    <h3 className="font-bold text-lg text-[#1E293B]">
                      {prod.titulo}
                    </h3>
                    <BadgeEstado estado={prod.estado_aprobacion} />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                    {prod.descripcion}
                  </p>
                  <p className="text-xs font-mono text-gray-400 flex items-center">
                    <Folder className="w-3 h-3 mr-1" /> Pertenece a:{" "}
                    {prod.proyecto_padre.titulo}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleAprobarProducto(prod.proyecto_padre.id, prod.id)
                    }
                    className="bg-green-100 text-green-700 hover:bg-green-600 hover:text-white px-4 py-2 text-sm font-bold flex items-center transition border border-green-200 hover:border-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> APROBAR
                  </button>
                  <button
                    onClick={() =>
                      handleRechazarProducto(prod.proyecto_padre.id, prod.id)
                    }
                    className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white px-4 py-2 text-sm font-bold flex items-center transition border border-red-200 hover:border-red-600"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> RECHAZAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
