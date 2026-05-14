"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X, Loader2 } from "lucide-react";
import { useDataStore } from "@/store/useDataStore";
import { Member } from "@/types";
import MemberModal from "@/components/ui/user-crud/MemberModal";

export default function AdminUsuariosCRUD() {
  const { members, setMembers, updateMember, deleteMember, createMember, loadMembers } = useDataStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    loadMembers().finally(() => setIsLoadingData(false));
  }, [loadMembers]);

  const [formData, setFormData] = useState<{
    fullName: string;
    institutionalEmail: string;
    passwordHash: string;
    career: string;
    academicStatus: "STUDENT" | "GRADUATE";
    systemRole: "ADMIN" | "MEMBER";
  }>({
    fullName: "",
    institutionalEmail: "",
    passwordHash: "",
    career: "",
    academicStatus: "STUDENT",
    systemRole: "MEMBER",
  });

  const toggleVetado = async (member: Member) => {
    setLoadingAction(`vetar-${member.id}`);
    try {
      await updateMember(member.id, { isBanned: !member.isBanned });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("save");

    try {
      const newMemberData = {
        ...formData,
        role: "Integrante",
        professionalProfile: "",
        photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=1E293B&color=fff`,
        isBanned: false,
        personalEmail: "",
        cvUrl: "",
        links: [],
        competencies: [],
      };

      await createMember(newMemberData);
      setIsAdding(false);
      resetForm();
    } finally {
      setLoadingAction(null);
    }
  };

  const startEdit = (member: Member) => {
    setEditId(member.id);
    setFormData({
      fullName: member.fullName,
      institutionalEmail: member.institutionalEmail || "",
      passwordHash: member.passwordHash || "",
      career: member.career || "",
      academicStatus: member.academicStatus as "STUDENT" | "GRADUATE",
      systemRole: member.systemRole || "MEMBER",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;

    setLoadingAction("save");
    try {
      await updateMember(editId, formData);
      setEditId(null);
      resetForm();
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Eliminar usuario del sistema?")) {
      setLoadingAction(`delete-${id}`);
      try {
        await deleteMember(id);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      institutionalEmail: "",
      passwordHash: "",
      career: "",
      academicStatus: "STUDENT",
      systemRole: "MEMBER",
    });
  };

  return (
    <div className="bg-white pixel-border p-6 shadow-sm overflow-x-auto">
      <div className="flex justify-between items-center mb-6 min-w-[600px]">
        <h2 className="text-xl font-bold text-[#1E293B]">
          Integrantes Registrados
        </h2>
        <button
          onClick={() => {
            if (isAdding || editId) {
              setIsAdding(false);
              setEditId(null);
              resetForm();
            } else {
              setIsAdding(true);
              resetForm();
            }
          }}
          disabled={loadingAction !== null}
          className="bg-[#2D5A27] text-white px-4 py-2 border border-[#1E293B] hover:bg-[#1f3f1b] flex items-center font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding || editId ? (
            <X className="w-4 h-4 mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}
          {isAdding || editId ? "CANCELAR" : "NUEVO INTEGRANTE"}
        </button>
      </div>

      {(isAdding || editId) && (
        <MemberModal
          editId={editId}
          loadingAction={loadingAction}
          formData={formData}
          onChange={setFormData}
          onSubmit={editId ? handleUpdate : handleAdd}
          onClose={() => {
            setIsAdding(false);
            setEditId(null);
            resetForm();
          }}
        />
      )}

      {isLoadingData ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#F37021]" />
          <span className="ml-3 text-gray-500 font-mono">Cargando integrantes...</span>
        </div>
      ) : (
        <table className="w-full text-left text-sm border-collapse min-w-[800px]">
        <thead className="bg-[#F8F9FA] border-b-2 border-[#1E293B]">
          <tr>
            <th className="p-3 font-mono">NOMBRE</th>
            <th className="p-3 font-mono">CARRERA</th>
            <th className="p-3 font-mono">PERMISOS</th>
            <th className="p-3 font-mono">ESTADO</th>
            <th className="p-3 font-mono">VETADO</th>
            <th className="p-3 font-mono text-right">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr
              key={m.id}
              className={`border-b border-gray-200 transition ${
                loadingAction === `delete-${m.id}`
                  ? "bg-red-50 opacity-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <td className="p-3 font-medium flex items-center">
                <img
                  src={m.photoUrl || undefined}
                  className="w-8 h-8 mr-3 border border-[#1E293B] object-cover"
                  alt=""
                />
                <div>
                  <div className="text-[#1E293B]">{m.fullName}</div>
                  <div className="text-xs text-gray-500 font-mono">
                    {m.institutionalEmail}
                  </div>
                </div>
              </td>
              <td className="p-3 text-gray-600">
                {m.career || "No registrada"}
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 text-[10px] font-mono border border-[#1E293B] ${
                    m.systemRole === "ADMIN"
                      ? "bg-[#F37021] text-white"
                      : "bg-gray-100 text-[#334155]"
                  }`}
                >
                  {m.systemRole}
                </span>
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 text-[10px] font-mono border border-[#1E293B] ${m.academicStatus === "GRADUATE" ? "bg-[#2D5A27] text-white" : "bg-gray-100"}`}
                >
                  {m.academicStatus === "GRADUATE" ? "EGRESADO" : "ESTUDIANTE"}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={
                    m.isBanned
                      ? "text-red-600 font-bold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {m.isBanned ? "SÍ" : "NO"}
                </span>
              </td>
              <td className="p-3 flex justify-end space-x-2">
                <button
                  onClick={() => toggleVetado(m)}
                  disabled={loadingAction !== null}
                  className={`${m.isBanned ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"} text-white px-3 py-1 text-xs font-bold border border-[#1E293B] min-w-[80px] flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {loadingAction === `vetar-${m.id}` ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : m.isBanned ? (
                    "Desvetar"
                  ) : (
                    "Vetar"
                  )}
                </button>
                <button
                  onClick={() => startEdit(m)}
                  disabled={loadingAction !== null}
                  className="bg-gray-200 p-2 border border-gray-400 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  disabled={loadingAction !== null}
                  className="bg-red-100 text-red-600 p-2 border border-red-300 hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loadingAction === `delete-${m.id}` ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}
