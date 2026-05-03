"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Folder,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useDataStore } from "@/store/useDataStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Project, AcademicProduct, CategoryType, Participation } from "@/types";
import BadgeEstado from "@/components/ui/BadgeEstado";
import ProjectMacroForm from "@/components/ui/project-crud/ProjectMacroForm";
import ProductForm from "@/components/ui/project-crud/ProductForm";
import ProductCard from "@/components/ui/project-crud/ProductCard";
import {
  DraftParticipant,
  ProductFormData,
  ProjectFormData,
} from "@/components/ui/project-crud/types";

export default function IntegranteProyectosCRUD() {
  // <-- MODIFICADO: Importamos también 'competencies'
  const {
    projects,
    members,
    competencies,
    loadMembers,
    loadCompetencies,
    loadProjects,
    addProject,
    updateProject,
    deleteProject,
  } = useDataStore();
  const { currentUser } = useAuthStore();

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- ESTADOS: PROYECTO MACRO ---
  const [isAddingProj, setIsAddingProj] = useState(false);
  const [editProjId, setEditProjId] = useState<number | null>(null);

  const [projFormData, setProjFormData] = useState<ProjectFormData>({
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

  const [prodFormData, setProdFormData] = useState<ProductFormData>({
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

  useEffect(() => {
    if (!currentUser) return;
    void Promise.all([
      loadProjects(currentUser.id),
      loadMembers(),
      loadCompetencies(),
    ]).catch((error) => {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los datos del dashboard",
      );
    });
  }, [currentUser, loadProjects, loadMembers, loadCompetencies]);

  // ------------------------------------------------------------------------
  // LÓGICA: PROYECTOS MACRO
  // ------------------------------------------------------------------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("save-project");
    setErrorMessage(null);

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
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo guardar el proyecto");
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
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "No se pudo eliminar el proyecto");
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
    setErrorMessage(null);

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
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo guardar el producto");
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
        } catch (error) {
          setErrorMessage(error instanceof Error ? error.message : "No se pudo eliminar el producto");
        } finally {
          setLoadingAction(null);
        }
      }
    }
  };

  return (
    <div className="bg-white pixel-border p-6 md:p-8 shadow-sm">
      {errorMessage && (
        <div className="mb-6 border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700 font-semibold">
          {errorMessage}
        </div>
      )}

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

      {(isAddingProj || editProjId) && (
        <ProjectMacroForm
          editProjId={editProjId}
          loadingAction={loadingAction}
          formData={projFormData}
          onChange={setProjFormData}
          onSubmit={handleSaveProject}
        />
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
                    <BadgeEstado estado={p.approvalStatus} />
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

                {activeFormProjectId === p.id && (
                  <ProductForm
                    projectId={p.id}
                    projectTitle={p.title}
                    editProdId={editProdId}
                    loadingAction={loadingAction}
                    productFormData={prodFormData}
                    draftParticipants={draftParticipants}
                    availableMembers={availableMembers}
                    competencies={competencies}
                    draftTeamMemberId={draftTeamMemberId}
                    draftTeamRole={draftTeamRole}
                    onSubmit={handleSaveProduct}
                    onProductFormDataChange={setProdFormData}
                    onDraftTeamMemberIdChange={setDraftTeamMemberId}
                    onDraftTeamRoleChange={setDraftTeamRole}
                    onAddDraftParticipant={handleAddDraftParticipant}
                    onRemoveDraftParticipant={handleRemoveDraftParticipant}
                    onCancel={() => {
                      setActiveFormProjectId(null);
                      setDraftParticipants([]);
                    }}
                  />
                )}

                {/* Grid de Productos Creados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(p.products || []).map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      loadingAction={loadingAction}
                      onEdit={() => handleEditProductClick(p.id, prod)}
                      onDelete={() => handleDeleteProduct(p.id, prod.id)}
                    />
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
