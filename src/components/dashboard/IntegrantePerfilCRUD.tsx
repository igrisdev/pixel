"use client";

import React, { useState } from "react";
import { Save, CheckCircle, Plus, Trash2 } from "lucide-react";
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
  });

  const [enlaces, setEnlaces] = useState<
    { id: number; plataforma: string; url: string }[]
  >(user.enlaces || []);
  const [newEnlace, setNewEnlace] = useState({ plataforma: "GitHub", url: "" });
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      updateStudent(currentUser.id, { ...formData, enlaces });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const addEnlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEnlace.url.trim()) {
      setEnlaces([...enlaces, { id: Date.now(), ...newEnlace }]);
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
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              NOMBRE COMPLETO
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium text-[#1E293B]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              ROL PRINCIPAL / ESPECIALIDAD
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium text-[#1E293B]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              EMAIL PROFESIONAL
            </label>
            <input
              type="email"
              value={formData.email_personal}
              onChange={(e) =>
                setFormData({ ...formData, email_personal: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021]"
              placeholder="Para que te contacten empresas..."
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              URL CURRÍCULUM (G-Drive, PDF)
            </label>
            <input
              type="url"
              value={formData.url_cv}
              onChange={(e) =>
                setFormData({ ...formData, url_cv: e.target.value })
              }
              placeholder="https://..."
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F37021] text-white font-bold py-4 pixel-border-accent hover:bg-[#e06015] transition flex justify-center items-center mt-6"
          >
            {saved ? (
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
      <div className="bg-white pixel-border p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#1E293B] mb-2">
          Mis Enlaces Profesionales
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Añade enlaces a tu portafolio, repositorios o perfiles de LinkedIn.
        </p>

        <form onSubmit={addEnlace} className="flex gap-2 mb-8">
          <select
            value={newEnlace.plataforma}
            onChange={(e) =>
              setNewEnlace({ ...newEnlace, plataforma: e.target.value })
            }
            className="border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium text-[#1E293B] bg-white"
          >
            <option>GitHub</option>
            <option>LinkedIn</option>
            <option>Portafolio Web</option>
            <option>Dribbble</option>
          </select>
          <input
            type="url"
            placeholder="https://..."
            required
            value={newEnlace.url}
            onChange={(e) =>
              setNewEnlace({ ...newEnlace, url: e.target.value })
            }
            className="flex-1 border-2 border-gray-300 p-3 outline-none focus:border-[#F37021]"
          />
          <button
            type="submit"
            className="bg-[#2D5A27] hover:bg-[#1f3f1b] text-white px-5 border-2 border-[#2D5A27] transition"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>

        <ul className="space-y-3">
          {enlaces.map((e) => (
            <li
              key={e.id}
              className="flex justify-between items-center p-4 border-2 border-gray-200 bg-[#F8F9FA] hover:border-[#1E293B] transition"
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
                className="text-gray-400 hover:text-red-600 bg-white p-2 border border-gray-300 transition"
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
