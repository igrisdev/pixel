"use client";

import React, { useState } from "react";
import { X, Loader2, UserPlus, Users, Pencil, Check } from "lucide-react";
import { ProjectFormData, DraftProjectMember } from "./types";
import FileUploadInput from "@/components/ui/FileUploadInput";
import { Member } from "@/types";

interface ProjectMacroModalProps {
  editProjId: number | null;
  loadingAction: string | null;
  formData: ProjectFormData;
  onChange: (next: ProjectFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  // Equipo del proyecto: quién puede trabajar en él y con qué permisos.
  teamMembers: DraftProjectMember[];
  availableMembers: Member[];
  draftMemberId: string;
  draftAccess: "LEADER" | "COLLABORATOR";
  onDraftMemberIdChange: (value: string) => void;
  onDraftAccessChange: (value: "LEADER" | "COLLABORATOR") => void;
  onAddTeamMember: () => void;
  onRemoveTeamMember: (memberId: number) => void;
  onChangeTeamMemberAccess: (memberId: number, access: "LEADER" | "COLLABORATOR") => void;
}

export default function ProjectMacroModal({
  editProjId,
  loadingAction,
  formData,
  onChange,
  onSubmit,
  onClose,
  teamMembers,
  availableMembers,
  draftMemberId,
  draftAccess,
  onDraftMemberIdChange,
  onDraftAccessChange,
  onAddTeamMember,
  onRemoveTeamMember,
  onChangeTeamMemberAccess,
}: ProjectMacroModalProps) {
  const isSaving = loadingAction === "save-project";
  // Fila del equipo cuyo nivel se está editando en línea.
  const [editingAccessFor, setEditingAccessFor] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white pixel-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-[#1E293B]">
            {editProjId ? "Editando Proyecto Macro" : "Nuevo Proyecto Macro"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-[#1E293B] transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">TÍTULO GENERAL</label>
            <input
              type="text"
              required
              disabled={isSaving}
              value={formData.title}
              onChange={(e) => onChange({ ...formData, title: e.target.value })}
              className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 font-medium disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">OBJETIVO PRINCIPAL</label>
            <textarea
              required
              disabled={isSaving}
              value={formData.objective}
              onChange={(e) => onChange({ ...formData, objective: e.target.value })}
              rows={2}
              className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">FECHA INICIO</label>
              <input
                type="date"
                required
                disabled={isSaving}
                value={formData.startDate}
                onChange={(e) => onChange({ ...formData, startDate: e.target.value })}
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                FECHA FIN (Opcional si sigue activo)
              </label>
              <input
                type="date"
                disabled={isSaving}
                value={formData.endDate}
                onChange={(e) => onChange({ ...formData, endDate: e.target.value })}
                className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">PREMIOS O DISTINCIONES</label>
            <input
              type="text"
              disabled={isSaving}
              value={formData.awards}
              onChange={(e) => onChange({ ...formData, awards: e.target.value })}
              className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 disabled:bg-gray-100"
            />
          </div>

          <FileUploadInput
            value={formData.coverImageUrl}
            onChange={(url) => onChange({ ...formData, coverImageUrl: url })}
            uploadType="covers"
            accept="image/*"
            label="IMAGEN DE PORTADA"
            placeholder="Selecciona una imagen..."
            preview={true}
          />

          {/* EQUIPO DEL PROYECTO */}
          <div className="p-4 border border-gray-200 bg-gray-50">
            <h5 className="font-bold text-[#1E293B] flex items-center mb-1">
              <Users className="w-5 h-5 mr-2 text-[#2D5A27]" /> Equipo del Proyecto
            </h5>
            <p className="text-xs text-gray-500 mb-3">
              Quienes agregues aquí verán el proyecto en “Mis Participaciones” y
              podrán aportar productos. El rol concreto se asigna en cada producto.
            </p>

            <ul className="space-y-2 mb-4">
              {teamMembers.map((m) => (
                <li
                  key={m.memberId}
                  className="flex justify-between items-center bg-white border border-gray-200 p-3 text-sm gap-2"
                >
                  <div className="flex items-center min-w-0">
                    <img
                      src={m.memberPhotoUrl || undefined}
                      alt={m.memberName}
                      className="w-8 h-8 mr-3 object-cover border border-[#1E293B] bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-[#1E293B] block truncate">
                        {m.memberName}
                      </span>
                      {editingAccessFor === m.memberId ? (
                        <select
                          autoFocus
                          value={m.access}
                          onChange={(e) => {
                            onChangeTeamMemberAccess(
                              m.memberId,
                              e.target.value as "LEADER" | "COLLABORATOR",
                            );
                            setEditingAccessFor(null);
                          }}
                          onBlur={() => setEditingAccessFor(null)}
                          className="text-xs border-2 border-[#F37021] p-1 bg-white outline-none"
                        >
                          <option value="COLLABORATOR">Colaborador</option>
                          <option value="LEADER">Líder</option>
                        </select>
                      ) : (
                        <span
                          className={`text-[10px] font-mono font-bold px-1 border ${
                            m.access === "LEADER"
                              ? "text-[#F37021] bg-orange-50 border-[#F37021]/40"
                              : "text-[#2D5A27] bg-green-50 border-green-200"
                          }`}
                        >
                          {m.access === "LEADER" ? "LÍDER" : "COLABORADOR"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingAccessFor(
                          editingAccessFor === m.memberId ? null : m.memberId,
                        )
                      }
                      disabled={isSaving}
                      className="text-gray-400 hover:text-[#F37021] bg-white p-2 border border-gray-300 hover:border-[#F37021] transition cursor-pointer disabled:opacity-50"
                      title={
                        editingAccessFor === m.memberId
                          ? "Terminar edición"
                          : "Cambiar nivel de acceso"
                      }
                    >
                      {editingAccessFor === m.memberId ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Pencil className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveTeamMember(m.memberId)}
                      disabled={isSaving}
                      className="text-gray-400 hover:text-red-600 bg-white p-2 border border-gray-300 transition cursor-pointer disabled:opacity-50"
                      title="Quitar del equipo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
              {teamMembers.length === 0 && (
                <li className="text-center p-4 border border-dashed border-gray-300 text-gray-500 text-sm">
                  Solo tú tienes acceso a este proyecto.
                </li>
              )}
            </ul>

            {availableMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-gray-100 p-3 border border-gray-200">
                <select
                  value={draftMemberId}
                  onChange={(e) => onDraftMemberIdChange(e.target.value)}
                  disabled={isSaving}
                  className="w-full min-w-0 text-sm border-2 border-gray-300 p-2 bg-white outline-none focus:border-[#F37021]"
                >
                  <option value="">Seleccionar integrante...</option>
                  {availableMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName}
                    </option>
                  ))}
                </select>

                <select
                  value={draftAccess}
                  onChange={(e) =>
                    onDraftAccessChange(e.target.value as "LEADER" | "COLLABORATOR")
                  }
                  disabled={isSaving}
                  className="w-full min-w-0 text-sm border-2 border-gray-300 p-2 bg-white outline-none focus:border-[#F37021]"
                >
                  <option value="COLLABORATOR">Colaborador (agrega productos)</option>
                  <option value="LEADER">Líder (edita el proyecto)</option>
                </select>

                <button
                  type="button"
                  onClick={onAddTeamMember}
                  disabled={!draftMemberId || isSaving}
                  className="bg-[#1E293B] text-white px-4 py-2 text-sm font-bold hover:bg-black transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" /> AÑADIR
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No hay más integrantes disponibles para añadir.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-[#F37021] hover:bg-[#e06015] text-white py-3 font-bold border-2 border-[#F37021] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSaving
                ? "GUARDANDO..."
                : editProjId
                  ? "GUARDAR CAMBIOS"
                  : "CREAR PROYECTO"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-3 border-2 border-gray-300 text-[#1E293B] font-semibold hover:bg-gray-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}