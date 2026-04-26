"use client";

import React, { useState } from "react";
import { Edit, Trash2, Plus, X, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Student } from "@/types";

export default function AdminUsuariosCRUD() {
  // Ahora traemos updateStudent para aprovechar el método de la API en el store
  const { students, setStudents, updateStudent } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Estado para la gestión de cargas asíncronas
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email_institucional: string;
    password_hash: string;
    carrera: string;
    status: "ESTUDIANTE" | "EGRESADO";
  }>({
    name: "",
    email_institucional: "",
    password_hash: "",
    carrera: "",
    status: "ESTUDIANTE",
  });

  const toggleVetado = async (student: Student) => {
    setLoadingAction(`vetar-${student.id}`);
    try {
      // Usamos el método real asíncrono del store
      await updateStudent(student.id, { vetado: !student.vetado });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("save");

    try {
      await new Promise((resolve) => setTimeout(resolve, 600)); // Latencia simulada

      const nextId =
        students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;

      const newStudent: Student = {
        id: nextId,
        ...formData,
        role: "Integrante",
        tech: [],
        img: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1E293B&color=fff`,
        vetado: false,
        email_personal: "",
        url_cv: "",
        enlaces: [],
      };

      setStudents([...students, newStudent]);
      setIsAdding(false);
      resetForm();
    } finally {
      setLoadingAction(null);
    }
  };

  const startEdit = (student: Student) => {
    setEditId(student.id);
    setFormData({
      name: student.name,
      email_institucional: student.email_institucional || "",
      password_hash: student.password_hash || "",
      carrera: student.carrera || "",
      status: student.status,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;

    setLoadingAction("save");
    try {
      await updateStudent(editId, formData);
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
        await new Promise((resolve) => setTimeout(resolve, 600)); // Latencia simulada
        setStudents(students.filter((s) => s.id !== id));
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email_institucional: "",
      password_hash: "",
      carrera: "",
      status: "ESTUDIANTE",
    });
  };

  const opcionesCarreras = [
    "Ingeniería Informática",
    "Tecnología en Desarrollo de Software",
    "Diseño Visual",
    "Administración de Empresas",
    "Otra",
  ];

  return (
    <div className="bg-white pixel-border p-6 shadow-sm overflow-x-auto">
      <div className="flex justify-between items-center mb-6 min-w-[600px]">
        <h2 className="text-xl font-bold text-[#1E293B]">
          Integrantes Registrados
        </h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditId(null);
            if (!isAdding) resetForm();
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
        <form
          onSubmit={editId ? handleUpdate : handleAdd}
          className="mb-6 p-6 bg-[#F8F9FA] border-2 border-[#1E293B] flex flex-col gap-4 min-w-[600px]"
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-mono mb-1 text-gray-600">
                Nombre Completo
              </label>
              <input
                type="text"
                required
                disabled={loadingAction === "save"}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border-2 border-gray-300 p-2 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
                placeholder="Ej. Isabella Velasco"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-mono mb-1 text-gray-600">
                Carrera
              </label>
              <select
                required
                disabled={loadingAction === "save"}
                value={formData.carrera}
                onChange={(e) =>
                  setFormData({ ...formData, carrera: e.target.value })
                }
                className="w-full border-2 border-gray-300 p-2 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
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
            <div className="w-40">
              <label className="block text-xs font-mono mb-1 text-gray-600">
                Estado
              </label>
              <select
                value={formData.status}
                disabled={loadingAction === "save"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "ESTUDIANTE" | "EGRESADO",
                  })
                }
                className="w-full border-2 border-gray-300 p-2 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
              >
                <option value="ESTUDIANTE">ESTUDIANTE</option>
                <option value="EGRESADO">EGRESADO</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-mono mb-1 text-gray-600">
                Correo Institucional
              </label>
              <input
                type="email"
                required
                disabled={loadingAction === "save"}
                value={formData.email_institucional}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email_institucional: e.target.value,
                  })
                }
                className="w-full border-2 border-gray-300 p-2 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
                placeholder="ejemplo@unimayor.edu.co"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-mono mb-1 text-gray-600">
                Contraseña (Temporal)
              </label>
              <input
                type="text"
                required
                disabled={loadingAction === "save"}
                value={formData.password_hash}
                onChange={(e) =>
                  setFormData({ ...formData, password_hash: e.target.value })
                }
                className="w-full border-2 border-gray-300 p-2 focus:outline-none focus:border-[#F37021] bg-white disabled:bg-gray-100"
                placeholder="Ej. pixel2026"
              />
            </div>
            <button
              type="submit"
              disabled={loadingAction === "save"}
              className="bg-[#F37021] text-white px-8 py-2 font-bold border-2 border-[#1E293B] hover:bg-[#e06015] h-[44px] flex items-center justify-center min-w-[140px] disabled:opacity-70"
            >
              {loadingAction === "save" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editId ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </button>
          </div>
        </form>
      )}

      <table className="w-full text-left text-sm border-collapse min-w-[800px]">
        <thead className="bg-[#F8F9FA] border-b-2 border-[#1E293B]">
          <tr>
            <th className="p-3 font-mono">NOMBRE</th>
            <th className="p-3 font-mono">CARRERA</th>
            <th className="p-3 font-mono">ESTADO</th>
            <th className="p-3 font-mono">VETADO</th>
            <th className="p-3 font-mono text-right">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr
              key={s.id}
              className={`border-b border-gray-200 transition ${
                loadingAction === `delete-${s.id}`
                  ? "bg-red-50 opacity-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <td className="p-3 font-medium flex items-center">
                <img
                  src={s.img}
                  className="w-8 h-8 mr-3 border border-[#1E293B] object-cover"
                  alt=""
                />
                <div>
                  <div className="text-[#1E293B]">{s.name}</div>
                  <div className="text-xs text-gray-500 font-mono">
                    {s.email_institucional}
                  </div>
                </div>
              </td>
              <td className="p-3 text-gray-600">
                {s.carrera || "No registrada"}
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 text-[10px] font-mono border border-[#1E293B] ${s.status === "EGRESADO" ? "bg-[#2D5A27] text-white" : "bg-gray-100"}`}
                >
                  {s.status}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={
                    s.vetado
                      ? "text-red-600 font-bold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {s.vetado ? "SÍ" : "NO"}
                </span>
              </td>
              <td className="p-3 flex justify-end space-x-2">
                <button
                  onClick={() => toggleVetado(s)}
                  disabled={loadingAction !== null}
                  className={`${s.vetado ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"} text-white px-3 py-1 text-xs font-bold border border-[#1E293B] min-w-[80px] flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {loadingAction === `vetar-${s.id}` ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : s.vetado ? (
                    "Desvetar"
                  ) : (
                    "Vetar"
                  )}
                </button>
                <button
                  onClick={() => startEdit(s)}
                  disabled={loadingAction !== null}
                  className="bg-gray-200 p-2 border border-gray-400 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={loadingAction !== null}
                  className="bg-red-100 text-red-600 p-2 border border-red-300 hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loadingAction === `delete-${s.id}` ? (
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
    </div>
  );
}
