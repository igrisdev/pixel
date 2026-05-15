"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface MemberFormData {
  fullName: string;
  institutionalEmail: string;
  passwordHash: string;
  newPassword?: string;
  career: string;
  academicStatus: "STUDENT" | "GRADUATE";
  systemRole: "ADMIN" | "MEMBER";
}

interface MemberModalProps {
  editId: number | null;
  loadingAction: string | null;
  formData: MemberFormData;
  onChange: (next: MemberFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const opcionesCarreras = [
  "Ingeniería Informática",
  "Tecnología en Desarrollo de Software",
  "Diseño Visual",
  "Administración de Empresas",
  "Otra",
];

export default function MemberModal({
  editId,
  loadingAction,
  formData,
  onChange,
  onSubmit,
  onClose,
}: MemberModalProps) {
  const isSaving = loadingAction === "save";
  const [changePassword, setChangePassword] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white pixel-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-[#1E293B]">
            {editId ? "Editar Integrante" : "Nuevo Integrante"}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                NOMBRE COMPLETO
              </label>
              <input
                type="text"
                required
                disabled={isSaving}
                value={formData.fullName}
                onChange={(e) => onChange({ ...formData, fullName: e.target.value })}
                className="w-full border-2 border-gray-300 p-3 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
                placeholder="Ej. Isabella Velasco"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                CARRERA
              </label>
              <select
                required
                disabled={isSaving}
                value={formData.career}
                onChange={(e) => onChange({ ...formData, career: e.target.value })}
                className="w-full border-2 border-gray-300 p-3 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
              >
                <option value="" disabled>
                  Seleccionar carrera...
                </option>
                {opcionesCarreras.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                CORREO INSTITUCIONAL
              </label>
              <input
                type="email"
                required
                disabled={isSaving}
                value={formData.institutionalEmail}
                onChange={(e) =>
                  onChange({ ...formData, institutionalEmail: e.target.value })
                }
                className="w-full border-2 border-gray-300 p-3 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
                placeholder="ejemplo@unimayor.edu.co"
              />
            </div>

            <div>
              {editId ? (
                <>
                  <label className="flex items-center text-xs font-mono text-gray-500 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={changePassword}
                      onChange={(e) => {
                        setChangePassword(e.target.checked);
                        if (!e.target.checked) {
                          onChange({ ...formData, newPassword: "" });
                        }
                      }}
                      disabled={isSaving}
                      className="mr-2 w-4 h-4 accent-[#F37021]"
                    />
                    Cambiar contraseña
                  </label>
                  {changePassword && (
                    <input
                      type="text"
                      disabled={isSaving}
                      value={formData.newPassword || ""}
                      onChange={(e) =>
                        onChange({ ...formData, newPassword: e.target.value })
                      }
                      className="w-full border-2 border-gray-300 p-3 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
                      placeholder="Nueva contraseña en texto plano"
                    />
                  )}
                </>
              ) : (
                <>
                  <label className="block text-xs font-mono text-gray-500 mb-1">
                    CONTRASEÑA (TEMPORAL)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSaving}
                    value={formData.passwordHash}
                    onChange={(e) =>
                      onChange({ ...formData, passwordHash: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 p-3 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
                    placeholder="Ej. pixel2026"
                  />
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                ESTADO ACADÉMICO
              </label>
              <select
                value={formData.academicStatus}
                disabled={isSaving}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    academicStatus: e.target.value as "STUDENT" | "GRADUATE",
                  })
                }
                className="w-full border-2 border-gray-300 p-3 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
              >
                <option value="STUDENT">ESTUDIANTE</option>
                <option value="GRADUATE">EGRESADO</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-gray-500 mb-1">
                ROL DEL SISTEMA (PERMISOS)
              </label>
              <select
                value={formData.systemRole}
                disabled={isSaving}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    systemRole: e.target.value as "ADMIN" | "MEMBER",
                  })
                }
                className="w-full border-2 border-gray-300 p-3 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
              >
                <option value="MEMBER">MEMBER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
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
                "Crear Integrante"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}