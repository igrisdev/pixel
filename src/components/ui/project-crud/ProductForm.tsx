import React from "react";
import { FileCode, FileText, Folder, Loader2, MapPin, UserPlus, Users, X } from "lucide-react";
import { CategoryType, Competency, Member } from "@/types";
import { DraftParticipant, ProductFormData } from "./types";

type Props = {
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
  onCancel: () => void;
};

export default function ProductForm({
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
  onCancel,
}: Props) {
  const isSaving = loadingAction === `save-prod-${projectId}`;

  return (
    <form
      onSubmit={(e) => onSubmit(e, projectId)}
      className="mb-8 bg-gray-50 border-2 border-dashed border-[#F37021] relative"
    >
      {editProdId && (
        <div className="absolute top-0 right-0 bg-[#F37021] text-white text-[10px] font-mono px-3 py-1 font-bold z-10">
          MODO EDICIÓN
        </div>
      )}

      <div className="p-6 space-y-4 border-b-2 border-dashed border-gray-300">
        <h5 className="font-bold text-[#F37021] mb-2 flex items-center">
          <Folder className="w-4 h-4 mr-2" />
          {editProdId ? "Datos del Producto" : `Nuevo Producto para ${projectTitle}`}
        </h5>

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
              <option value="DEVELOPMENT">Software / Desarrollo</option>
              <option value="WRITING">Artículo / Memoria</option>
              <option value="EVENT">Evento</option>
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
                <label className="block text-xs font-mono text-gray-500 mb-1">URL DEL DOCUMENTO</label>
                <input
                  type="url"
                  disabled={isSaving}
                  value={productFormData.documentUrl}
                  onChange={(e) =>
                    onProductFormDataChange({
                      ...productFormData,
                      documentUrl: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
                />
              </div>
            </div>
          )}
          {productFormData.categoryType === "EVENT" && (
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1" /> CIUDAD / LOCALIDAD DEL EVENTO
              </label>
              <input
                type="text"
                disabled={isSaving}
                value={productFormData.location}
                onChange={(e) =>
                  onProductFormDataChange({
                    ...productFormData,
                    location: e.target.value,
                  })
                }
                className="w-full border border-gray-300 p-2 focus:border-[#F37021] disabled:bg-gray-100"
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white space-y-4">
        <div className="flex flex-col mb-4">
          <h5 className="font-bold text-[#1E293B] flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#2D5A27]" /> Equipo del Producto
          </h5>
          <p className="text-xs text-gray-500 mt-1">
            Añade colaboradores y asígnales un rol basado en sus competencias. Los cambios en el
            equipo se aplicarán al guardar el producto.
          </p>
        </div>

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
                  <span className="text-xs text-[#2D5A27] font-mono font-bold bg-green-50 px-1 border border-green-200">
                    {part.productRole}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveDraftParticipant(part.tempId)}
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

        {availableMembers.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-2 bg-gray-100 p-4 border border-gray-200">
            <select
              value={draftTeamMemberId}
              onChange={(e) => onDraftTeamMemberIdChange(e.target.value)}
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
              onChange={(e) => onDraftTeamRoleChange(e.target.value)}
              className="flex-1 text-sm border-2 border-gray-300 p-2 bg-white outline-none focus:border-[#F37021]"
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
              className="bg-[#1E293B] text-white px-4 py-2 text-sm font-bold hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 mr-2" /> AÑADIR
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic mt-2">No hay más integrantes disponibles para añadir.</p>
        )}
      </div>

      <div className="flex gap-3 p-6 bg-gray-50 border-t-2 border-dashed border-[#F37021]">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#F37021] text-white px-6 py-3 font-bold border-2 border-[#1E293B] hover:bg-[#e06015] transition flex-1 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
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
          onClick={onCancel}
          className="bg-gray-200 text-[#1E293B] border-2 border-[#1E293B] px-6 py-3 font-bold hover:bg-gray-300 transition disabled:opacity-50"
        >
          CANCELAR
        </button>
      </div>
    </form>
  );
}
