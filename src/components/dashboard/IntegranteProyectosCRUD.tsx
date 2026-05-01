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
import { useDataStore } from "@/store/useDataStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Project, AcademicProduct, CategoryType, Participation } from "@/types";
import BadgeEstado from "@/components/ui/BadgeEstado";

// Tipo temporal para gestionar el equipo en el formulario
type DraftParticipant = {
  tempId: string;
  memberId: number;
  memberName: string;
  memberPhotoUrl: string;
  productRole: string;
};

export default function IntegranteProyectosCRUD() {
  // <-- MODIFICADO: Importamos también 'competencies'
  const {
    projects,
    members,
    competencies,
    addProject,
    updateProject,
    deleteProject,
  } = useDataStore();
  const { currentUser } = useAuthStore();

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // --- ESTADOS: PROYECTO MACRO ---
  const [isAddingProj, setIsAddingProj] = useState(false);
  const [editProjId, setEditProjId] = useState<number | null>(null);

  const [projFormData, setProjFormData] = useState({
    title: "",
    objective: "",
    awards: "",
    startDate: "",
    endDate: "",
    coverImageUrl: "",
  });

  // --- ESTADOS: PRODUCTOS ACADÉMICOS Y EQUIPO ---
  const [activeFormProjectId, setActiveFormProjectId] = useState<number | null>(
    null,
  );
  const [editProdId, setEditProdId] = useState<number | null>(null);

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

  // Estados temporales para los miembros del equipo en el formulario del producto
  const [draftParticipants, setDraftParticipants] = useState<
    DraftParticipant[]
  >([]);
  const [draftTeamMemberId, setDraftTeamMemberId] = useState("");
  const [draftTeamRole, setDraftTeamRole] = useState("");

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
  // LÓGICA: PRODUCTOS ACADÉMICOS Y EQUIPO
  // ------------------------------------------------------------------------
  const openNewProductForm = (projectId: number) => {
    setActiveFormProjectId(projectId);
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

    // Añadimos por defecto al usuario actual como Líder
    const userDetails = members.find((m) => m.id === currentUser?.id);
    if (userDetails) {
      setDraftParticipants([
        {
          tempId: `init-${Date.now()}`,
          memberId: userDetails.id,
          memberName: userDetails.fullName,
          memberPhotoUrl: userDetails.photoUrl,
          productRole: "Líder de Producto",
        },
      ]);
    } else {
      setDraftParticipants([]);
    }
  };

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

    // Cargamos los participantes actuales al borrador
    setDraftParticipants(
      (prod.participations || []).map((p) => ({
        tempId: p.id.toString(),
        memberId: p.memberId,
        memberName: p.memberName,
        memberPhotoUrl: p.memberPhotoUrl,
        productRole: p.productRole,
      })),
    );
  };

  // <-- NUEVO: Funciones para gestionar el equipo temporal del producto
  const handleAddDraftParticipant = () => {
    if (!draftTeamMemberId || !draftTeamRole) return;
    const member = members.find((m) => m.id === Number(draftTeamMemberId));
    if (!member) return;

    setDraftParticipants([
      ...draftParticipants,
      {
        tempId: Date.now().toString(),
        memberId: member.id,
        memberName: member.fullName,
        memberPhotoUrl: member.photoUrl,
        productRole: draftTeamRole,
      },
    ]);

    // Limpiamos los selectores
    setDraftTeamMemberId("");
    setDraftTeamRole("");
  };

  const handleRemoveDraftParticipant = (tempId: string) => {
    setDraftParticipants(draftParticipants.filter((p) => p.tempId !== tempId));
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

      // Mapeamos los participantes del borrador al formato final
      const allParts = projects
        .flatMap((p) => p.products || [])
        .flatMap((p) => p.participations || []);
      let nextPartId =
        allParts.length > 0 ? Math.max(...allParts.map((p) => p.id)) : 0;

      const finalParticipations: Participation[] = draftParticipants.map(
        (draft) => {
          // Si estamos editando, revisamos si este miembro ya existía para mantener su ID
          const existingPart = editProdId
            ? project.products
                ?.find((p) => p.id === editProdId)
                ?.participations?.find((p) => p.memberId === draft.memberId)
            : null;

          if (existingPart) {
            return { ...existingPart, productRole: draft.productRole };
          } else {
            nextPartId++;
            return {
              id: nextPartId,
              memberId: draft.memberId,
              productId: editProdId || 0, // Si es 0 se ajusta abajo en newProduct
              productRole: draft.productRole,
              startDate: project.startDate,
              endDate: project.endDate,
              memberName: draft.memberName,
              memberPhotoUrl: draft.memberPhotoUrl,
            };
          }
        },
      );

      if (editProdId) {
        const updatedProducts = (project.products || []).map((p) =>
          p.id === editProdId
            ? {
                ...p,
                ...baseProductData,
                participations: finalParticipations,
                approvalStatus: "PENDING" as const,
              }
            : p,
        );
        await updateProject(projectId, { products: updatedProducts });
      } else {
        const allProds = projects.flatMap((p) => p.products || []);
        const nextProdId =
          allProds.length > 0 ? Math.max(...allProds.map((p) => p.id)) + 1 : 1;

        // Ajustamos el productId de las participaciones nuevas
        finalParticipations.forEach((p) => (p.productId = nextProdId));

        const newProduct: AcademicProduct = {
          id: nextProdId,
          projectId: projectId,
          ...baseProductData,
          participations: finalParticipations,
          approvalStatus: "PENDING",
        };
        await updateProject(projectId, {
          products: [...(project.products || []), newProduct],
        });
      }

      // Limpiamos los estados al guardar
      setActiveFormProjectId(null);
      setEditProdId(null);
      setDraftParticipants([]);
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

      {/* FORMULARIO DE PROYECTO MACRO (Sin cambios) */}
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
        {misProyectos.map((p) => {
          // Pre-cálculos para la selección de equipo en el formulario
          const draftMemberIds = draftParticipants.map((part) => part.memberId);
          const availableMembers = members.filter(
            (m) => !draftMemberIds.includes(m.id) && m.systemRole !== "ADMIN",
          );

          return (
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
                  <p className="text-sm text-gray-600 max-w-3xl">
                    {p.objective}
                  </p>
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
                    onClick={() =>
                      activeFormProjectId === p.id && !editProdId
                        ? setActiveFormProjectId(null)
                        : openNewProductForm(p.id)
                    }
                    disabled={loadingAction !== null}
                    className="text-sm font-bold text-[#F37021] border-2 border-[#F37021] px-4 py-2 hover:bg-[#F37021] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {activeFormProjectId === p.id && !editProdId
                      ? "CANCELAR"
                      : "+ AÑADIR PRODUCTO"}
                  </button>
                </div>

                {/* --- FORMULARIO ANIDADO PARA PRODUCTO Y EQUIPO --- */}
                {activeFormProjectId === p.id && (
                  <form
                    onSubmit={(e) => handleSaveProduct(e, p.id)}
                    className="mb-8 bg-gray-50 border-2 border-dashed border-[#F37021] relative"
                  >
                    {editProdId && (
                      <div className="absolute top-0 right-0 bg-[#F37021] text-white text-[10px] font-mono px-3 py-1 font-bold z-10">
                        MODO EDICIÓN
                      </div>
                    )}

                    {/* PARTE 1: DATOS DEL PRODUCTO */}
                    <div className="p-6 space-y-4 border-b-2 border-dashed border-gray-300">
                      <h5 className="font-bold text-[#F37021] mb-2 flex items-center">
                        <Folder className="w-4 h-4 mr-2" />
                        {editProdId
                          ? "Datos del Producto"
                          : `Nuevo Producto para ${p.title}`}
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
                              !!editProdId ||
                              loadingAction === `save-prod-${p.id}`
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
                                <FileCode className="w-3 h-3 mr-1" />{" "}
                                TECNOLOGÍAS (Separadas por coma)
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
                              <MapPin className="w-3 h-3 mr-1" /> CIUDAD /
                              LOCALIDAD DEL EVENTO
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
                    </div>

                    {/* PARTE 2: GESTIÓN DE EQUIPO DEL PRODUCTO */}
                    <div className="p-6 bg-white space-y-4">
                      <div className="flex flex-col mb-4">
                        <h5 className="font-bold text-[#1E293B] flex items-center">
                          <Users className="w-5 h-5 mr-2 text-[#2D5A27]" />{" "}
                          Equipo del Producto
                        </h5>
                        <p className="text-xs text-gray-500 mt-1">
                          Añade colaboradores y asígnales un rol basado en sus
                          competencias. Los cambios en el equipo se aplicarán al
                          guardar el producto.
                        </p>
                      </div>

                      {/* Lista de participantes actuales (en borrador) */}
                      <ul className="space-y-2 mb-4">
                        {draftParticipants.map((part) => (
                          <li
                            key={part.tempId}
                            className="flex justify-between items-center bg-gray-50 border border-gray-200 p-3 text-sm"
                          >
                            <div className="flex items-center">
                              <img
                                src={part.memberPhotoUrl || undefined}
                                alt={part.memberName}
                                className="w-8 h-8 mr-3 object-cover border border-[#1E293B] bg-white"
                              />
                              <div>
                                <span className="font-bold text-[#1E293B] block">
                                  {part.memberName}
                                </span>
                                <span className="text-xs text-[#2D5A27] font-mono font-bold bg-green-50 px-1 border border-green-200">
                                  {part.productRole}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button" // Evita que envíe el formulario
                              onClick={() =>
                                handleRemoveDraftParticipant(part.tempId)
                              }
                              disabled={loadingAction !== null}
                              className="text-gray-400 hover:text-red-600 bg-white p-2 border border-gray-300 transition disabled:opacity-50"
                              title="Remover participante"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                        {draftParticipants.length === 0 && (
                          <li className="text-center p-4 border border-dashed border-gray-300 text-gray-500 text-sm">
                            No has añadido ningún integrante a este producto.
                          </li>
                        )}
                      </ul>

                      {/* Controles para añadir un nuevo participante al borrador */}
                      {availableMembers.length > 0 ? (
                        <div className="flex flex-col md:flex-row gap-2 bg-gray-100 p-4 border border-gray-200">
                          <select
                            value={draftTeamMemberId}
                            onChange={(e) =>
                              setDraftTeamMemberId(e.target.value)
                            }
                            className="flex-1 text-sm border-2 border-gray-300 p-2 bg-white outline-none focus:border-[#F37021]"
                          >
                            <option value="">Seleccionar compañero...</option>
                            {availableMembers.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.fullName} ({m.career})
                              </option>
                            ))}
                          </select>

                          <select
                            value={draftTeamRole}
                            onChange={(e) => setDraftTeamRole(e.target.value)}
                            className="flex-1 text-sm border-2 border-gray-300 p-2 bg-white outline-none focus:border-[#F37021]"
                          >
                            <option value="">
                              Asignar un rol / competencia...
                            </option>
                            <option
                              value="Líder de Producto"
                              className="font-bold"
                            >
                              Líder de Producto / Autor Principal
                            </option>
                            <optgroup label="Competencias Técnicas">
                              {competencies
                                .filter((c) => c.type === "TECHNICAL")
                                .map((c) => (
                                  <option key={c.id} value={c.name}>
                                    {c.name}
                                  </option>
                                ))}
                            </optgroup>
                            <optgroup label="Competencias Transversales">
                              {competencies
                                .filter((c) => c.type === "SOFT")
                                .map((c) => (
                                  <option key={c.id} value={c.name}>
                                    {c.name}
                                  </option>
                                ))}
                            </optgroup>
                          </select>

                          <button
                            type="button" // MUY IMPORTANTE: type="button" para no disparar handleSaveProduct
                            onClick={handleAddDraftParticipant}
                            disabled={
                              !draftTeamMemberId ||
                              !draftTeamRole ||
                              loadingAction !== null
                            }
                            className="bg-[#1E293B] text-white px-4 py-2 text-sm font-bold hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
                          >
                            <UserPlus className="w-4 h-4 mr-2" /> AÑADIR
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic mt-2">
                          No hay más integrantes disponibles para añadir.
                        </p>
                      )}
                    </div>

                    {/* BOTONES DE ACCIÓN FINAL */}
                    <div className="flex gap-3 p-6 bg-gray-50 border-t-2 border-dashed border-[#F37021]">
                      <button
                        type="submit"
                        disabled={loadingAction === `save-prod-${p.id}`}
                        className="bg-[#F37021] text-white px-6 py-3 font-bold border-2 border-[#1E293B] hover:bg-[#e06015] transition flex-1 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
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
                        onClick={() => {
                          setActiveFormProjectId(null);
                          setDraftParticipants([]);
                        }}
                        className="bg-gray-200 text-[#1E293B] border-2 border-[#1E293B] px-6 py-3 font-bold hover:bg-gray-300 transition disabled:opacity-50"
                      >
                        CANCELAR
                      </button>
                    </div>
                  </form>
                )}

                {/* Grid de Productos Creados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(p.products || []).map((prod) => (
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
                            onClick={() => handleEditProductClick(p.id, prod)}
                            disabled={loadingAction !== null}
                            className="bg-gray-100 text-gray-600 p-1.5 hover:bg-blue-600 hover:text-white transition disabled:opacity-50"
                            title="Editar Producto y Equipo"
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
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                        <div className="flex -space-x-2">
                          {(prod.participations || []).map((part) => (
                            <img
                              key={part.id}
                              src={part.memberPhotoUrl || undefined}
                              alt={part.memberName}
                              title={`${part.memberName} - ${part.productRole}`}
                              className="w-8 h-8 border-2 border-white bg-gray-200 object-cover rounded-full"
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">
                          {prod.participations?.length || 0} Integrante(s)
                        </span>
                      </div>
                    </div>
                  ))}

                  {(!p.products || p.products.length === 0) &&
                    activeFormProjectId !== p.id && (
                      <div className="col-span-2 p-6 border-2 border-dashed border-gray-300 text-center text-gray-500 text-sm">
                        Aún no has registrado ningún producto (software, escrito
                        o evento) para este proyecto.
                      </div>
                    )}
                </div>
              </div>
            </div>
          );
        })}
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
