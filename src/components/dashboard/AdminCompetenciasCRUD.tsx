"use client";

import React, { useState, useRef } from "react"; // <-- IMPORTAMOS useRef
import { Edit, Trash2, Plus, X, Loader2 } from "lucide-react";
import { useDataStore } from "@/store/useDataStore";

export default function AdminCompetenciasCRUD() {
  const { competencies, setCompetencies } = useDataStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // <-- NUEVO: Referencia para el scroll
  const topRef = useRef<HTMLDivElement>(null);

  // Estado para gestionar cargas individuales
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: "TECHNICAL" | "SOFT";
  }>({
    name: "",
    description: "",
    type: "TECHNICAL",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction("save");

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (editId) {
        setCompetencies(
          competencies.map((c) =>
            c.id === editId ? { ...c, ...formData } : c,
          ),
        );
      } else {
        setCompetencies([{ id: Date.now(), ...formData }, ...competencies]);
      }

      setEditId(null);
      setIsAdding(false);
      setFormData({ name: "", description: "", type: "TECHNICAL" });
    } finally {
      setLoadingAction(null);
    }
  };

  const startEdit = (comp: any) => {
    setEditId(comp.id);
    setIsAdding(false);
    setFormData({
      name: comp.name,
      description: comp.description,
      type: comp.type,
    });

    // <-- NUEVO: Hacemos scroll suave hacia arriba después de un brevísimo momento
    // para asegurar que el formulario ya se renderizó
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCancelOrAdd = () => {
    if (isAdding || editId !== null) {
      setIsAdding(false);
      setEditId(null);
      setFormData({ name: "", description: "", type: "TECHNICAL" });
    } else {
      setIsAdding(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Borrar competencia global?")) {
      setLoadingAction(`delete-${id}`);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setCompetencies(competencies.filter((c) => c.id !== id));
      } finally {
        setLoadingAction(null);
      }
    }
  };

  return (
    // <-- NUEVO: Agregamos el ref al contenedor principal
    <div className="bg-white pixel-border p-6 shadow-sm" ref={topRef}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#1E293B]">
          Catálogo de Competencias
        </h2>
        <button
          onClick={handleCancelOrAdd}
          disabled={loadingAction !== null}
          className="bg-[#2D5A27] text-white px-4 py-2 border border-[#1E293B] text-sm font-bold flex items-center hover:bg-[#1f3f1b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding || editId ? (
            <X className="w-4 h-4 mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}
          {isAdding || editId ? "CANCELAR" : "NUEVA COMPETENCIA"}
        </button>
      </div>

      {(isAdding || editId !== null) && (
        <form
          onSubmit={handleSave}
          className="mb-8 p-6 bg-[#F8F9FA] border-2 border-[#1E293B] grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div className="col-span-1">
            <label className="block text-xs font-mono mb-1">Nombre Corto</label>
            <input
              type="text"
              required
              disabled={loadingAction === "save"}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021] outline-none disabled:bg-gray-100"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-mono mb-1">Descripción</label>
            <input
              type="text"
              required
              disabled={loadingAction === "save"}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border-2 border-gray-300 p-2 focus:border-[#F37021] outline-none disabled:bg-gray-100"
            />
          </div>
          <div className="col-span-1 flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-mono mb-1">Tipo</label>
              <select
                value={formData.type}
                disabled={loadingAction === "save"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "TECHNICAL" | "SOFT",
                  })
                }
                className="w-full border-2 border-gray-300 p-2 outline-none focus:border-[#F37021] disabled:bg-gray-100"
              >
                <option value="TECHNICAL">TÉCNICA</option>
                <option value="SOFT">TRANSVERSAL</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loadingAction === "save"}
              className="bg-[#F37021] text-white px-4 py-2 font-bold border-2 border-[#1E293B] hover:bg-[#e06015] mb-[2px] disabled:opacity-70 flex items-center justify-center min-w-[100px]"
            >
              {loadingAction === "save" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editId ? (
                "Guardar"
              ) : (
                "Crear"
              )}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competencies.map((c) => (
          <div
            key={c.id}
            className={`border-2 p-5 relative group transition bg-[#F8F9FA] ${
              loadingAction === `delete-${c.id}`
                ? "border-red-300 opacity-60"
                : "border-gray-200 hover:border-[#1E293B]"
            }`}
          >
            <span
              className={`text-[10px] font-mono font-bold px-2 py-1 mb-3 inline-block border ${c.type === "TECHNICAL" ? "bg-blue-100 text-blue-800 border-blue-300" : "bg-purple-100 text-purple-800 border-purple-300"}`}
            >
              {c.type === "TECHNICAL" ? "TÉCNICA" : "TRANSVERSAL"}
            </span>
            <h3 className="font-bold text-[#1E293B] text-lg">{c.name}</h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {c.description}
            </p>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition flex space-x-2 bg-[#F8F9FA] pl-2">
              <button
                onClick={() => startEdit(c)}
                disabled={loadingAction !== null}
                className="bg-gray-200 p-1.5 border border-gray-400 hover:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Edit className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                disabled={loadingAction !== null}
                className="bg-red-100 p-1.5 border border-red-300 text-red-600 hover:bg-red-200 disabled:cursor-not-allowed"
              >
                {loadingAction === `delete-${c.id}` ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
