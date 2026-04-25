"use client";

import React, { useState } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function AdminCompetenciasCRUD() {
  const { competencies, setCompetencies } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    nombre: string;
    descripcion: string;
    tipo: "TECNICA" | "TRANSVERSAL";
  }>({
    nombre: "",
    descripcion: "",
    tipo: "TECNICA",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setCompetencies(
        competencies.map((c) => (c.id === editId ? { ...c, ...formData } : c)),
      );
      setEditId(null);
    } else {
      setCompetencies([{ id: Date.now(), ...formData }, ...competencies]);
      setIsAdding(false);
    }
    setFormData({ nombre: "", descripcion: "", tipo: "TECNICA" });
  };

  const startEdit = (comp: any) => {
    setEditId(comp.id);
    setFormData({
      nombre: comp.nombre,
      descripcion: comp.descripcion,
      tipo: comp.tipo,
    });
  };
  const handleDelete = (id: number) => {
    if (window.confirm("¿Borrar competencia global?"))
      setCompetencies(competencies.filter((c) => c.id !== id));
  };

  return (
    <div className="bg-white pixel-border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#1E293B]">
          Catálogo de Competencias
        </h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditId(null);
          }}
          className="bg-[#2D5A27] text-white px-4 py-2 border border-[#1E293B] text-sm font-bold flex items-center hover:bg-[#1f3f1b]"
        >
          {isAdding || editId ? (
            <X className="w-4 h-4 mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}
          {isAdding || editId ? "CANCELAR" : "NUEVA COMPETENCIA"}
        </button>
      </div>

      {(isAdding || editId) && (
        <form
          onSubmit={handleSave}
          className="mb-8 p-6 bg-[#F8F9FA] border-2 border-[#1E293B] grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div className="col-span-1">
            <label className="block text-xs font-mono mb-1">Nombre Corto</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021] outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-mono mb-1">Descripción</label>
            <input
              type="text"
              required
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021] outline-none"
            />
          </div>
          <div className="col-span-1 flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-mono mb-1">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value as any })
                }
                className="w-full border-2 border-gray-300 p-2 outline-none focus:border-[#F37021]"
              >
                <option value="TECNICA">TÉCNICA</option>
                <option value="TRANSVERSAL">TRANSVERSAL</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-[#F37021] text-white px-4 py-2 font-bold border-2 border-[#1E293B] hover:bg-[#e06015] mb-[2px]"
            >
              {editId ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competencies.map((c) => (
          <div
            key={c.id}
            className="border-2 border-gray-200 p-5 relative group hover:border-[#1E293B] transition bg-[#F8F9FA]"
          >
            <span
              className={`text-[10px] font-mono font-bold px-2 py-1 mb-3 inline-block border ${c.tipo === "TECNICA" ? "bg-blue-100 text-blue-800 border-blue-300" : "bg-purple-100 text-purple-800 border-purple-300"}`}
            >
              {c.tipo}
            </span>
            <h3 className="font-bold text-[#1E293B] text-lg">{c.nombre}</h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {c.descripcion}
            </p>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition flex space-x-2 bg-[#F8F9FA] pl-2">
              <button
                onClick={() => startEdit(c)}
                className="bg-gray-200 p-1.5 border border-gray-400 hover:bg-gray-300"
              >
                <Edit className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="bg-red-100 p-1.5 border border-red-300 text-red-600 hover:bg-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
