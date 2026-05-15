"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDataStore } from "@/store/useDataStore";
import CompetencyModal from "@/components/ui/competency-crud/CompetencyModal";

export default function AdminCompetenciasCRUD() {
  const { competencies, loadCompetencies, createCompetency, updateCompetency, deleteCompetency } = useDataStore();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    loadCompetencies().finally(() => setIsLoadingData(false));
  }, [loadCompetencies]);

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
      if (editId) {
        await updateCompetency(editId, formData);
        toast.success("Competencia actualizada");
      } else {
        await createCompetency(formData);
        toast.success("Competencia creada");
      }

      setEditId(null);
      setIsAdding(false);
      setFormData({ name: "", description: "", type: "TECHNICAL" });
    } catch (error) {
      console.error("Error guardando competencia:", error);
      toast.error("Error al guardar la competencia");
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
        await deleteCompetency(id);
        toast.success("Competencia eliminada");
      } catch (error) {
        console.error("Error eliminando competencia:", error);
        toast.error("Error al eliminar la competencia");
      } finally {
        setLoadingAction(null);
      }
    }
  };

  if (isLoadingData) {
    return (
      <div className="bg-white pixel-border p-6 shadow-sm min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F37021] mr-3" />
        <span className="text-gray-500 font-mono">Cargando competencias...</span>
      </div>
    );
  }

  return (
    <div className="bg-white pixel-border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#1E293B]">
          Catálogo de Competencias
        </h2>
        <button
          onClick={handleCancelOrAdd}
          disabled={loadingAction !== null}
          className="bg-[#2D5A27] text-white px-4 py-2 border border-[#1E293B] text-sm font-bold flex items-center hover:bg-[#1f3f1b] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
        <CompetencyModal
          editId={editId}
          loadingAction={loadingAction}
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSave}
          onClose={() => {
            setIsAdding(false);
            setEditId(null);
            setFormData({ name: "", description: "", type: "TECHNICAL" });
          }}
        />
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
                className="bg-gray-200 p-1.5 border border-gray-400 hover:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
              >
                <Edit className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                disabled={loadingAction !== null}
                className="bg-red-100 p-1.5 border border-red-300 text-red-600 hover:bg-red-200 disabled:cursor-not-allowed cursor-pointer"
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
