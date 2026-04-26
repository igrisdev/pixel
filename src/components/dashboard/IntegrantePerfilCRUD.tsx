"use client";

import React, { useState } from "react";
import {
  Save,
  CheckCircle,
  Plus,
  Trash2,
  Lock,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { useStore } from "@/store/useStore";

export default function IntegrantePerfilCRUD() {
  const { students, currentUser, updateStudent } = useStore();

  // Buscar data actualizada
  const user =
    students.find((s) => s.id === currentUser?.id) || (currentUser as any);

  const [formData, setFormData] = useState({
    name: user.name || "",
    role: user.role || "",
    email_personal: user.email_personal || "",
    url_cv: user.url_cv || "",
    img: user.img || "",
    password_hash: user.password_hash || "",
  });

  const [enlaces, setEnlaces] = useState<
    { id: number; plataforma: string; url: string }[]
  >(user.enlaces || []);
  const [newEnlace, setNewEnlace] = useState({ plataforma: "GitHub", url: "" });

  // NUEVO: Estados para manejar la carga asíncrona y el éxito
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSaving(true);
    try {
      // Usamos el método asíncrono updateStudent de nuestro store
      await updateStudent(currentUser.id, { ...formData, enlaces });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const addEnlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEnlace.url.trim()) {
      const nextId =
        enlaces.length > 0 ? Math.max(...enlaces.map((en) => en.id)) + 1 : 1;
      setEnlaces([...enlaces, { id: nextId, ...newEnlace }]);
      setNewEnlace({ plataforma: "GitHub", url: "" });
    }
  };

  const deleteEnlace = (id: number) =>
    setEnlaces(enlaces.filter((e) => e.id !== id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Col 1: Datos */}
      <div className="bg-white pixel-border p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#1E293B] mb-6">
          Información Básica
        </h2>

        {/* Información Institucional (Solo lectura) */}
        <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200">
          <p className="text-xs font-mono text-gray-500 mb-2">
            DATOS INSTITUCIONALES
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm font-semibold text-gray-600">
                Correo:
              </span>
              <span className="text-sm font-mono text-[#1E293B]">
                {user.email_institucional}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">
                Carrera:
              </span>
              <span className="text-sm font-mono text-[#1E293B]">
                {user.carrera}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          {/* FOTO DE PERFIL CON PREVISUALIZACIÓN */}
          <div className="flex gap-4 items-center p-4 border-2 border-gray-200 bg-[#F8F9FA]">
            <img
              src={
                formData.img ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1E293B&color=fff`
              }
              alt="Perfil"
              className="w-16 h-16 border-2 border-[#1E293B] object-cover bg-white"
              onError={(e) =>
                (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "User")}&background=1E293B&color=fff`)
              }
            />
            <div className="flex-1">
              <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                <ImageIcon className="w-3 h-3 mr-1" /> URL DE FOTO DE PERFIL
              </label>
              <input
                type="url"
                disabled={isSaving}
                value={formData.img}
                onChange={(e) =>
                  setFormData({ ...formData, img: e.target.value })
                }
                className="w-full border-2 border-gray-300 p-2 outline-none focus:border-[#F37021] text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              NOMBRE COMPLETO
            </label>
            <input
              type="text"
              disabled={isSaving}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium text-[#1E293B] disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              ROL PRINCIPAL / ESPECIALIDAD (Ej. Frontend Developer)
            </label>
            <input
              type="text"
              disabled={isSaving}
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium text-[#1E293B] disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              EMAIL DE CONTACTO PERSONAL
            </label>
            <input
              type="email"
              disabled={isSaving}
              value={formData.email_personal}
              onChange={(e) =>
                setFormData({ ...formData, email_personal: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Para que te contacten empresas..."
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              URL CURRÍCULUM (G-Drive, PDF)
            </label>
            <input
              type="url"
              disabled={isSaving}
              value={formData.url_cv}
              onChange={(e) =>
                setFormData({ ...formData, url_cv: e.target.value })
              }
              placeholder="https://..."
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="pt-4 border-t-2 border-dashed border-gray-200">
            <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
              <Lock className="w-3 h-3 mr-1" /> CAMBIAR CONTRASEÑA
            </label>
            <input
              type="password"
              disabled={isSaving}
              value={formData.password_hash}
              onChange={(e) =>
                setFormData({ ...formData, password_hash: e.target.value })
              }
              placeholder="Escribe tu nueva contraseña..."
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#F37021] text-white font-bold py-4 border-2 border-[#1E293B] hover:bg-[#e06015] transition flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> GUARDANDO...
              </>
            ) : saved ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" /> PERFIL ACTUALIZADO
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" /> GUARDAR CAMBIOS
              </>
            )}
          </button>
        </form>
      </div>

      {/* Col 2: Enlaces */}
      <div className="bg-white pixel-border p-8 shadow-sm h-fit">
        <h2 className="text-xl font-bold text-[#1E293B] mb-2">
          Mis Enlaces Profesionales
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Añade enlaces a tu portafolio, repositorios o perfiles de LinkedIn.
        </p>

        <form onSubmit={addEnlace} className="flex gap-2 mb-8">
          <select
            disabled={isSaving}
            value={newEnlace.plataforma}
            onChange={(e) =>
              setNewEnlace({ ...newEnlace, plataforma: e.target.value })
            }
            className="border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium text-[#1E293B] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option>GitHub</option>
            <option>LinkedIn</option>
            <option>Portafolio Web</option>
            <option>Dribbble</option>
          </select>
          <input
            type="url"
            disabled={isSaving}
            placeholder="https://..."
            required
            value={newEnlace.url}
            onChange={(e) =>
              setNewEnlace({ ...newEnlace, url: e.target.value })
            }
            className="flex-1 border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#2D5A27] hover:bg-[#1f3f1b] text-white px-5 border-2 border-[#2D5A27] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>

        <ul className="space-y-3">
          {enlaces.map((e) => (
            <li
              key={e.id}
              className={`flex justify-between items-center p-4 border-2 transition ${isSaving ? "border-gray-200 bg-gray-100 opacity-60" : "border-gray-200 bg-[#F8F9FA] hover:border-[#1E293B]"}`}
            >
              <div className="overflow-hidden pr-4">
                <strong className="text-[#1E293B] block text-sm">
                  {e.plataforma}
                </strong>
                <span className="text-xs text-gray-500 font-mono truncate block w-full">
                  {e.url}
                </span>
              </div>
              <button
                onClick={() => deleteEnlace(e.id)}
                disabled={isSaving}
                className="text-gray-400 hover:text-red-600 bg-white p-2 border border-gray-300 transition disabled:cursor-not-allowed disabled:bg-gray-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
          {enlaces.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 bg-gray-50">
              <p className="text-gray-500 text-sm">
                No tienes enlaces registrados.
              </p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
