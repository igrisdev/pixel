"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { ProfessionalLink } from "@/types";
import { ApiRepository } from "@/services/api";

interface EditLinkModalProps {
  link: ProfessionalLink;
  memberId: number;
  onClose: () => void;
  onSave: (updatedLink: ProfessionalLink) => void;
}

export default function EditLinkModal({ link, memberId, onClose, onSave }: EditLinkModalProps) {
  const [platform, setPlatform] = useState(link.platform);
  const [url, setUrl] = useState(link.url);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSaving(true);
    try {
      const updated = await ApiRepository.updateLink(memberId, link.id, { platform, url: url.trim() });
      toast.success("Enlace actualizado");
      onSave(updated);
      onClose();
    } catch {
      toast.error("Error al actualizar enlace");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white pixel-border shadow-lg w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
          <h2 className="text-lg font-bold text-[#1E293B]">Editar Enlace</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#1E293B] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-2">
              Plataforma
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              disabled={isSaving}
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] disabled:bg-gray-100 disabled:cursor-not-allowed text-[#1E293B] bg-white font-medium"
            >
              <option>GitHub</option>
              <option>LinkedIn</option>
              <option>Portafolio Web</option>
              <option>Dribbble</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-2">
              URL
            </label>
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
              disabled={isSaving}
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving || !url.trim()}
              className="flex-1 bg-[#2D5A27] hover:bg-[#1f3f1b] text-white px-5 py-3 border-2 border-[#2D5A27] font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-3 border-2 border-gray-300 text-[#1E293B] font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
