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
  Loader2,
} from "lucide-react";
import { useDataStore } from "@/store/useDataStore"; // <-- CORREGIDO
import { useAuthStore } from "@/store/useAuthStore"; // <-- CORREGIDO
import { Project, AcademicProduct, CategoryType, Participation } from "@/types"; // <-- CORREGIDO: Tipos en inglés
import BadgeEstado from "@/components/ui/BadgeEstado";

export default function IntegranteProyectosCRUD() {
  // <-- CORREGIDO: Importamos desde DataStore y AuthStore
  const { projects, members, addProject, updateProject, deleteProject } =
    useDataStore();
  const { currentUser } = useAuthStore();

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // --- ESTADOS: PROYECTO MACRO ---
  const [isAddingProj, setIsAddingProj] = useState(false);
  const [editProjId, setEditProjId] = useState<number | null>(null);

  // <-- CORREGIDO: Propiedades en inglés
  const [projFormData, setProjFormData] = useState({
    title: "",
    objective: "",
    awards: "",
    startDate: "",
    endDate: "",
    coverImageUrl: "",
  });

  // --- ESTADOS: PRODUCTOS ACADÉMICOS ---
  const [activeFormProjectId, setActiveFormProjectId] = useState<number | null>(
    null,
  );
  const [editProdId, setEditProdId] = useState<number | null>(null);

  // <-- CORREGIDO: Propiedades en inglés
  const [prodFormData, setProdFormData] = useState({
    title: "",
    description: "",
    categoryType: "DEVELOPMENT" as CategoryType,
    technologiesString: "",
    repositoryUrl: "",
    demoUrl: "",
    publicationSource: "",
    documentUrl: "",
    location: "",
  });

  // --- ESTADOS: GESTIÓN DE EQUIPO ---
  const [managingTeamProdId, setManagingTeamProdId] = useState<number | null>(
    null,
  );
  const [teamForm, setTeamForm] = useState({ memberId: "", role: "" });

  // Filtrar proyectos del usuario actual
  const misProyectos = projects.filter((p) => p.createdBy === currentUser?.id);

  // ------------------------------------------------------------------------
  // LÓGICA: PROYECTOS MACRO
  // ------------------------------------------------------------------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("save-project");

    try {
      if (editProjId) {
        await updateProject(editProjId, projFormData);
        setEditProjId(null);
      } else if (currentUser) {
        const nextId =
          projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;

        const newProj: Project = {
          id: nextId,
          ...projFormData,
          createdBy: currentUser.id,
          approvalStatus: "PENDING",
          products: [],
        };

        await addProject(newProj);
        setIsAddingProj(false);
      }
      setProjFormData({
        title: "",
        objective: "",
        awards: "",
        startDate: "",
        endDate: "",
        coverImageUrl: "",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (
      window.confirm(
        "ATENCIÓN: ¿Eliminar todo el proyecto y sus productos derivados?",
      )
    ) {
      setLoadingAction(`delete-proj-${id}`);
      try {
        await deleteProject(id);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleEditProjectClick = (p: Project) => {
    setProjFormData({
      title: p.title,
      objective: p.objective,
      awards: p.awards || "",
      startDate: p.startDate,
      endDate: p.endDate || "",
      coverImageUrl: p.coverImageUrl,
    });
    setEditProjId(p.id);
    setIsAddingProj(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ------------------------------------------------------------------------
  // LÓGICA: PRODUCTOS ACADÉMICOS
  // ------------------------------------------------------------------------
  const handleEditProductClick = (projectId: number, prod: AcademicProduct) => {
    setProdFormData({
      title: prod.title,
      description: prod.description,
      categoryType: prod.categoryType,
      technologiesString: prod.technologies?.join(", ") || "",
      repositoryUrl: prod.repositoryUrl || "",
      demoUrl: prod.demoUrl || "",
      publicationSource: prod.publicationSource || "",
      documentUrl: prod.documentUrl || "",
      location: prod.location || "",
    });
    setEditProdId(prod.id);
    setActiveFormProjectId(projectId);
    setManagingTeamProdId(null);
  };

  const handleSaveProduct = async (e: React.FormEvent, projectId: number) => {
    e.preventDefault();
    if (!currentUser) return;
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    setLoadingAction(`save-prod-${projectId}`);

    try {
      const baseProductData = {
        title: prodFormData.title,
        description: prodFormData.description,
        categoryType: prodFormData.categoryType,
        technologies: prodFormData.technologiesString
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        repositoryUrl: prodFormData.repositoryUrl,
        demoUrl: prodFormData.demoUrl,
        publicationSource: prodFormData.publicationSource,
        documentUrl: prodFormData.documentUrl,
        location: prodFormData.location,
      };

      if (editProdId) {
        const updatedProducts = (project.products || []).map((p) =>
          p.id === editProdId
            ? {
                ...p,
                ...baseProductData,
                approvalStatus: "PENDING" as const,
              }
            : p,
        );
        await updateProject(projectId, { products: updatedProducts });
      } else {
        const allProds = projects.flatMap((p) => p.products || []);
        const nextProdId =
          allProds.length > 0 ? Math.max(...allProds.map((p) => p.id)) + 1 : 1;
        const allParts = allProds.flatMap((p) => p.participations || []);
        const nextPartId =
          allParts.length > 0 ? Math.max(...allParts.map((p) => p.id)) + 1 : 1;
        const userDetails = members.find((m) => m.id === currentUser.id);

        const newProduct: AcademicProduct = {
          id: nextProdId,
          projectId: projectId,
          ...baseProductData,
          approvalStatus: "PENDING",
          participations: [
            {
              id: nextPartId,
              memberId: currentUser.id,
              productId: nextProdId,
              productRole: "Autor/Desarrollador Principal",
              startDate: project.startDate,
              endDate: project.endDate,
              memberName: currentUser.name,
              memberPhotoUrl: userDetails?.photoUrl || "",
            },
          ],
        };
        await updateProject(projectId, {
          products: [...(project.products || []), newProduct],
        });
      }

      setActiveFormProjectId(null);
      setEditProdId(null);
      setProdFormData({
        title: "",
        description: "",
        categoryType: "DEVELOPMENT",
        technologiesString: "",
        repositoryUrl: "",
        demoUrl: "",
        publicationSource: "",
        documentUrl: "",
        location: "",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteProduct = async (projectId: number, productId: number) => {
    if (window.confirm("¿Eliminar este producto académico?")) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setLoadingAction(`delete-prod-${productId}`);
        try {
          await updateProject(projectId, {
            products: (project.products || []).filter(
              (p) => p.id !== productId,
            ),
          });
        } finally {
          setLoadingAction(null);
        }
      }
    }
  };

  // ------------------------------------------------------------------------
  // LÓGICA: PARTICIPACIONES (EQUIPO)
  // ------------------------------------------------------------------------
  const handleAddTeamMember = async (
    e: React.FormEvent,
    projectId: number,
    productId: number,
  ) => {
    e.preventDefault();
    if (!teamForm.memberId || !teamForm.role) return;

    const project = projects.find((p) => p.id === projectId);
    const product = project?.products?.find((p) => p.id === productId);
    const memberToAdd = members.find((m) => m.id === Number(teamForm.memberId));
    if (!project || !product || !memberToAdd) return;

    setLoadingAction(`add-team-${productId}`);

    try {
      const allParts = projects
        .flatMap((p) => p.products || [])
        .flatMap((p) => p.participations || []);
      const nextPartId =
        allParts.length > 0 ? Math.max(...allParts.map((p) => p.id)) + 1 : 1;

      const newParticipation: Participation = {
        id: nextPartId,
        memberId: memberToAdd.id,
        productId: productId,
        productRole: teamForm.role,
        startDate: project.startDate,
        endDate: project.endDate,
        memberName: memberToAdd.fullName,
        memberPhotoUrl: memberToAdd.photoUrl,
      };

      const updatedProducts = (project.products || []).map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            participations: [...(p.participations || []), newParticipation],
          };
        }
        return p;
      });

      await updateProject(projectId, { products: updatedProducts });
      setTeamForm({ memberId: "", role: "" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemoveTeamMember = async (
    projectId: number,
    productId: number,
    participationId: number,
  ) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    setLoadingAction(`remove-team-${participationId}`);

    try {
      const updatedProducts = (project.products || []).map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            participations: (p.participations || []).filter(
              (part) => part.id !== participationId,
            ),
          };
        }
        return p;
      });
      await updateProject(projectId, { products: updatedProducts });
    } finally {
      setLoadingAction(null);
    }
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
          disabled={loadingAction !== null}
          className="bg-[#2D5A27] hover:bg-[#1f3f1b] text-white px-5 py-2.5 text-sm font-bold border-2 border-[#1E293B] flex items-center transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={loadingAction === "save-project"}
                value={projFormData.title}
                onChange={(e) =>
                  setProjFormData({ ...projFormData, title: e.target.value })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 font-medium disabled:bg-gray-100"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-gray-500 mb-1">
                OBJETIVO PRINCIPAL
              </label>
              <textarea
                required
                disabled={loadingAction === "save-project"}
                value={projFormData.objective}
                onChange={(e) =>
                  setProjFormData({
                    ...projFormData,
                    objective: e.target.value,
                  })
                }
                rows={2}
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                FECHA INICIO
              </label>
              <input
                type="date"
                required
                disabled={loadingAction === "save-project"}
                value={projFormData.startDate}
                onChange={(e) =>
                  setProjFormData({
                    ...projFormData,
                    startDate: e.target.value,
                  })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                FECHA FIN (Opcional si sigue activo)
              </label>
              <input
                type="date"
                disabled={loadingAction === "save-project"}
                value={projFormData.endDate}
                onChange={(e) =>
                  setProjFormData({
                    ...projFormData,
                    endDate: e.target.value,
                  })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                PREMIOS O DISTINCIONES
              </label>
              <input
                type="text"
                disabled={loadingAction === "save-project"}
                value={projFormData.awards}
                onChange={(e) =>
                  setProjFormData({
                    ...projFormData,
                    awards: e.target.value,
                  })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                URL IMAGEN DE PORTADA
              </label>
              <input
                type="url"
                disabled={loadingAction === "save-project"}
                value={projFormData.coverImageUrl}
                onChange={(e) =>
                  setProjFormData({
                    ...projFormData,
                    coverImageUrl: e.target.value,
                  })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 disabled:bg-gray-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingAction === "save-project"}
            className="w-full bg-[#F37021] hover:bg-[#e06015] text-white py-4 font-bold border-2 border-[#1E293B] mt-4 transition pixel-border-accent flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingAction === "save-project" ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : null}
            {loadingAction === "save-project"
              ? "GUARDANDO..."
              : editProjId
                ? "GUARDAR CAMBIOS DEL PROYECTO"
                : "CREAR PROYECTO MACRO"}
          </button>
        </form>
      )}

      {/* LISTADO DE PROYECTOS Y SUS PRODUCTOS */}
      <div className="space-y-12">
        {misProyectos.map((p) => (
          <div
            key={p.id}
            className={`border-4 transition ${loadingAction === `delete-proj-${p.id}` ? "border-red-300 opacity-50" : "border-[#1E293B]"} overflow-hidden`}
          >
            {/* Cabecera del Proyecto Macro */}
            <div className="bg-[#F8F9FA] p-6 border-b-2 border-gray-200 flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#2D5A27] text-white text-[10px] font-mono px-2 py-1 inline-block border border-[#1E293B]">
                    PROYECTO MACRO
                  </span>
                  <BadgeEstado estado={p.approvalStatus as any} />
                </div>

                <h3 className="text-2xl font-bold text-[#1E293B] mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600 max-w-3xl">{p.objective}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEditProjectClick(p)}
                  disabled={loadingAction !== null}
                  className="bg-white text-gray-600 p-2 border border-gray-300 hover:border-[#1E293B] hover:text-[#1E293B] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Editar Proyecto"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteProject(p.id)}
                  disabled={loadingAction !== null}
                  className="bg-red-50 text-red-600 p-2 border border-red-200 hover:bg-red-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[38px]"
                  title="Eliminar todo el proyecto"
                >
                  {loadingAction === `delete-proj-${p.id}` ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sub-sección: Productos Académicos */}
            <div className="p-6 bg-white">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-gray-700 flex items-center">
                  <ChevronDown className="w-5 h-5 mr-1" /> Entregables y
                  Productos ({p.products?.length || 0})
                </h4>
                <button
                  onClick={() => {
                    setActiveFormProjectId(
                      activeFormProjectId === p.id && !editProdId ? null : p.id,
                    );
                    setEditProdId(null);
                    setProdFormData({
                      title: "",
                      description: "",
                      categoryType: "DEVELOPMENT",
                      technologiesString: "",
                      repositoryUrl: "",
                      demoUrl: "",
                      publicationSource: "",
                      documentUrl: "",
                      location: "",
                    });
                    setManagingTeamProdId(null);
                  }}
                  disabled={loadingAction !== null}
                  className="text-sm font-bold text-[#F37021] border-2 border-[#F37021] px-4 py-2 hover:bg-[#F37021] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                      : `Añadir Nuevo Producto a ${p.title}`}
                  </h5>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-mono text-gray-500 mb-1">
                        TÍTULO DEL PRODUCTO
                      </label>
                      <input
                        type="text"
                        required
                        disabled={loadingAction === `save-prod-${p.id}`}
                        value={prodFormData.title}
                        onChange={(e) =>
                          setProdFormData({
                            ...prodFormData,
                            title: e.target.value,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                      />
                    </div>
                    <div className="w-full md:w-64">
                      <label className="block text-xs font-mono text-gray-500 mb-1">
                        CATEGORÍA
                      </label>
                      <select
                        value={prodFormData.categoryType}
                        onChange={(e) =>
                          setProdFormData({
                            ...prodFormData,
                            categoryType: e.target.value as CategoryType,
                          })
                        }
                        className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021] bg-white disabled:bg-gray-100"
                        disabled={
                          !!editProdId || loadingAction === `save-prod-${p.id}`
                        }
                      >
                        <option value="DEVELOPMENT">
                          Software / Desarrollo
                        </option>
                        <option value="WRITING">Artículo / Memoria</option>
                        <option value="EVENT">Evento</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1">
                      DESCRIPCIÓN BREVE
                    </label>
                    <textarea
                      required
                      disabled={loadingAction === `save-prod-${p.id}`}
                      value={prodFormData.description}
                      onChange={(e) =>
                        setProdFormData({
                          ...prodFormData,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                    />
                  </div>

                  {/* Campos dinámicos según Categoría */}
                  <div className="p-4 border border-gray-200 bg-white">
                    {prodFormData.categoryType === "DEVELOPMENT" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                            <FileCode className="w-3 h-3 mr-1" /> TECNOLOGÍAS
                            (Separadas por coma)
                          </label>
                          <input
                            type="text"
                            disabled={loadingAction === `save-prod-${p.id}`}
                            value={prodFormData.technologiesString}
                            onChange={(e) =>
                              setProdFormData({
                                ...prodFormData,
                                technologiesString: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-gray-500 mb-1">
                            URL REPOSITORIO
                          </label>
                          <input
                            type="url"
                            disabled={loadingAction === `save-prod-${p.id}`}
                            value={prodFormData.repositoryUrl}
                            onChange={(e) =>
                              setProdFormData({
                                ...prodFormData,
                                repositoryUrl: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-gray-500 mb-1">
                            URL DEMO
                          </label>
                          <input
                            type="url"
                            disabled={loadingAction === `save-prod-${p.id}`}
                            value={prodFormData.demoUrl}
                            onChange={(e) =>
                              setProdFormData({
                                ...prodFormData,
                                demoUrl: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    )}
                    {prodFormData.categoryType === "WRITING" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                            <FileText className="w-3 h-3 mr-1" /> FUENTE DE
                            PUBLICACIÓN
                          </label>
                          <input
                            type="text"
                            disabled={loadingAction === `save-prod-${p.id}`}
                            value={prodFormData.publicationSource}
                            onChange={(e) =>
                              setProdFormData({
                                ...prodFormData,
                                publicationSource: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-gray-500 mb-1">
                            URL DEL DOCUMENTO
                          </label>
                          <input
                            type="url"
                            disabled={loadingAction === `save-prod-${p.id}`}
                            value={prodFormData.documentUrl}
                            onChange={(e) =>
                              setProdFormData({
                                ...prodFormData,
                                documentUrl: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    )}
                    {prodFormData.categoryType === "EVENT" && (
                      <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" /> CIUDAD / LOCALIDAD
                          DEL EVENTO
                        </label>
                        <input
                          type="text"
                          disabled={loadingAction === `save-prod-${p.id}`}
                          value={prodFormData.location}
                          onChange={(e) =>
                            setProdFormData({
                              ...prodFormData,
                              location: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      disabled={loadingAction === `save-prod-${p.id}`}
                      className="bg-[#1E293B] text-white px-6 py-3 font-bold hover:bg-[#2D5A27] transition flex-1 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loadingAction === `save-prod-${p.id}` ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                          GUARDANDO...
                        </>
                      ) : editProdId ? (
                        "GUARDAR CAMBIOS DEL PRODUCTO"
                      ) : (
                        "GUARDAR NUEVO PRODUCTO"
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={loadingAction === `save-prod-${p.id}`}
                      onClick={() => setActiveFormProjectId(null)}
                      className="bg-gray-200 text-gray-700 px-6 py-3 font-bold hover:bg-gray-300 transition disabled:opacity-50"
                    >
                      CANCELAR
                    </button>
                  </div>
                </form>
              )}

              {/* Grid de Productos Creados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(p.products || []).map((prod) => {
                  const membersIds = (prod.participations || []).map(
                    (part) => part.memberId,
                  );
                  const availableMembers = members.filter(
                    (m) =>
                      !membersIds.includes(m.id) && m.systemRole !== "ADMIN", // Aquí podrías decidir si el Admin también puede ser asignado. Lo dejo excluido por ahora como estaba.
                  );

                  return (
                    <div
                      key={prod.id}
                      className={`border p-4 relative group transition flex flex-col ${
                        loadingAction === `delete-prod-${prod.id}`
                          ? "border-red-300 bg-red-50 opacity-50"
                          : "border-gray-200 hover:border-[#1E293B]"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`text-[10px] font-mono font-bold px-2 py-1 inline-block text-white ${prod.categoryType === "DEVELOPMENT" ? "bg-blue-600" : prod.categoryType === "WRITING" ? "bg-purple-600" : "bg-[#F37021]"}`}
                          >
                            {prod.categoryType === "DEVELOPMENT"
                              ? "DESARROLLO"
                              : prod.categoryType === "WRITING"
                                ? "ESCRITO"
                                : "EVENTO"}
                          </div>
                          <BadgeEstado estado={prod.approvalStatus as any} />
                        </div>

                        {/* Acciones del Producto */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() =>
                              setManagingTeamProdId(
                                managingTeamProdId === prod.id ? null : prod.id,
                              )
                            }
                            disabled={loadingAction !== null}
                            className="bg-gray-100 text-gray-600 p-1.5 hover:bg-[#2D5A27] hover:text-white transition disabled:opacity-50"
                            title="Gestionar Equipo"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditProductClick(p.id, prod)}
                            disabled={loadingAction !== null}
                            className="bg-gray-100 text-gray-600 p-1.5 hover:bg-blue-600 hover:text-white transition disabled:opacity-50"
                            title="Editar Producto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, prod.id)}
                            disabled={loadingAction !== null}
                            className="bg-gray-100 text-gray-600 p-1.5 hover:bg-red-600 hover:text-white transition disabled:opacity-50 flex items-center justify-center min-w-[30px]"
                            title="Eliminar Producto"
                          >
                            {loadingAction === `delete-prod-${prod.id}` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <h5 className="font-bold text-[#1E293B] mb-1">
                        {prod.title}
                      </h5>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">
                        {prod.description}
                      </p>

                      {/* Resumen del equipo en la tarjeta */}
                      <div className="flex -space-x-2 mt-auto pt-3 border-t border-gray-100">
                        {(prod.participations || []).map((part) => (
                          <img
                            key={part.id}
                            src={part.memberPhotoUrl || undefined}
                            alt={part.memberName}
                            title={`${part.memberName} - ${part.productRole}`}
                            className="w-6 h-6 border border-white bg-gray-200 object-cover rounded-full"
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
                            {(prod.participations || []).map((part) => (
                              <li
                                key={part.id}
                                className={`flex justify-between items-center bg-white border p-2 text-xs transition ${loadingAction === `remove-team-${part.id}` ? "border-red-300 opacity-50" : "border-gray-200"}`}
                              >
                                <div className="flex items-center">
                                  <img
                                    src={part.memberPhotoUrl || undefined}
                                    alt=""
                                    className="w-5 h-5 mr-2 object-cover border border-gray-300 rounded-full"
                                  />
                                  <span className="font-medium mr-1">
                                    {part.memberName}
                                  </span>
                                  <span className="text-gray-400">
                                    ({part.productRole})
                                  </span>
                                </div>
                                {part.memberId !== currentUser?.id && (
                                  <button
                                    onClick={() =>
                                      handleRemoveTeamMember(
                                        p.id,
                                        prod.id,
                                        part.id,
                                      )
                                    }
                                    disabled={loadingAction !== null}
                                    className="text-red-400 hover:text-red-600 disabled:opacity-50"
                                  >
                                    {loadingAction ===
                                    `remove-team-${part.id}` ? (
                                      <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                                    ) : (
                                      <X className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>

                          {availableMembers.length > 0 ? (
                            <form
                              onSubmit={(e) =>
                                handleAddTeamMember(e, p.id, prod.id)
                              }
                              className="flex flex-col gap-2"
                            >
                              <select
                                value={teamForm.memberId}
                                disabled={
                                  loadingAction === `add-team-${prod.id}`
                                }
                                onChange={(e) =>
                                  setTeamForm({
                                    ...teamForm,
                                    memberId: e.target.value,
                                  })
                                }
                                className="text-xs border border-gray-300 p-2 bg-white disabled:bg-gray-100"
                                required
                              >
                                <option value="">
                                  Seleccionar compañero...
                                </option>
                                {availableMembers.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.fullName} ({m.career})
                                  </option>
                                ))}
                              </select>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Rol (Ej. Analista QA)"
                                  value={teamForm.role}
                                  disabled={
                                    loadingAction === `add-team-${prod.id}`
                                  }
                                  onChange={(e) =>
                                    setTeamForm({
                                      ...teamForm,
                                      role: e.target.value,
                                    })
                                  }
                                  className="text-xs border border-gray-300 p-2 flex-1 disabled:bg-gray-100"
                                  required
                                />
                                <button
                                  type="submit"
                                  disabled={
                                    loadingAction === `add-team-${prod.id}`
                                  }
                                  className="bg-[#2D5A27] text-white px-3 py-2 text-xs font-bold hover:bg-[#1f3f1b] flex items-center justify-center min-w-[85px] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                  {loadingAction === `add-team-${prod.id}` ? (
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  ) : (
                                    <UserPlus className="w-3 h-3 mr-1" />
                                  )}
                                  AÑADIR
                                </button>
                              </div>
                            </form>
                          ) : (
                            <p className="text-xs text-gray-400 italic">
                              No hay más miembros disponibles para añadir.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {(!p.products || p.products.length === 0) &&
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
