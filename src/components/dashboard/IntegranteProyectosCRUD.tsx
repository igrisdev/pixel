"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Project } from "@/types";

export default function IntegranteProyectosCRUD() {
  const { projects, currentUser, addProject, updateProject, deleteProject } =
    useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "Desarrollo Tecnológico",
    objective: "",
    description: "",
    repoUrl: "",
    demoUrl: "",
  });

  const myProjects = projects.filter((p) =>
    p.team.some((t) => t.studentId === currentUser?.id),
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateProject(editId, formData);
      setEditId(null);
    } else if (currentUser) {
      const newProj: Project = {
        id: Date.now(),
        ...formData,
        awards: null,
        tech: ["En proceso..."],
        img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
        date: new Date().getFullYear().toString(),
        team: [
          {
            studentId: currentUser.id,
            name: currentUser.name,
            role: "Líder Creador",
            img: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1E293B&color=fff`,
          },
        ],
      };
      addProject(newProj);
      setIsAdding(false);
    }
    setFormData({
      title: "",
      type: "Desarrollo Tecnológico",
      objective: "",
      description: "",
      repoUrl: "",
      demoUrl: "",
    });
  };

  const startEdit = (proj: Project) => {
    setEditId(proj.id);
    setFormData({
      title: proj.title,
      type: proj.type,
      objective: proj.objective,
      description: proj.description,
      repoUrl: proj.repoUrl || "",
      demoUrl: proj.demoUrl || "",
    });
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "¿Seguro que deseas eliminar este proyecto de tu portafolio?",
      )
    )
      deleteProject(id);
  };

  return (
    <div className="bg-white pixel-border p-6 md:p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8 border-b-2 border-gray-100 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#1E293B]">
          Proyectos Publicados
        </h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditId(null);
          }}
          className="bg-[#2D5A27] hover:bg-[#1f3f1b] text-white px-5 py-2.5 text-sm font-bold border-2 border-[#1E293B] flex items-center transition"
        >
          {isAdding || editId ? (
            <X className="w-4 h-4 mr-2" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {isAdding || editId ? "CANCELAR" : "NUEVO PROYECTO"}
        </button>
      </div>

      {(isAdding || editId) && (
        <form
          onSubmit={handleSave}
          className="mb-10 p-6 md:p-8 bg-[#F8F9FA] border-2 border-dashed border-[#F37021] space-y-5"
        >
          <h3 className="font-bold text-lg text-[#F37021] mb-2">
            {editId ? "Editando Proyecto" : "Formulario de Nuevo Proyecto"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                TÍTULO DEL PROYECTO
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] outline-none p-3 font-medium text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                TIPO DE INVESTIGACIÓN
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] outline-none p-3 font-medium text-[#1E293B] bg-white"
              >
                <option>Desarrollo Tecnológico</option>
                <option>Investigación Aplicada</option>
                <option>Responsabilidad Social</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              OBJETIVO PRINCIPAL
            </label>
            <textarea
              required
              value={formData.objective}
              onChange={(e) =>
                setFormData({ ...formData, objective: e.target.value })
              }
              rows={2}
              className="w-full border-2 border-gray-300 focus:border-[#F37021] outline-none p-3"
              placeholder="El objetivo de este software es..."
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">
              DESCRIPCIÓN TÉCNICA Y ARQUITECTURA
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full border-2 border-gray-300 focus:border-[#F37021] outline-none p-3"
              placeholder="Construido utilizando Node.js en el backend y React..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                URL REPOSITORIO (Opcional)
              </label>
              <input
                type="url"
                value={formData.repoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, repoUrl: e.target.value })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] outline-none p-3"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1">
                URL DEMO (Opcional)
              </label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, demoUrl: e.target.value })
                }
                className="w-full border-2 border-gray-300 focus:border-[#F37021] outline-none p-3"
                placeholder="https://mi-app.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#F37021] hover:bg-[#e06015] text-white py-4 font-bold border-2 border-[#1E293B] text-lg mt-4 transition pixel-border-accent"
          >
            {editId ? "GUARDAR ACTUALIZACIÓN" : "PUBLICAR EN EL CATÁLOGO"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {myProjects.map((p) => (
          <div
            key={p.id}
            className="border-2 border-gray-200 flex flex-col group hover:border-[#F37021] transition relative bg-[#F8F9FA] overflow-hidden"
          >
            <div className="absolute top-3 right-3 flex space-x-2 z-10 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => startEdit(p)}
                className="bg-white p-2 border-2 border-[#1E293B] text-gray-700 hover:text-[#F37021] transition shadow-sm"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-white p-2 border-2 border-[#1E293B] text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="h-40 w-full overflow-hidden border-b-2 border-gray-200 relative bg-gray-300">
              <img
                src={p.img}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#1E293B] text-white text-[10px] font-mono px-2 py-1">
                {p.type}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-[#1E293B] text-xl mb-2 group-hover:text-[#F37021] transition">
                {p.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {p.objective}
              </p>
              <div className="mt-auto flex items-center text-xs font-mono text-gray-400">
                Actualizado: {p.date}
              </div>
            </div>
          </div>
        ))}
        {myProjects.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-16 border-2 border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-500 font-medium">
              Aún no has publicado ningún proyecto o investigación.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
