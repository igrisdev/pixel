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
  UploadCloud,
  Award,
} from "lucide-react";
import { useDataStore } from "@/store/useDataStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function IntegrantePerfilCRUD() {
  const { members, updateMember, competencies } = useDataStore();
  const { currentUser } = useAuthStore();

  const user =
    members.find((m) => m.id === currentUser?.id) || (currentUser as any);

  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    role: user.role || "",
    professionalProfile: user.professionalProfile || "",
    personalEmail: user.personalEmail || "",
    cvUrl: user.cvUrl || "",
    photoUrl: user.photoUrl || "",
    passwordHash: user.passwordHash || "",
  });

  const [links, setLinks] = useState<
    { id: number; platform: string; url: string }[]
  >(user.links || []);
  const [newLink, setNewLink] = useState({ platform: "GitHub", url: "" });

  const [selectedCompetencies, setSelectedCompetencies] = useState<number[]>(
    user.competencies?.map((c: any) => c.id) || [],
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSaving(true);
    try {
      const fullSelectedCompetencies = competencies.filter((c) =>
        selectedCompetencies.includes(c.id),
      );

      await updateMember(currentUser.id, {
        ...formData,
        links,
        competencies: fullSelectedCompetencies,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLink.url.trim()) {
      const nextId =
        links.length > 0 ? Math.max(...links.map((l) => l.id)) + 1 : 1;
      setLinks([...links, { id: nextId, ...newLink }]);
      setNewLink({ platform: "GitHub", url: "" });
    }
  };

  const deleteLink = (id: number) => setLinks(links.filter((l) => l.id !== id));

  const toggleCompetency = (id: number) => {
    if (selectedCompetencies.includes(id)) {
      setSelectedCompetencies(
        selectedCompetencies.filter((compId) => compId !== id),
      );
    } else {
      setSelectedCompetencies([...selectedCompetencies, id]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUploadedUrl = URL.createObjectURL(file);
      setFormData({ ...formData, photoUrl: fakeUploadedUrl });
    }
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUploadedUrl = URL.createObjectURL(file);
      setFormData({ ...formData, cvUrl: fakeUploadedUrl });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Col 1: Datos Básicos */}
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
                {user.institutionalEmail}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">
                Carrera:
              </span>
              <span className="text-sm font-mono text-[#1E293B]">
                {user.career}
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSaveProfile}
          className="space-y-5"
          id="profile-form"
        >
          {/* FOTO DE PERFIL */}
          <div className="flex gap-4 items-center p-4 border-2 border-gray-200 bg-[#F8F9FA]">
            <img
              src={
                formData.photoUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=1E293B&color=fff`
              }
              alt="Perfil"
              className="w-16 h-16 border-2 border-[#1E293B] object-cover bg-white"
              onError={(e) =>
                (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || "User")}&background=1E293B&color=fff`)
              }
            />
            <div className="flex-1">
              <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                <ImageIcon className="w-3 h-3 mr-1" /> URL DE FOTO DE PERFIL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  disabled={isSaving}
                  value={formData.photoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, photoUrl: e.target.value })
                  }
                  className="w-full border-2 border-gray-300 p-2 outline-none focus:border-[#F37021] text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="https://..."
                />
                <label
                  className={`bg-[#1E293B] text-white px-4 py-2 text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-black transition ${isSaving ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                >
                  <UploadCloud className="w-4 h-4 mr-2" /> SUBIR
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={isSaving}
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              NOMBRE COMPLETO
            </label>
            <input
              type="text"
              disabled={isSaving}
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
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
              PERFIL PROFESIONAL / BIO
            </label>
            <textarea
              disabled={isSaving}
              value={formData.professionalProfile}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  professionalProfile: e.target.value,
                })
              }
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium text-[#1E293B] disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
              rows={4}
              placeholder="Cuéntanos brevemente sobre tu experiencia, intereses y objetivos..."
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
              value={formData.personalEmail}
              onChange={(e) =>
                setFormData({ ...formData, personalEmail: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Para que te contacten empresas..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              URL CURRÍCULUM (G-Drive, PDF)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                disabled={isSaving}
                value={formData.cvUrl}
                onChange={(e) =>
                  setFormData({ ...formData, cvUrl: e.target.value })
                }
                placeholder="https://..."
                className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <label
                className={`bg-[#1E293B] text-white px-4 py-2 text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-black transition ${isSaving ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
              >
                <UploadCloud className="w-4 h-4 mr-2" /> PDF
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleCvUpload}
                  disabled={isSaving}
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-dashed border-gray-200">
            <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
              <Lock className="w-3 h-3 mr-1" /> CAMBIAR CONTRASEÑA
            </label>
            <input
              type="password"
              disabled={isSaving}
              value={formData.passwordHash}
              onChange={(e) =>
                setFormData({ ...formData, passwordHash: e.target.value })
              }
              placeholder="Escribe tu nueva contraseña..."
              className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>
        </form>
      </div>

      {/* Col 2: Enlaces y Competencias */}
      <div className="flex flex-col gap-8">
        {/* Mis Enlaces Profesionales */}
        <div className="bg-white pixel-border p-8 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">
            Mis Enlaces Profesionales
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Añade enlaces a tu portafolio, repositorios o perfiles de LinkedIn.
          </p>

          <form onSubmit={addLink} className="flex gap-2 mb-8">
            <select
              disabled={isSaving}
              value={newLink.platform}
              onChange={(e) =>
                setNewLink({ ...newLink, platform: e.target.value })
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
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
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
            {links.map((l) => (
              <li
                key={l.id}
                className={`flex justify-between items-center p-4 border-2 transition ${isSaving ? "border-gray-200 bg-gray-100 opacity-60" : "border-gray-200 bg-[#F8F9FA] hover:border-[#1E293B]"}`}
              >
                <div className="overflow-hidden pr-4">
                  <strong className="text-[#1E293B] block text-sm">
                    {l.platform}
                  </strong>
                  <span className="text-xs text-gray-500 font-mono truncate block w-full">
                    {l.url}
                  </span>
                </div>
                <button
                  onClick={() => deleteLink(l.id)}
                  disabled={isSaving}
                  className="text-gray-400 hover:text-red-600 bg-white p-2 border border-gray-300 transition disabled:cursor-not-allowed disabled:bg-gray-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
            {links.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-gray-300 bg-gray-50">
                <p className="text-gray-500 text-sm">
                  No tienes enlaces registrados.
                </p>
              </div>
            )}
          </ul>
        </div>

        {/* SECCIÓN DE COMPETENCIAS MODIFICADA */}
        <div className="bg-white pixel-border p-8 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-6 h-6 text-[#F37021]" />
            <h2 className="text-xl font-bold text-[#1E293B]">
              Mis Competencias
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Selecciona las habilidades y herramientas que dominas para que
            destaquen en tu perfil.
          </p>

          {/* LEYENDA DE COLORES */}
          <div className="flex gap-4 mb-6 text-xs font-mono">
            <span className="flex items-center gap-1 text-blue-800">
              <span className="w-3 h-3 bg-blue-50 border-2 border-blue-300 inline-block"></span>
              Técnicas
            </span>
            <span className="flex items-center gap-1 text-purple-800">
              <span className="w-3 h-3 bg-purple-50 border-2 border-purple-300 inline-block"></span>
              Transversales
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {competencies.map((comp) => {
              const isSelected = selectedCompetencies.includes(comp.id);

              // 1. Estilos base comunes para todas
              const baseStyle =
                "px-4 py-2 text-sm font-bold border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

              // 2. Estilo cuando está seleccionada (El de tu diseño original)
              const selectedStyle =
                "border-[#1E293B] bg-[#1E293B] text-white shadow-[2px_2px_0px_0px_rgba(243,112,33,1)]";

              // 3. Estilos diferenciados por tipo (cuando NO están seleccionadas)
              const unselectedTechnicalStyle =
                "border-blue-300 bg-blue-50 text-blue-800 hover:border-[#1E293B] hover:text-[#1E293B]";
              const unselectedSoftStyle =
                "border-purple-300 bg-purple-50 text-purple-800 hover:border-[#1E293B] hover:text-[#1E293B]";

              // 4. Determinar qué estilo aplicar
              let finalStyle = isSelected
                ? selectedStyle
                : comp.type === "TECHNICAL"
                  ? unselectedTechnicalStyle
                  : unselectedSoftStyle;

              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => toggleCompetency(comp.id)}
                  disabled={isSaving}
                  className={`${baseStyle} ${finalStyle}`}
                  title={comp.description} // Mostramos la descripción al pasar el mouse
                >
                  {comp.name}
                </button>
              );
            })}

            {competencies.length === 0 && (
              <p className="text-sm text-gray-500 italic w-full text-center py-4">
                No hay competencias registradas en el sistema.
              </p>
            )}
          </div>
        </div>

        <button
          form="profile-form"
          type="submit"
          disabled={isSaving}
          className="w-full bg-[#F37021] text-white font-bold py-4 border-2 border-[#1E293B] hover:bg-[#e06015] transition flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed mt-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> GUARDANDO
              PERFIL...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" /> PERFIL ACTUALIZADO
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" /> GUARDAR TODOS LOS CAMBIOS
            </>
          )}
        </button>
      </div>
    </div>
  );
}
