"use client";

import React from "react";
import { X, Loader2 } from "lucide-react";
import { ProjectFormData } from "./types";
import FileUploadInput from "@/components/ui/FileUploadInput";

interface ProjectMacroModalProps {
  editProjId: number | null;
  loadingAction: string | null;
  formData: ProjectFormData;
  onChange: (next: ProjectFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function ProjectMacroModal({
  editProjId,
  loadingAction,
  formData,
  onChange,
  onSubmit,
  onClose,
}: ProjectMacroModalProps) {
  const isSaving = loadingAction === "save-project";

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