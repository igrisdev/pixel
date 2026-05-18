"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Pencil,
  X,
  FileText,
} from "lucide-react";
import EditLinkModal from "./EditLinkModal";
import toast from "react-hot-toast";
import { useDataStore } from "@/store/useDataStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiRepository } from "@/services/api";
import { ProfessionalLink, Competency } from "@/types";

export default function IntegrantePerfilCRUD() {
  const { members, updateMember, competencies, loadMembers } = useDataStore();
  const { currentUser } = useAuthStore();

  const user = members.find((m) => m.id === currentUser?.id);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const getAvatarUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E293B&color=fff&size=150`;

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // ============================================
  // ESTADO ORIGINAL (para rollback)
  // ============================================
  const [originalData, setOriginalData] = useState({
    fullName: user?.fullName || "",
    role: user?.role || "",
    professionalProfile: user?.professionalProfile || "",
    personalEmail: user?.personalEmail || "",
    cvUrl: user?.cvUrl || "",
    photoUrl: user?.photoUrl || getAvatarUrl(user?.fullName || ""),
    passwordHash: "",
  });

  // Estado local (optimistic)
  const [formData, setFormData] = useState({ ...originalData });

  const [originalLinks, setOriginalLinks] = useState<ProfessionalLink[]>(user?.links || []);
  const [links, setLinks] = useState<ProfessionalLink[]>([...originalLinks]);
  const [newLink, setNewLink] = useState({ platform: "GitHub", url: "" });
  const [editingLink, setEditingLink] = useState<ProfessionalLink | null>(null);

  const [originalCompetencyIds, setOriginalCompetencyIds] = useState<number[]>(
    user?.competencies?.map((c) => c.id) || [],
  );
  const [selectedCompetencies, setSelectedCompetencies] = useState<number[]>([...originalCompetencyIds]);

  // Flags de estado
  const [isSavingBasic, setIsSavingBasic] = useState(false);
  const [isSavingLinks, setIsSavingLinks] = useState(false);
  const [isSavingCompetencies, setIsSavingCompetencies] = useState(false);
  const [savedBasic, setSavedBasic] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (currentUser) {
      loadMembers();
    }
  }, [currentUser, loadMembers]);

  // Sincronizar cuando cambian los datos del store
  useEffect(() => {
    const freshUser = members.find((m) => m.id === currentUser?.id);
    if (freshUser && !isSavingBasic && !isSavingLinks && !isSavingCompetencies) {
      const photoUrl = freshUser.photoUrl || getAvatarUrl(freshUser.fullName || "");
      setOriginalData({
        fullName: freshUser.fullName || "",
        role: freshUser.role || "",
        professionalProfile: freshUser.professionalProfile || "",
        personalEmail: freshUser.personalEmail || "",
        cvUrl: freshUser.cvUrl || "",
        photoUrl,
        passwordHash: "",
      });
      setFormData({
        fullName: freshUser.fullName || "",
        role: freshUser.role || "",
        professionalProfile: freshUser.professionalProfile || "",
        personalEmail: freshUser.personalEmail || "",
        cvUrl: freshUser.cvUrl || "",
        photoUrl,
        passwordHash: "",
      });
      setOriginalLinks(freshUser.links || []);
      setLinks([...freshUser.links]);
      setOriginalCompetencyIds(freshUser.competencies?.map((c) => c.id) || []);
      setSelectedCompetencies(freshUser.competencies?.map((c) => c.id) || []);
    }
  }, [members, currentUser, isSavingBasic, isSavingLinks, isSavingCompetencies]);

  // ============================================
  // FUNCIONES DE UPLOAD
  // ============================================

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploadingPhoto(true);
    try {
      const result = await ApiRepository.uploadFile(file, "profiles");
      setFormData({ ...formData, photoUrl: result.url });
      toast.success("Foto de perfil actualizada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir la foto");
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploadingCv(true);
    try {
      const result = await ApiRepository.uploadFile(file, "cvs");
      setFormData({ ...formData, cvUrl: result.url });
      toast.success("CV actualizado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir el CV");
    } finally {
      setIsUploadingCv(false);
      if (cvInputRef.current) {
        cvInputRef.current.value = "";
      }
    }
  };

  // ============================================
  // FUNCIONES DE GUARDADO (Optimistic)
  // ============================================

  const handleSaveBasicInfo = async () => {
    if (!currentUser || !user) return;

    const hasChanges =
      formData.fullName !== originalData.fullName ||
      formData.role !== originalData.role ||
      formData.professionalProfile !== originalData.professionalProfile ||
      formData.personalEmail !== originalData.personalEmail ||
      formData.cvUrl !== originalData.cvUrl ||
      formData.photoUrl !== originalData.photoUrl ||
      (isEditingPassword && formData.passwordHash !== originalData.passwordHash);

    if (!hasChanges) {
      toast("No hay cambios que guardar", { icon: "ℹ️" });
      return;
    }

    setIsSavingBasic(true);
    try {
      const dataToSend: Record<string, any> = { ...formData };
      if (!dataToSend.photoUrl) {
        dataToSend.photoUrl = getAvatarUrl(dataToSend.fullName);
      }
      if (!isEditingPassword || !formData.passwordHash) {
        delete dataToSend.passwordHash;
      }

      await updateMember(currentUser.id, dataToSend);
      const savedPhotoUrl = dataToSend.photoUrl || getAvatarUrl(dataToSend.fullName);
      setOriginalData({ ...formData, photoUrl: savedPhotoUrl, passwordHash: "" });
      setFormData({ ...formData, photoUrl: savedPhotoUrl, passwordHash: "" });
      setIsEditingPassword(false);
      setSavedBasic(true);
      toast.success("Información básica guardada");
      setTimeout(() => setSavedBasic(false), 2000);
    } catch (error) {
      setFormData({ ...originalData });
      toast.error("Error al guardar. Cambios revertidos.");
    } finally {
      setIsSavingBasic(false);
    }
  };

  const syncLinksFromStore = () => {
    const freshUser = members.find((m) => m.id === currentUser?.id);
    if (!freshUser) return;
    const storeLinks = freshUser.links || [];
    const storeLinksMap = storeLinks.map((l) => `${l.id}|${l.platform}|${l.url}`);
    const originalLinksMap = originalLinks.map((l) => `${l.id}|${l.platform}|${l.url}`);
    const linksMap = links.map((l) => `${l.id}|${l.platform}|${l.url}`);
    const hasLocalChanges = JSON.stringify(linksMap) !== JSON.stringify(originalLinksMap);
    if (!hasLocalChanges) {
      setLinks([...storeLinks]);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.url.trim() || !currentUser) return;

    const optimisticLink = { id: -Date.now(), platform: newLink.platform, url: newLink.url };

    setLinks([...links, optimisticLink]);

    setIsSavingLinks(true);
    try {
      const newLinkData = await ApiRepository.addLink(currentUser.id, newLink.platform, newLink.url);
      setLinks((prev) => prev.map((l) => (l.id === optimisticLink.id ? newLinkData : l)));
      setOriginalLinks((prev) => [...prev, newLinkData]);
      setNewLink({ platform: "GitHub", url: "" });
      toast.success("Enlace agregado");
      await loadMembers();
    } catch (error) {
      setLinks((prev) => prev.filter((l) => l.id !== optimisticLink.id));
      toast.error("Error al agregar enlace. Cambios revertidos.");
    } finally {
      setIsSavingLinks(false);
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    if (!currentUser || linkId < 0) return;

    const link = links.find((l) => l.id === linkId);
    if (!link || !confirm(`¿Eliminar el enlace "${link.platform}"?`)) return;

    const previousLinks = [...links];
    setLinks(links.filter((l) => l.id !== linkId));

    setIsSavingLinks(true);
    try {
      await ApiRepository.deleteLink(currentUser.id, linkId);
      setOriginalLinks((prev) => prev.filter((l) => l.id !== linkId));
      toast.success("Enlace eliminado");
      await loadMembers();
    } catch (error) {
      setLinks(previousLinks);
      toast.error("Error al eliminar enlace. Cambios revertidos.");
    } finally {
      setIsSavingLinks(false);
    }
  };

  const handleSaveCompetencies = async () => {
    if (!currentUser) return;

    const hasChanges =
      selectedCompetencies.length !== originalCompetencyIds.length ||
      !selectedCompetencies.every((id) => originalCompetencyIds.includes(id));

    if (!hasChanges) {
      toast("No hay cambios que guardar", { icon: "ℹ️" });
      return;
    }

    setIsSavingCompetencies(true);
    try {
      await ApiRepository.updateMemberCompetencies(currentUser.id, selectedCompetencies);
      setOriginalCompetencyIds([...selectedCompetencies]);
      toast.success("Competencias actualizadas");
      await loadMembers();
    } catch (error) {
      setSelectedCompetencies([...originalCompetencyIds]);
      toast.error("Error al guardar competencias. Cambios revertidos.");
    } finally {
      setIsSavingCompetencies(false);
    }
  };

  const toggleCompetency = (id: number) => {
    if (selectedCompetencies.includes(id)) {
      setSelectedCompetencies(selectedCompetencies.filter((compId) => compId !== id));
    } else {
      setSelectedCompetencies([...selectedCompetencies, id]);
    }
  };

  // ============================================
  // HELPERS
  // ============================================

  const hasBasicChanges =
    formData.fullName !== originalData.fullName ||
    formData.role !== originalData.role ||
    formData.professionalProfile !== originalData.professionalProfile ||
    formData.personalEmail !== originalData.personalEmail ||
    formData.cvUrl !== originalData.cvUrl ||
    formData.photoUrl !== originalData.photoUrl ||
    (isEditingPassword && formData.passwordHash !== originalData.passwordHash);

  const dbLinks = links.filter((l) => l.id > 0);
  const dbOriginalLinks = originalLinks.filter((l) => l.id > 0);
  const hasLinkChanges = JSON.stringify(dbLinks.map((l) => `${l.id}|${l.platform}|${l.url}`)) !==
    JSON.stringify(dbOriginalLinks.map((l) => `${l.id}|${l.platform}|${l.url}`));

  const hasCompetencyChanges =
    selectedCompetencies.length !== originalCompetencyIds.length ||
    !selectedCompetencies.every((id) => originalCompetencyIds.includes(id));

  const isAnySaving = isSavingBasic || isSavingLinks || isSavingCompetencies;

  const photoFileName = formData.photoUrl ? formData.photoUrl.split("/").pop() : null;
  const cvFileName = formData.cvUrl ? formData.cvUrl.split("/").pop() : null;

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Col 1: Datos Básicos */}
        <div className="bg-white pixel-border p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#1E293B] mb-6 flex items-center justify-between">
            Información Básica
            {hasBasicChanges && !isSavingBasic && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-300">
                Sin guardar
              </span>
            )}
          </h2>

          {/* Información Institucional (Solo lectura) */}
          <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200">
            <p className="text-xs font-mono text-gray-500 mb-2">
              DATOS INSTITUCIONALES
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-sm font-semibold text-gray-600">Correo:</span>
                <span className="text-sm font-mono text-[#1E293B]">{user?.institutionalEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">Carrera:</span>
                <span className="text-sm font-mono text-[#1E293B]">{user?.career}</span>
              </div>
            </div>
          </div>

          {/* FOTO DE PERFIL */}
          <div className="flex gap-4 items-center p-4 border-2 border-gray-200 bg-[#F8F9FA] mb-5">
            <img
              src={formData.photoUrl || getAvatarUrl(formData.fullName)}
              alt="Perfil"
              className="w-16 h-16 border-2 border-[#1E293B] object-cover bg-white"
              onError={(e) =>
                (e.currentTarget.src = getAvatarUrl(formData.fullName || "User"))
              }
            />
            <div className="flex-1">
              <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                <ImageIcon className="w-3 h-3 mr-1" /> FOTO DE PERFIL
              </label>
              <div className="flex gap-2">
                {photoFileName && formData.photoUrl?.startsWith("/uploads/") ? (
                  <div className="flex-1 flex items-center gap-2 p-2 border-2 border-gray-300 bg-gray-50 text-sm text-gray-600">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{photoFileName}</span>
                  </div>
                ) : (
                  <input
                    type="url"
                    disabled={isSavingBasic}
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="flex-1 border-2 border-gray-300 p-2 outline-none focus:border-[#F37021] text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="https://..."
                  />
                )}
                <label
                  className={`bg-[#1E293B] text-white px-4 py-2 text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-black transition ${isSavingBasic || isUploadingPhoto ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                >
                  {isUploadingPhoto ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 mr-2" /> SUBIR
                    </>
                  )}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={isSavingBasic || isUploadingPhoto}
                  />
                </label>
                {formData.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photoUrl: getAvatarUrl(formData.fullName) })}
                    className="bg-red-500 text-white px-3 py-2 text-xs font-bold hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">NOMBRE COMPLETO</label>
              <input
                type="text"
                disabled={isSavingBasic}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                disabled={isSavingBasic}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium text-[#1E293B] disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">PERFIL PROFESIONAL / BIO</label>
              <textarea
                disabled={isSavingBasic}
                value={formData.professionalProfile}
                onChange={(e) => setFormData({ ...formData, professionalProfile: e.target.value })}
                className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium text-[#1E293B] disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                rows={4}
                placeholder="Cuéntanos brevemente sobre tu experiencia..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">EMAIL DE CONTACTO PERSONAL</label>
              <input
                type="email"
                disabled={isSavingBasic}
                value={formData.personalEmail}
                onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                className="w-full border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Para que te contacten empresas..."
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">CURRÍCULUM (PDF)</label>
              <div className="flex gap-2">
                {cvFileName && formData.cvUrl?.startsWith("/uploads/") ? (
                  <div className="flex-1 flex items-center gap-2 p-2 border-2 border-gray-300 bg-gray-50 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{cvFileName}</span>
                  </div>
                ) : (
                  <input
                    type="url"
                    disabled={isSavingBasic}
                    value={formData.cvUrl}
                    onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                )}
                <label
                  className={`bg-[#1E293B] text-white px-4 py-2 text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-black transition ${isSavingBasic || isUploadingCv ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                >
                  {isUploadingCv ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 mr-2" /> PDF
                    </>
                  )}
                  <input
                    ref={cvInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleCvUpload}
                    disabled={isSavingBasic || isUploadingCv}
                  />
                </label>
                {formData.cvUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cvUrl: "" })}
                    className="bg-red-500 text-white px-3 py-2 text-xs font-bold hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t-2 border-dashed border-gray-200">
              <label className="block text-xs font-mono text-gray-500 mb-1 flex items-center">
                <Lock className="w-3 h-3 mr-1" /> CONTRASEÑA
              </label>
              {!isEditingPassword ? (
                <div className="flex gap-2 items-center">
                  <span className="flex-1 text-sm text-gray-500 font-mono">••••••••</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingPassword(true)}
                    disabled={isSavingBasic}
                    className="bg-[#1E293B] text-white px-4 py-2 text-xs font-bold hover:bg-black transition disabled:opacity-50"
                  >
                    Cambiar contraseña
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="password"
                    disabled={isSavingBasic}
                    value={formData.passwordHash}
                    onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                    placeholder="Escribe tu nueva contraseña..."
                    className="flex-1 border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, passwordHash: "" });
                      setIsEditingPassword(false);
                    }}
                    disabled={isSavingBasic}
                    className="bg-gray-200 text-[#1E293B] px-4 py-2 text-xs font-bold hover:bg-gray-300 transition disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveBasicInfo}
              disabled={isSavingBasic || !hasBasicChanges}
              className="w-full bg-[#F37021] text-white font-bold py-4 border-2 border-[#1E293B] hover:bg-[#e06015] transition flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingBasic ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> GUARDANDO...
                </>
              ) : savedBasic ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" /> GUARDADO
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" /> GUARDAR INFORMACIÓN BÁSICA
                </>
              )}
            </button>
          </div>
        </div>

        {/* Col 2: Enlaces y Competencias */}
        <div className="flex flex-col gap-8">
          {/* Mis Enlaces Profesionales */}
          <div className="bg-white pixel-border p-8 shadow-sm h-fit">
            <h2 className="text-xl font-bold text-[#1E293B] mb-2 flex items-center justify-between">
              Mis Enlaces Profesionales
              {hasLinkChanges && !isSavingLinks && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-300">
                  Sin guardar
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Añade enlaces a tu portafolio, repositorios o perfiles de LinkedIn.
            </p>

            <form onSubmit={handleAddLink} className="flex gap-2 mb-8">
              <select
                disabled={isSavingLinks}
                value={newLink.platform}
                onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                className="border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] font-medium text-[#1E293B] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option>GitHub</option>
                <option>LinkedIn</option>
                <option>Portafolio Web</option>
                <option>Dribbble</option>
              </select>
              <input
                type="url"
                disabled={isSavingLinks}
                placeholder="https://..."
                required
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="flex-1 border-2 border-gray-300 p-3 outline-none focus:border-[#F37021] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isSavingLinks || !newLink.url.trim()}
                className="bg-[#2D5A27] hover:bg-[#1f3f1b] text-white px-5 border-2 border-[#2D5A27] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSavingLinks ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              </button>
            </form>

            <ul className="space-y-3">
              {links.map((l) => (
                <li
                  key={l.id}
                  className={`flex justify-between items-center p-4 border-2 transition ${isSavingLinks ? "border-gray-200 bg-gray-100 opacity-60" : "border-gray-200 bg-[#F8F9FA] hover:border-[#1E293B]"}`}
                >
                  <div className="overflow-hidden pr-4">
                    <strong className="text-[#1E293B] block text-sm">{l.platform}</strong>
                    <span className="text-xs text-gray-500 font-mono truncate block w-full">{l.url}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingLink(l)}
                      disabled={isSavingLinks}
                      className="text-gray-400 hover:text-[#F37021] bg-white p-2 border border-gray-300 hover:border-[#F37021] transition disabled:cursor-not-allowed disabled:bg-gray-200"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(l.id)}
                      disabled={isSavingLinks}
                      className="text-gray-400 hover:text-red-600 bg-white p-2 border border-gray-300 hover:border-red-600 transition disabled:cursor-not-allowed disabled:bg-gray-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
              {links.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-gray-300 bg-gray-50">
                  <p className="text-gray-500 text-sm">No tienes enlaces registrados.</p>
                </div>
              )}
            </ul>
          </div>

          {/* SECCIÓN DE COMPETENCIAS */}
          <div className="bg-white pixel-border p-8 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-[#F37021]" />
                <h2 className="text-xl font-bold text-[#1E293B]">Mis Competencias</h2>
              </div>
              {hasCompetencyChanges && !isSavingCompetencies && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-300">
                  Sin guardar
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Selecciona las habilidades y herramientas que dominas.
            </p>

            {/* Leyenda de colores */}
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

            <div className="flex flex-wrap gap-2 mb-4">
              {competencies.map((comp) => {
                const isSelected = selectedCompetencies.includes(comp.id);
                const baseStyle = "px-4 py-2 text-sm font-bold border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
                const selectedStyle = "border-[#1E293B] bg-[#1E293B] text-white shadow-[2px_2px_0px_0px_rgba(243,112,33,1)]";
                const unselectedTechnicalStyle = "border-blue-300 bg-blue-50 text-blue-800 hover:border-[#1E293B] hover:text-[#1E293B]";
                const unselectedSoftStyle = "border-purple-300 bg-purple-50 text-purple-800 hover:border-[#1E293B] hover:text-[#1E293B]";

                const finalStyle = isSelected ? selectedStyle : comp.type === "TECHNICAL" ? unselectedTechnicalStyle : unselectedSoftStyle;

                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => toggleCompetency(comp.id)}
                    disabled={isSavingCompetencies}
                    className={`${baseStyle} ${finalStyle}`}
                    title={comp.description}
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

            <button
              type="button"
              onClick={handleSaveCompetencies}
              disabled={isSavingCompetencies || !hasCompetencyChanges}
              className="w-full bg-[#2D5A27] text-white font-bold py-3 border-2 border-[#1E293B] hover:bg-[#1f3f1b] transition flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingCompetencies ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> GUARDANDO...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" /> GUARDAR COMPETENCIAS
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {editingLink && currentUser && (
        <EditLinkModal
          link={editingLink}
          memberId={currentUser.id}
          onClose={() => setEditingLink(null)}
          onSave={async (updated) => {
            setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
            setOriginalLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
            setEditingLink(null);
            await loadMembers();
          }}
        />
      )}
    </>
  );
}