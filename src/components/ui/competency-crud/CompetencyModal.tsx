"use client";

import React from "react";
import { X, Loader2 } from "lucide-react";

interface CompetencyFormData {
  name: string;
  description: string;
  type: "TECHNICAL" | "SOFT";
}

interface CompetencyModalProps {
  editId: number | null;
  loadingAction: string | null;
  formData: CompetencyFormData;
  onChange: (next: CompetencyFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function CompetencyModal({
  editId,
  loadingAction,
  formData,
  onChange,
  onSubmit,
  onClose,
}: CompetencyModalProps) {
  const isSaving = loadingAction === "save";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white pixel-border shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-[#1E293B]">
            {editId ? "Editar Competencia" : "Nueva Competencia"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-[#1E293B] transition disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              NOMBRE CORTO
            </label>
            <input
              type="text"
              required
              disabled={isSaving}
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              className="w-full border-2 border-gray-300 p-3 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
              placeholder="Ej. JavaScript, Liderazgo"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              DESCRIPCIÓN
            </label>
            <textarea
              required
              disabled={isSaving}
              value={formData.description}
              onChange={(e) =>
                onChange({ ...formData, description: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-3 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100 min-h-[100px] resize-none"
              placeholder="Describe brevemente esta competencia..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              TIPO DE COMPETENCIA
            </label>
            <select
              value={formData.type}
              disabled={isSaving}
              onChange={(e) =>
                onChange({
                  ...formData,
                  type: e.target.value as "TECHNICAL" | "SOFT",
                })
              }
              className="w-full border-2 border-gray-300 p-3 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
            >
              <option value="TECHNICAL">TÉCNICA</option>
              <option value="SOFT">TRANSVERSAL</option>
            </select>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#F37021] text-white px-8 py-3 font-bold border-2 border-[#1E293B] hover:bg-[#e06015] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </span>
              ) : editId ? (
                "Actualizar"
              ) : (
                "Crear Competencia"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}