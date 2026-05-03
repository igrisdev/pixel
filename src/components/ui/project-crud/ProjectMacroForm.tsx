import React from "react";
import { Loader2 } from "lucide-react";
import { ProjectFormData } from "./types";

type Props = {
  editProjId: number | null;
  loadingAction: string | null;
  formData: ProjectFormData;
  onChange: (next: ProjectFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function ProjectMacroForm({
  editProjId,
  loadingAction,
  formData,
  onChange,
  onSubmit,
}: Props) {
  const isSaving = loadingAction === "save-project";

  return (
    <form
      onSubmit={onSubmit}
      className="mb-10 p-6 md:p-8 bg-[#F8F9FA] border-2 border-[#1E293B] space-y-5 relative"
    >
      {editProjId && (
        <div className="absolute top-0 right-0 bg-[#F37021] text-white text-[10px] font-mono px-3 py-1 font-bold">
          MODO EDICIÓN
        </div>
      )}
      <h3 className="font-bold text-lg text-[#1E293B] mb-2">
        {editProjId ? "Editando Proyecto Macro" : "Datos del Nuevo Proyecto Macro"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
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
        <div className="md:col-span-2">
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
        <div>
          <label className="block text-xs font-mono text-gray-500 mb-1">URL IMAGEN DE PORTADA</label>
          <input
            type="url"
            disabled={isSaving}
            value={formData.coverImageUrl}
            onChange={(e) => onChange({ ...formData, coverImageUrl: e.target.value })}
            className="w-full border-2 border-gray-300 focus:border-[#F37021] p-3 disabled:bg-gray-100"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full bg-[#F37021] hover:bg-[#e06015] text-white py-4 font-bold border-2 border-[#1E293B] mt-4 transition pixel-border-accent flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
        {isSaving
          ? "GUARDANDO..."
          : editProjId
            ? "GUARDAR CAMBIOS DEL PROYECTO"
            : "CREAR PROYECTO MACRO"}
      </button>
    </form>
  );
}
