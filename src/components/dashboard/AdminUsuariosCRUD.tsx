"use client";

import React, { useState } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Student } from "@/types";

export default function AdminUsuariosCRUD() {
  const { students, setStudents } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    status: "ESTUDIANTE" | "EGRESADO";
  }>({
    name: "",
    role: "",
    status: "ESTUDIANTE",
  });

  const toggleVetado = (id: number) =>
    setStudents(
      students.map((s) => (s.id === id ? { ...s, vetado: !s.vetado } : s)),
    );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: Date.now(),
      ...formData,
      tech: [],
      img: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=1E293B&color=fff`,
      vetado: false,
      email_personal: "",
      url_cv: "",
      enlaces: [],
    };
    setStudents([...students, newStudent]);
    setIsAdding(false);
    setFormData({ name: "", role: "", status: "ESTUDIANTE" });
  };

  const startEdit = (student: Student) => {
    setEditId(student.id);
    setFormData({
      name: student.name,
      role: student.role,
      status: student.status,
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setStudents(
      students.map((s) => (s.id === editId ? { ...s, ...formData } : s)),
    );
    setEditId(null);
    setFormData({ name: "", role: "", status: "ESTUDIANTE" });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Eliminar usuario del sistema?"))
      setStudents(students.filter((s) => s.id !== id));
  };

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
          }}
          className="bg-[#2D5A27] text-white px-4 py-2 border border-[#1E293B] hover:bg-[#1f3f1b] flex items-center font-bold text-sm"
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
          className="mb-6 p-4 bg-[#F8F9FA] border-2 border-[#1E293B] flex flex-wrap gap-4 items-end min-w-[600px]"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-mono mb-1">Nombre</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-2 focus:outline-none focus:border-[#F37021]"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-mono mb-1">
              Rol Principal
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-2 focus:outline-none focus:border-[#F37021]"
            />
          </div>
          <div className="w-40">
            <label className="block text-xs font-mono mb-1">Estado</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "ESTUDIANTE" | "EGRESADO",
                })
              }
              className="w-full border-2 border-gray-300 p-2 focus:outline-none focus:border-[#F37021]"
            >
              <option value="ESTUDIANTE">ESTUDIANTE</option>
              <option value="EGRESADO">EGRESADO</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-[#F37021] text-white px-6 py-2 font-bold border-2 border-[#1E293B] hover:bg-[#e06015]"
          >
            {editId ? "Actualizar" : "Crear"}
          </button>
        </form>
      )}

      <table className="w-full text-left text-sm border-collapse min-w-[800px]">
        <thead className="bg-[#F8F9FA] border-b-2 border-[#1E293B]">
          <tr>
            <th className="p-3 font-mono">NOMBRE</th>
            <th className="p-3 font-mono">ROL</th>
            <th className="p-3 font-mono">ESTADO</th>
            <th className="p-3 font-mono">VETADO</th>
            <th className="p-3 font-mono text-right">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr
              key={s.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="p-3 font-medium flex items-center">
                <img
                  src={s.img}
                  className="w-8 h-8 mr-3 border border-[#1E293B] object-cover"
                  alt=""
                />
                {s.name}
              </td>
              <td className="p-3 text-gray-600">{s.role}</td>
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
                  onClick={() => toggleVetado(s.id)}
                  className={`${s.vetado ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"} text-white px-3 py-1 text-xs font-bold border border-[#1E293B]`}
                >
                  {s.vetado ? "Desvetar" : "Vetar"}
                </button>
                <button
                  onClick={() => startEdit(s)}
                  className="bg-gray-200 p-2 border border-gray-400 hover:bg-gray-300 transition"
                >
                  <Edit className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-100 text-red-600 p-2 border border-red-300 hover:bg-red-200 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
