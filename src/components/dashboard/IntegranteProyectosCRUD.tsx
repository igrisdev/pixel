"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Folder,
  FileCode,
  MapPin,
  FileText,
  ChevronDown,
  Users,
  UserPlus,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import {
  Proyecto,
  ProductoAcademico,
  TipoCategoria,
  Participacion,
} from "@/types";
import BadgeEstado from "@/components/ui/BadgeEstado"; // <-- NUEVO: Importamos el Badge

export default function IntegranteProyectosCRUD() {
  const {
    proyectos,
    students,
    currentUser,
    addProyecto,
    updateProyecto,
    deleteProyecto,
  } = useStore();

  // --- ESTADOS: PROYECTO MACRO ---
  const [isAddingProj, setIsAddingProj] = useState(false);
  const [editProjId, setEditProjId] = useState<number | null>(null);
  const [projFormData, setProjFormData] = useState({
    titulo: "",
    objetivo: "",
    premios_distinciones: "",
    fecha_inicio: "",
    fecha_fin: "",
    img: "",
  });

  // --- ESTADOS: PRODUCTOS ACADÉMICOS ---
  const [activeFormProjectId, setActiveFormProjectId] = useState<number | null>(
    null,
  );
  const [editProdId, setEditProdId] = useState<number | null>(null);
  const [prodFormData, setProdFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo_categoria: "DESARROLLO" as TipoCategoria,
    tecnologias_string: "",
    url_repositorio: "",
    url_demo: "",
    fuente_publicacion: "",
    url_documento: "",
    localidad: "",
  });

  // --- ESTADOS: GESTIÓN DE EQUIPO ---
  const [managingTeamProdId, setManagingTeamProdId] = useState<number | null>(
    null,
  );
  const [teamForm, setTeamForm] = useState({ studentId: "", role: "" });

  // Filtrar proyectos del usuario actual
  const misProyectos = proyectos.filter(
    (p) => p.creado_por === currentUser?.id,
  );

  // ------------------------------------------------------------------------
  // LÓGICA: PROYECTOS MACRO
  // ------------------------------------------------------------------------
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProjId) {
      updateProyecto(editProjId, projFormData);
      setEditProjId(null);
    } else if (currentUser) {
      const nextId =
        proyectos.length > 0 ? Math.max(...proyectos.map((p) => p.id)) + 1 : 1;

      const newProj: Proyecto = {
        id: nextId,
        ...projFormData,
        creado_por: currentUser.id,
        estado_aprobacion: "PENDIENTE", // <-- NUEVO: Nace pendiente por defecto
        productos: [],
      };

      addProyecto(newProj);
      setIsAddingProj(false);
    }
    setProjFormData({
      titulo: "",
      objetivo: "",
      premios_distinciones: "",
      fecha_inicio: "",
      fecha_fin: "",
      img: "",
    });
  };

  const handleDeleteProject = (id: number) => {
    if (
      window.confirm(
        "ATENCIÓN: ¿Eliminar todo el proyecto y sus productos derivados?",
      )
    ) {
      deleteProyecto(id);
    }
  };

  const handleEditProjectClick = (p: Proyecto) => {
    setProjFormData({
      titulo: p.titulo,
      objetivo: p.objetivo,
      premios_distinciones: p.premios_distinciones || "",
      fecha_inicio: p.fecha_inicio,
      fecha_fin: p.fecha_fin || "",
      img: p.img,
    });
    setEditProjId(p.id);
    setIsAddingProj(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ------------------------------------------------------------------------
  // LÓGICA: PRODUCTOS ACADÉMICOS
  // ------------------------------------------------------------------------
  const handleEditProductClick = (
    projectId: number,
    prod: ProductoAcademico,
  ) => {
    setProdFormData({
      titulo: prod.titulo,
      descripcion: prod.descripcion,
      tipo_categoria: prod.tipo_categoria,
      tecnologias_string: prod.tecnologias?.join(", ") || "",
      url_repositorio: prod.url_repositorio || "",
      url_demo: prod.url_demo || "",
      fuente_publicacion: prod.fuente_publicacion || "",
      url_documento: prod.url_documento || "",
      localidad: prod.localidad || "",
    });
    setEditProdId(prod.id);
    setActiveFormProjectId(projectId);
    setManagingTeamProdId(null);
  };

  const handleSaveProduct = (e: React.FormEvent, projectId: number) => {
    e.preventDefault();
    if (!currentUser) return;
    const project = proyectos.find((p) => p.id === projectId);
    if (!project) return;

    const baseProductData = {
      titulo: prodFormData.titulo,
      descripcion: prodFormData.descripcion,
      tipo_categoria: prodFormData.tipo_categoria,
      tecnologias: prodFormData.tecnologias_string
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      url_repositorio: prodFormData.url_repositorio,
      url_demo: prodFormData.url_demo,
      fuente_publicacion: prodFormData.fuente_publicacion,
      url_documento: prodFormData.url_documento,
      localidad: prodFormData.localidad,
    };

    if (editProdId) {
      // ACTUALIZAR PRODUCTO EXISTENTE (Podrías devolverlo a PENDIENTE si lo editan, por ahora lo dejamos como está o forzamos pendiente)
      const updatedProductos = (project.productos || []).map((p) =>
        p.id === editProdId
          ? {
              ...p,
              ...baseProductData,
              estado_aprobacion: "PENDIENTE" as const,
            }
          : p,
      );
      updateProyecto(projectId, { productos: updatedProductos });
    } else {
      // CREAR NUEVO PRODUCTO
      const allProds = proyectos.flatMap((p) => p.productos || []);
      const nextProdId =
        allProds.length > 0 ? Math.max(...allProds.map((p) => p.id)) + 1 : 1;
      const allParts = allProds.flatMap((p) => p.participaciones || []);
      const nextPartId =
        allParts.length > 0 ? Math.max(...allParts.map((p) => p.id)) + 1 : 1;
      const userDetails = students.find((s) => s.id === currentUser.id);

      const newProduct: ProductoAcademico = {
        id: nextProdId,
        id_proyecto: projectId,
        ...baseProductData,
        estado_aprobacion: "PENDIENTE", // <-- NUEVO: Nace pendiente por defecto
        participaciones: [
          {
            id: nextPartId,
            id_integrante: currentUser.id,
            id_producto: nextProdId,
            rol_en_producto: "Autor/Desarrollador Principal",
            fecha_inicio_rol: project.fecha_inicio,
            fecha_fin_rol: project.fecha_fin,
            integrante_nombre: currentUser.name,
            integrante_img: userDetails?.img || "",
          },
        ],
      };
      updateProyecto(projectId, {
        productos: [...(project.productos || []), newProduct],
      });
    }

    setActiveFormProjectId(null);
    setEditProdId(null);
    setProdFormData({
      titulo: "",
      descripcion: "",
      tipo_categoria: "DESARROLLO",
      tecnologias_string: "",
      url_repositorio: "",
      url_demo: "",
      fuente_publicacion: "",
      url_documento: "",
      localidad: "",
    });
  };

  const handleDeleteProduct = (projectId: number, productId: number) => {
    if (window.confirm("¿Eliminar este producto académico?")) {
      const project = proyectos.find((p) => p.id === projectId);
      if (project) {
        updateProyecto(projectId, {
          productos: (project.productos || []).filter(
            (p) => p.id !== productId,
          ),
        });
      }
    }
  };

  // ------------------------------------------------------------------------
  // LÓGICA: PARTICIPACIONES (EQUIPO)
  // ------------------------------------------------------------------------
  const handleAddTeamMember = (
    e: React.FormEvent,
    projectId: number,
    productId: number,
  ) => {
    e.preventDefault();
    if (!teamForm.studentId || !teamForm.role) return;

    const project = proyectos.find((p) => p.id === projectId);
    const product = project?.productos?.find((p) => p.id === productId);
    const studentToAdd = students.find(
      (s) => s.id === Number(teamForm.studentId),
    );
    if (!project || !product || !studentToAdd) return;

    const allParts = proyectos
      .flatMap((p) => p.productos || [])
      .flatMap((p) => p.participaciones || []);
    const nextPartId =
      allParts.length > 0 ? Math.max(...allParts.map((p) => p.id)) + 1 : 1;

    const newParticipacion: Participacion = {
      id: nextPartId,
      id_integrante: studentToAdd.id,
      id_producto: productId,
      rol_en_producto: teamForm.role,
      fecha_inicio_rol: project.fecha_inicio,
      fecha_fin_rol: project.fecha_fin,
      integrante_nombre: studentToAdd.name,
      integrante_img: studentToAdd.img,
    };

    const updatedProductos = (project.productos || []).map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          participaciones: [...(p.participaciones || []), newParticipacion],
        };
      }
      return p;
    });

    updateProyecto(projectId, { productos: updatedProductos });
    setTeamForm({ studentId: "", role: "" });
  };

  const handleRemoveTeamMember = (
    projectId: number,
    productId: number,
    participacionId: number,
  ) => {
    const project = proyectos.find((p) => p.id === projectId);
    if (!project) return;

    const updatedProductos = (project.productos || []).map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          participaciones: (p.participaciones || []).filter(
            (part) => part.id !== participacionId,
          ),
        };
      }
      return p;
    });
    updateProyecto(projectId, { productos: updatedProductos });
  };

  return (
    <div className="bg-white pixel-border p-6 md:p-8 shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b-2 border-gray-100 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#1E293B] flex items-center">
          <Folder className="w-6 h-6 mr-3 text-[#F37021]" /> Mis Proyectos y
          Productos
        </h2>
        <button
          onClick={() => {
            setIsAddingProj(!isAddingProj);
            setEditProjId(null);
          }}
          className="bg-[#2D5A27] hover:bg-[#1f3f1b] text-white px-5 py-2.5 text-sm font-bold border-2 border-[#1E293B] flex items-center transition"
        >
          {isAddingProj || editProjId ? (
            <X className="w-4 h-4 mr-2" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {isAddingProj || editProjId ? "CANCELAR" : "NUEVO PROYECTO MACRO"}
        </button>
      </div>

      {/* FORMULARIO DE PROYECTO MACRO */}
      {(isAddingProj || editProjId) && (
        <form
          onSubmit={handleSaveProject}
          className="mb-10 p-6 md:p-8 bg-[#F8F9FA] border-2 border-[#1E293B] space-y-5 relative"
        >
          {editProjId && (
            <div className="absolute top-0 right-0 bg-[#F37021] text-white text-[10px] font-mono px-3 py-1 font-bold">
              MODO EDICIÓN
            </div>
          )}
          <h3 className="font-bold text-lg text-[#1E293B] mb-2">
            {editProjId
              ? "Editando Proyecto Macro"
              : "Datos del Nuevo Proyecto Macro"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-gray-500 mb-1">
                TÍTULO GENERAL
              </label>
              <input
                type="text"
                required
                value={projFormData.titulo}
                onChange={(e) =>
                  setProjFormData({ ...projFormData, titulo: e.target.value })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 font-medium"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-gray-500 mb-1">
                OBJETIVO PRINCIPAL
              </label>
              <textarea
                required
                value={projFormData.objetivo}
                onChange={(e) =>
                  setProjFormData({ ...projFormData, objetivo: e.target.value })
                }
                rows={2}
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                FECHA INICIO
              </label>
              <input
                type="date"
                required
                value={projFormData.fecha_inicio}
                onChange={(e) =>
                  setProjFormData({
                    ...projFormData,
                    fecha_inicio: e.target.value,
                  })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                FECHA FIN (Opcional si sigue activo)
              </label>
              <input
                type="date"
                value={projFormData.fecha_fin}
                onChange={(e) =>
                  setProjFormData({
                    ...projFormData,
                    fecha_fin: e.target.value,
                  })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                PREMIOS O DISTINCIONES
              </label>
              <input
                type="text"
                value={projFormData.premios_distinciones}
                onChange={(e) =>
                  setProjFormData({
                    ...projFormData,
                    premios_distinciones: e.target.value,
                  })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                URL IMAGEN DE PORTADA
              </label>
              <input
                type="url"
                value={projFormData.img}
                onChange={(e) =>
                  setProjFormData({ ...projFormData, img: e.target.value })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#F37021] hover:bg-[#e06015] text-white py-4 font-bold border-2 border-[#1E293B] mt-4 transition pixel-border-accent"
          >
            {editProjId
              ? "GUARDAR CAMBIOS DEL PROYECTO"
              : "CREAR PROYECTO MACRO"}
          </button>
        </form>
      )}

      {/* LISTADO DE PROYECTOS Y SUS PRODUCTOS */}
      <div className="space-y-12">
        {misProyectos.map((p) => (
          <div key={p.id} className="border-4 border-[#1E293B] overflow-hidden">
            {/* Cabecera del Proyecto Macro */}
            <div className="bg-[#F8F9FA] p-6 border-b-2 border-gray-200 flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#2D5A27] text-white text-[10px] font-mono px-2 py-1 inline-block border border-[#1E293B]">
                    PROYECTO MACRO
                  </span>
                  {/* <-- NUEVO: Badge de Estado del Proyecto --> */}
                  <BadgeEstado estado={p.estado_aprobacion} />
                </div>

                <h3 className="text-2xl font-bold text-[#1E293B] mb-2">
                  {p.titulo}
                </h3>
                <p className="text-sm text-gray-600 max-w-3xl">{p.objetivo}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEditProjectClick(p)}
                  className="bg-white text-gray-600 p-2 border border-gray-300 hover:border-[#1E293B] hover:text-[#1E293B] transition"
                  title="Editar Proyecto"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteProject(p.id)}
                  className="bg-red-50 text-red-600 p-2 border border-red-200 hover:bg-red-600 hover:text-white transition"
                  title="Eliminar todo el proyecto"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-sección: Productos Académicos */}
            <div className="p-6 bg-white">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-gray-700 flex items-center">
                  <ChevronDown className="w-5 h-5 mr-1" /> Entregables y
                  Productos ({p.productos?.length || 0})
                </h4>
                <button
                  onClick={() => {
                    setActiveFormProjectId(
                      activeFormProjectId === p.id && !editProdId ? null : p.id,
                    );
                    setEditProdId(null);
                    setProdFormData({
                      titulo: "",
                      descripcion: "",
                      tipo_categoria: "DESARROLLO",
                      tecnologias_string: "",
                      url_repositorio: "",
                      url_demo: "",
                      fuente_publicacion: "",
                      url_documento: "",
                      localidad: "",
                    });
                    setManagingTeamProdId(null);
                  }}
                  className="text-sm font-bold text-[#F37021] border-2 border-[#F37021] px-4 py-2 hover:bg-[#F37021] hover:text-white transition"
                >
                  + AÑADIR PRODUCTO
                </button>
              </div>

              {/* Formulario anidado para Producto (Crear o Editar) */}
              {activeFormProjectId === p.id && (
                <form
                  onSubmit={(e) => handleSaveProduct(e, p.id)}
                  className="mb-8 p-6 bg-gray-50 border-2 border-dashed border-[#F37021] space-y-4 relative"
                >
                  {editProdId && (
                    <div className="absolute top-0 right-0 bg-[#F37021] text-white text-[10px] font-mono px-3 py-1 font-bold">
                      MODO EDICIÓN
                    </div>
                  )}
                  <h5 className="font-bold text-[#F37021] mb-2">
                    {editProdId
                      ? "Editando Producto"
                      : `Añadir Nuevo Producto a ${p.titulo}`}
                  </h5>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-mono text-gray-500 mb-1">
                        TÍTULO DEL PRODUCTO
                      </label>
                      <input
                        type="text"
                        required
                        value={prodFormData.titulo}
                        onChange={(e) =>
                          setProdFormData({
                            ...prodFormData,
                            titulo: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021]"
                      />
                    </div>
                    <div className="w-full md:w-64">
                      <label className="block text-xs font-mono text-gray-500 mb-1">
                        CATEGORÍA
                      </label>
                      <select
                        value={prodFormData.tipo_categoria}
                        onChange={(e) =>
                          setProdFormData({
                            ...prodFormData,
                            tipo_categoria: e.target.value as TipoCategoria,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021] bg-white"
                        disabled={!!editProdId}
                      >
                        <option value="DESARROLLO">
                          Software / Desarrollo
                        </option>
                        <option value="ESCRITO">Artículo / Memoria</option>
                        <option value="EVENTO">Evento</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1">
                      DESCRIPCIÓN BREVE
                    </label>
                    <textarea
                      required
                      value={prodFormData.descripcion}
                      onChange={(e) =>
                        setProdFormData({
                          ...prodFormData,
                          descripcion: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021]"
                    />
                  </div>

                  {/* Campos dinámicos según Categoría */}
                  <div className="p-4 border border-gray-200 bg-white">
                    {prodFormData.tipo_categoria === "DESARROLLO" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                            <FileCode className="w-3 h-3 mr-1" /> TECNOLOGÍAS
                            (Separadas por coma)
                          </label>
                          <input
                            type="text"
                            value={prodFormData.tecnologias_string}
                            onChange={(e) =>
                              setProdFormData({
                                ...prodFormData,
                                tecnologias_string: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 p-2 focus:border-[#F37021]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-gray-500 mb-1">
                            URL REPOSITORIO
                          </label>
                          <input
                            type="url"
                            value={prodFormData.url_repositorio}
                            onChange={(e) =>
                              setProdFormData({
                                ...prodFormData,
                                url_repositorio: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 p-2 focus:border-[#F37021]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-gray-500 mb-1">
                            URL DEMO
                          </label>
                          <input
                            type="url"
                            value={prodFormData.url_demo}
                            onChange={(e) =>
                              setProdFormData({
                                ...prodFormData,
                                url_demo: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 p-2 focus:border-[#F37021]"
                          />
                        </div>
                      </div>
                    )}
                    {prodFormData.tipo_categoria === "ESCRITO" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                            <FileText className="w-3 h-3 mr-1" /> FUENTE DE
                            PUBLICACIÓN
                          </label>
                          <input
                            type="text"
                            value={prodFormData.fuente_publicacion}
                            onChange={(e) =>
                              setProdFormData({
                                ...prodFormData,
                                fuente_publicacion: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 p-2 focus:border-[#F37021]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-gray-500 mb-1">
                            URL DEL DOCUMENTO
                          </label>
                          <input
                            type="url"
                            value={prodFormData.url_documento}
                            onChange={(e) =>
                              setProdFormData({
                                ...prodFormData,
                                url_documento: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 p-2 focus:border-[#F37021]"
                          />
                        </div>
                      </div>
                    )}
                    {prodFormData.tipo_categoria === "EVENTO" && (
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" /> CIUDAD / LOCALIDAD
                          DEL EVENTO
                        </label>
                        <input
                          type="text"
                          value={prodFormData.localidad}
                          onChange={(e) =>
                            setProdFormData({
                              ...prodFormData,
                              localidad: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 p-2 focus:border-[#F37021]"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="bg-[#1E293B] text-white px-6 py-3 font-bold hover:bg-[#2D5A27] transition flex-1"
                    >
                      {editProdId
                        ? "GUARDAR CAMBIOS DEL PRODUCTO"
                        : "GUARDAR NUEVO PRODUCTO"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFormProjectId(null)}
                      className="bg-gray-200 text-gray-700 px-6 py-3 font-bold hover:bg-gray-300 transition"
                    >
                      CANCELAR
                    </button>
                  </div>
                </form>
              )}

              {/* Grid de Productos Creados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(p.productos || []).map((prod) => {
                  const membersIds = (prod.participaciones || []).map(
                    (part) => part.id_integrante,
                  );
                  const availableStudents = students.filter(
                    (s) => !membersIds.includes(s.id) && s.role !== "ADMIN",
                  );

                  return (
                    <div
                      key={prod.id}
                      className="border border-gray-200 p-4 relative group hover:border-[#1E293B] transition flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`text-[10px] font-mono font-bold px-2 py-1 inline-block text-white ${prod.tipo_categoria === "DESARROLLO" ? "bg-blue-600" : prod.tipo_categoria === "ESCRITO" ? "bg-purple-600" : "bg-[#F37021]"}`}
                          >
                            {prod.tipo_categoria}
                          </div>
                          {/* <-- NUEVO: Badge de Estado del Producto --> */}
                          <BadgeEstado estado={prod.estado_aprobacion} />
                        </div>

                        {/* Acciones del Producto */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() =>
                              setManagingTeamProdId(
                                managingTeamProdId === prod.id ? null : prod.id,
                              )
                            }
                            className="bg-gray-100 text-gray-600 p-1.5 hover:bg-[#2D5A27] hover:text-white transition"
                            title="Gestionar Equipo"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditProductClick(p.id, prod)}
                            className="bg-gray-100 text-gray-600 p-1.5 hover:bg-blue-600 hover:text-white transition"
                            title="Editar Producto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, prod.id)}
                            className="bg-gray-100 text-gray-600 p-1.5 hover:bg-red-600 hover:text-white transition"
                            title="Eliminar Producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h5 className="font-bold text-[#1E293B] mb-1">
                        {prod.titulo}
                      </h5>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">
                        {prod.descripcion}
                      </p>

                      {/* Resumen del equipo en la tarjeta */}
                      <div className="flex -space-x-2 mt-auto pt-3 border-t border-gray-100">
                        {(prod.participaciones || []).map((part) => (
                          <img
                            key={part.id}
                            src={part.integrante_img || undefined}
                            alt={part.integrante_nombre}
                            title={`${part.integrante_nombre} - ${part.rol_en_producto}`}
                            className="w-6 h-6 border border-white bg-gray-200 object-cover"
                          />
                        ))}
                      </div>

                      {/* PANEL DESPLEGABLE: GESTIÓN DE EQUIPO */}
                      {managingTeamProdId === prod.id && (
                        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 bg-gray-50 p-3 -mx-4 -mb-4">
                          <h6 className="text-xs font-bold text-[#1E293B] mb-3 flex items-center">
                            <Users className="w-3 h-3 mr-1" /> Equipo del
                            Producto
                          </h6>
                          <ul className="space-y-2 mb-4">
                            {(prod.participaciones || []).map((part) => (
                              <li
                                key={part.id}
                                className="flex justify-between items-center bg-white border border-gray-200 p-2 text-xs"
                              >
                                <div className="flex items-center">
                                  <img
                                    src={part.integrante_img || undefined}
                                    alt=""
                                    className="w-5 h-5 mr-2 object-cover border border-gray-300"
                                  />
                                  <span className="font-medium mr-1">
                                    {part.integrante_nombre}
                                  </span>
                                  <span className="text-gray-400">
                                    ({part.rol_en_producto})
                                  </span>
                                </div>
                                {part.id_integrante !== currentUser?.id && (
                                  <button
                                    onClick={() =>
                                      handleRemoveTeamMember(
                                        p.id,
                                        prod.id,
                                        part.id,
                                      )
                                    }
                                    className="text-red-400 hover:text-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>

                          {availableStudents.length > 0 ? (
                            <form
                              onSubmit={(e) =>
                                handleAddTeamMember(e, p.id, prod.id)
                              }
                              className="flex flex-col gap-2"
                            >
                              <select
                                value={teamForm.studentId}
                                onChange={(e) =>
                                  setTeamForm({
                                    ...teamForm,
                                    studentId: e.target.value,
                                  })
                                }
                                className="text-xs border border-gray-300 p-2 bg-white"
                                required
                              >
                                <option value="">
                                  Seleccionar compañero...
                                </option>
                                {availableStudents.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.name} ({s.carrera})
                                  </option>
                                ))}
                              </select>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Rol (Ej. Analista QA)"
                                  value={teamForm.role}
                                  onChange={(e) =>
                                    setTeamForm({
                                      ...teamForm,
                                      role: e.target.value,
                                    })
                                  }
                                  className="text-xs border border-gray-300 p-2 flex-1"
                                  required
                                />
                                <button
                                  type="submit"
                                  className="bg-[#2D5A27] text-white px-3 py-2 text-xs font-bold hover:bg-[#1f3f1b] flex items-center"
                                >
                                  <UserPlus className="w-3 h-3 mr-1" /> AÑADIR
                                </button>
                              </div>
                            </form>
                          ) : (
                            <p className="text-xs text-gray-400 italic">
                              No hay más estudiantes disponibles para añadir.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {(!p.productos || p.productos.length === 0) &&
                  activeFormProjectId !== p.id && (
                    <div className="col-span-2 p-6 border-2 border-dashed border-gray-300 text-center text-gray-500 text-sm">
                      Aún no has registrado ningún producto (software, escrito o
                      evento) para este proyecto.
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
        {misProyectos.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-500 font-medium">
              Aún no has creado ningún Proyecto Macro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
