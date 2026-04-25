"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { LogOut, User, Folder, Settings, BookOpen } from "lucide-react";

// Importamos los componentes CRUD
import AdminUsuariosCRUD from "@/components/dashboard/AdminUsuariosCRUD";
import AdminCompetenciasCRUD from "@/components/dashboard/AdminCompetenciasCRUD";
import AdminAuditoriaCRUD from "@/components/dashboard/AdminAuditoriaCRUD";
import IntegrantePerfilCRUD from "@/components/dashboard/IntegrantePerfilCRUD";
import IntegranteProyectosCRUD from "@/components/dashboard/IntegranteProyectosCRUD";

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, logout } = useStore();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    } else {
      setActiveTab(currentUser.role === "ADMIN" ? "usuarios" : "perfil");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#1E293B] text-white flex flex-col border-r-4 border-[#F37021] md:min-h-screen sticky top-0 md:h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold mb-1">
            Panel <span className="text-[#F37021]">Pixel</span>
          </h2>
          <p className="text-xs font-mono text-gray-400 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>{" "}
            {currentUser.name}
          </p>
          <div className="mt-3 inline-block bg-[#2D5A27] px-2 py-1 text-[10px] font-mono font-bold">
            ROL: {currentUser.role}
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {currentUser.role === "ADMIN" ? (
            <>
              <SidebarBtn
                active={activeTab === "usuarios"}
                onClick={() => setActiveTab("usuarios")}
                icon={<User className="w-5 h-5" />}
                label="Gestión de Usuarios"
              />
              <SidebarBtn
                active={activeTab === "proyectos_admin"}
                onClick={() => setActiveTab("proyectos_admin")}
                icon={<Folder className="w-5 h-5" />}
                label="Auditoría Proyectos"
              />
              <SidebarBtn
                active={activeTab === "competencias"}
                onClick={() => setActiveTab("competencias")}
                icon={<BookOpen className="w-5 h-5" />}
                label="Catálogo Competencias"
              />
            </>
          ) : (
            <>
              <SidebarBtn
                active={activeTab === "perfil"}
                onClick={() => setActiveTab("perfil")}
                icon={<Settings className="w-5 h-5" />}
                label="Mi Perfil"
              />
              <SidebarBtn
                active={activeTab === "mis_proyectos"}
                onClick={() => setActiveTab("mis_proyectos")}
                icon={<Folder className="w-5 h-5" />}
                label="Mis Proyectos"
              />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-700 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-transparent border-2 border-gray-600 hover:border-red-500 hover:text-red-500 text-gray-300 font-bold py-3 transition"
          >
            <LogOut className="w-5 h-5 mr-2" /> SALIR
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL (Inyecta el componente dinámicamente) */}
      <main className="flex-1 p-4 md:p-10 overflow-x-hidden">
        <header className="mb-8 border-b-2 border-gray-200 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] capitalize">
            {activeTab.replace("_", " ")}
          </h1>
        </header>

        {/* Renderizado Condicional del Componente CRUD correcto */}
        {currentUser.role === "ADMIN" && activeTab === "usuarios" && (
          <AdminUsuariosCRUD />
        )}
        {currentUser.role === "ADMIN" && activeTab === "competencias" && (
          <AdminCompetenciasCRUD />
        )}
        {currentUser.role === "ADMIN" && activeTab === "proyectos_admin" && (
          <AdminAuditoriaCRUD />
        )}

        {currentUser.role === "INTEGRANTE" && activeTab === "perfil" && (
          <IntegrantePerfilCRUD />
        )}
        {currentUser.role === "INTEGRANTE" && activeTab === "mis_proyectos" && (
          <IntegranteProyectosCRUD />
        )}
      </main>
    </div>
  );
}

function SidebarBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 font-semibold transition ${
        active
          ? "bg-[#F37021] text-white border-l-4 border-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}
