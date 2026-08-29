"use client";

import React from "react";
import { X, Calendar, FileCode, FileText, Folder, Loader2, MapPin, UserPlus, Users } from "lucide-react";
import { CategoryType, Competency, Member } from "@/types";
import { DraftParticipant, ProductFormData } from "./types";
import FileUploadInput from "@/components/ui/FileUploadInput";
import ProductImagesInput from "@/components/ui/ProductImagesInput";
import { CATEGORY_LABELS } from "@/lib/category";

interface ProductModalProps {
  projectId: number;
  projectTitle: string;
  editProdId: number | null;
  loadingAction: string | null;
  productFormData: ProductFormData;
  draftParticipants: DraftParticipant[];
  availableMembers: Member[];
  competencies: Competency[];
  draftTeamMemberId: string;
  draftTeamRole: string;
  onSubmit: (e: React.FormEvent, projectId: number) => void;
  onProductFormDataChange: (next: ProductFormData) => void;
  onDraftTeamMemberIdChange: (value: string) => void;
  onDraftTeamRoleChange: (value: string) => void;
  onAddDraftParticipant: () => void;
  onRemoveDraftParticipant: (tempId: string) => void;
  onClose: () => void;
}

export default function ProductModal({
  projectId,
  projectTitle,
  editProdId,
  loadingAction,
  productFormData,
  draftParticipants,
  availableMembers,
  competencies,
  draftTeamMemberId,
  draftTeamRole,
  onSubmit,
  onProductFormDataChange,
  onDraftTeamMemberIdChange,
  onDraftTeamRoleChange,
  onAddDraftParticipant,
  onRemoveDraftParticipant,
  onClose,
}: ProductModalProps) {
  const isSaving = loadingAction === `save-prod-${projectId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white pixel-border shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-[#1E293B] flex items-center">
            <Folder className="w-5 h-5 mr-2 text-[#F37021]" />
            {editProdId ? "Editar Producto" : `Nuevo Producto para ${projectTitle}`}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-[#1E293B] transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => onSubmit(e, projectId)} className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-mono text-gray-500 mb-1">TÍTULO DEL PRODUCTO</label>
              <input
                type="text"
                required
                disabled={isSaving}
                value={productFormData.title}
                onChange={(e) =>
                  onProductFormDataChange({
                    ...productFormData,
                    title: e.target.value,
                  })
                }
                className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
              />
            </div>
            <div className="w-full md:w-64">
              <label className="block text-xs font-mono text-gray-500 mb-1">CATEGORÍA</label>
              <select
                value={productFormData.categoryType}
                onChange={(e) =>
                  onProductFormDataChange({
                    ...productFormData,
                    categoryType: e.target.value as CategoryType,
                  })
                }
                className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021] bg-white disabled:bg-gray-100"
                disabled={!!editProdId || isSaving}
              >
                <option value="DEVELOPMENT">{CATEGORY_LABELS.DEVELOPMENT}</option>
                <option value="WRITING">{CATEGORY_LABELS.WRITING}</option>
                <option value="EVENT">{CATEGORY_LABELS.EVENT}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">DESCRIPCIÓN BREVE</label>
            <textarea
              required
              disabled={isSaving}
              value={productFormData.description}
              onChange={(e) =>
                onProductFormDataChange({
                  ...productFormData,
                  description: e.target.value,
                })
              }
              rows={2}
              className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
            />
          </div>

          <div className="p-4 border border-gray-200 bg-white">
            <ProductImagesInput
              value={productFormData.images}
              onChange={(images) =>
                onProductFormDataChange({
                  ...productFormData,
                  images,
                })
              }
              disabled={isSaving}
            />
          </div>

          {productFormData.categoryType !== "EVENT" && (
          <div className="p-4 border border-gray-200 bg-gray-50">
            {productFormData.categoryType === "DEVELOPMENT" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                    <FileCode className="w-3 h-3 mr-1" /> TECNOLOGÍAS (Separadas por coma)
                  </label>
                  <input
                    type="text"
                    disabled={isSaving}
                    value={productFormData.technologiesString}
                    onChange={(e) =>
                      onProductFormDataChange({
                        ...productFormData,
                        technologiesString: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">URL REPOSITORIO</label>
                  <input
                    type="url"
                    disabled={isSaving}
                    value={productFormData.repositoryUrl}
                    onChange={(e) =>
                      onProductFormDataChange({
                        ...productFormData,
                        repositoryUrl: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">URL DEMO</label>
                  <input
                    type="url"
                    disabled={isSaving}
                    value={productFormData.demoUrl}
                    onChange={(e) =>
                      onProductFormDataChange({
                        ...productFormData,
                        demoUrl: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                  />
                </div>
              </div>
            )}
            {productFormData.categoryType === "WRITING" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                    <FileText className="w-3 h-3 mr-1" /> FUENTE DE PUBLICACIÓN
                  </label>
                  <input
                    type="text"
                    disabled={isSaving}
                    value={productFormData.publicationSource}
                    onChange={(e) =>
                      onProductFormDataChange({
                        ...productFormData,
                        publicationSource: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <FileUploadInput
                    value={productFormData.documentUrl}
                    onChange={(url) =>
                      onProductFormDataChange({
                        ...productFormData,
                        documentUrl: url,
                      })
                    }
                    uploadType="documents"
                    accept=".pdf"
                    label="DOCUMENTO (PDF)"
                    placeholder="Selecciona un PDF..."
                  />
                </div>
              </div>
            )}
          </div>
          )}

          {/* Contexto opcional: aplica a cualquier categoría de producto. */}
          <div className="p-4 border border-gray-200 bg-gray-50 space-y-4">
            <p className="text-xs font-mono text-gray-500 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> CONTEXTO DEL PRODUCTO (OPCIONAL)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">CIUDAD</label>
                <input
                  type="text"
                  disabled={isSaving}
                  value={productFormData.city}
                  onChange={(e) =>
                    onProductFormDataChange({ ...productFormData, city: e.target.value })
                  }
                  placeholder="Popayán"
                  className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">EVENTO</label>
                <input
                  type="text"
                  disabled={isSaving}
                  value={productFormData.eventName}
                  onChange={(e) =>
                    onProductFormDataChange({ ...productFormData, eventName: e.target.value })
                  }
                  placeholder="Congreso Nacional de Ingeniería"
                  className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">LUGAR</label>
                <input
                  type="text"
                  disabled={isSaving}
                  value={productFormData.venue}
                  onChange={(e) =>
                    onProductFormDataChange({ ...productFormData, venue: e.target.value })
                  }
                  placeholder="Universidad Colegio Mayor"
                  className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> FECHA DE INICIO
                </label>
                <input
                  type="date"
                  disabled={isSaving}
                  value={productFormData.startDate}
                  onChange={(e) =>
                    onProductFormDataChange({ ...productFormData, startDate: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> FECHA DE FIN
                </label>
                <input
                  type="date"
                  disabled={isSaving}
                  min={productFormData.startDate || undefined}
                  value={productFormData.endDate}
                  onChange={(e) =>
                    onProductFormDataChange({ ...productFormData, endDate: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-gray-200">
            <h5 className="font-bold text-[#1E293B] flex items-center mb-3">
              <Users className="w-5 h-5 mr-2 text-[#2D5A27]" /> Equipo del Producto
            </h5>

            {draftParticipants.some((p) => p.suggested) && (
              <p className="text-xs text-[#334155] bg-orange-50 border border-[#F37021]/40 p-2 mb-3">
                Precargamos el equipo de los otros productos de este proyecto. Quita
                con <strong>✕</strong> a quienes no participaron en este producto.
              </p>
            )}

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
                      <span className="font-bold text-[#1E293B] block">{part.memberName}</span>
                      <span className="inline-flex flex-wrap items-center gap-1">
                        <span className="text-xs text-[#2D5A27] font-mono font-bold bg-green-50 px-1 border border-green-200">
                          {part.productRole}
                        </span>
                        {part.suggested && (
                          <span className="text-[10px] text-[#F37021] font-mono font-bold bg-orange-50 px-1 border border-[#F37021]/40">
                            SUGERIDO
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveDraftParticipant(part.tempId)}
                    disabled={loadingAction !== null}
                    className="text-gray-400 hover:text-red-600 bg-white p-2 border border-gray-300 transition cursor-pointer disabled:opacity-50"
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

            {availableMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-gray-100 p-3 border border-gray-200">
                <select
                  value={draftTeamMemberId}
                  onChange={(e) => onDraftTeamMemberIdChange(e.target.value)}
                  className="w-full min-w-0 text-sm border-2 border-gray-300 p-2 bg-white outline-none focus:border-[#F37021]"
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
                  onChange={(e) => onDraftTeamRoleChange(e.target.value)}
                  className="w-full min-w-0 text-sm border-2 border-gray-300 p-2 bg-white outline-none focus:border-[#F37021]"
                >
                  <option value="">Asignar un rol / competencia...</option>
                  <option value="Líder de Producto" className="font-bold">
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
                  type="button"
                  onClick={onAddDraftParticipant}
                  disabled={!draftTeamMemberId || !draftTeamRole || loadingAction !== null}
                  className="bg-[#1E293B] text-white px-4 py-2 text-sm font-bold hover:bg-black transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" /> AÑADIR
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic mt-2">No hay más integrantes disponibles para añadir.</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#F37021] text-white px-6 py-3 font-bold border-2 border-[#1E293B] hover:bg-[#e06015] transition cursor-pointer flex-1 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> GUARDANDO...
                </>
              ) : editProdId ? (
                "GUARDAR CAMBIOS DEL PRODUCTO"
              ) : (
                "GUARDAR NUEVO PRODUCTO"
              )}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="bg-gray-200 text-[#1E293B] border-2 border-[#1E293B] px-6 py-3 font-bold hover:bg-gray-300 transition cursor-pointer disabled:opacity-50"
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}