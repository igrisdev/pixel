"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  LogOut,
  User,
  Folder,
  Settings,
  BookOpen,
  CheckSquare,
  FolderPlus,
  Menu,
  X,
} from "lucide-react";

// Importamos los componentes CRUD
import AdminAprobaciones from "@/components/dashboard/AdminAprobaciones";
import AdminUsuariosCRUD from "@/components/dashboard/AdminUsuariosCRUD";
import AdminCompetenciasCRUD from "@/components/dashboard/AdminCompetenciasCRUD";
import AdminAuditoriaCRUD from "@/components/dashboard/AdminAuditoriaCRUD";
import IntegrantePerfilCRUD from "@/components/dashboard/IntegrantePerfilCRUD";
import IntegranteProyectosCRUD from "@/components/dashboard/IntegranteProyectosCRUD";

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, logout } = useStore();
  const [activeTab, setActiveTab] = useState("");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row relative">
      {/* NAVEGACIÓN MÓVIL SUPERIOR (Visible solo en celulares) */}
      <div className="md:hidden bg-[#1E293B] text-white flex justify-between items-center p-4 sticky top-0 z-40 border-b-4 border-[#F37021] shadow-md">
        <h2 className="text-xl font-bold">
          Panel <span className="text-[#F37021]">Pixel</span>
        </h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 hover:bg-gray-800 rounded transition"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* FONDO OSCURO PARA EL MENÚ MÓVIL (Al hacer clic, se cierra) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR / BARRA LATERAL */}
      {/* CORRECCIÓN: md:top-[66px] md:h-[calc(100vh-66px)] md:z-40 */}
      <aside
        className={`fixed md:sticky top-0 md:top-[66px] left-0 z-50 md:z-40 h-screen md:h-[calc(100vh-66px)] w-64 bg-[#1E293B] text-white flex flex-col border-r-4 border-[#F37021] overflow-y-auto transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold mb-1 hidden md:block">
              Panel <span className="text-[#F37021]">Pixel</span>
            </h2>
            <p className="text-xs font-mono text-gray-400 flex items-center mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>{" "}
              <span className="truncate w-40">{currentUser.name}</span>
            </p>
            <div className="mt-3 inline-block bg-[#2D5A27] px-2 py-1 text-[10px] font-mono font-bold">
              ROL: {currentUser.role}
            </div>
          </div>

          {/* Botón X dentro del sidebar para móviles */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {currentUser.role === "ADMIN" ? (
            <>
              <SidebarBtn
                active={activeTab === "usuarios"}
                onClick={() => handleTabChange("usuarios")}
                icon={<User className="w-5 h-5" />}
                label="Gestión de Usuarios"
              />

              <SidebarBtn
                active={activeTab === "aprobaciones"}
                onClick={() => handleTabChange("aprobaciones")}
                icon={<CheckSquare className="w-5 h-5 text-yellow-400" />}
                label="Aprobaciones Pendientes"
              />

              <SidebarBtn
                active={activeTab === "proyectos_admin"}
                onClick={() => handleTabChange("proyectos_admin")}
                icon={<Folder className="w-5 h-5" />}
                label="Auditoría Global"
              />
              <SidebarBtn
                active={activeTab === "competencias"}
                onClick={() => handleTabChange("competencias")}
                icon={<BookOpen className="w-5 h-5" />}
                label="Catálogo Competencias"
              />

              <div className="pt-4 mt-4 border-t border-gray-700">
                <p className="text-[10px] text-gray-500 font-mono mb-2 px-2">
                  ÁREA PERSONAL
                </p>
                <SidebarBtn
                  active={activeTab === "mis_proyectos"}
                  onClick={() => handleTabChange("mis_proyectos")}
                  icon={<FolderPlus className="w-5 h-5" />}
                  label="Mis Proyectos"
                />
              </div>
            </>
          ) : (
            <>
              <SidebarBtn
                active={activeTab === "perfil"}
                onClick={() => handleTabChange("perfil")}
                icon={<Settings className="w-5 h-5" />}
                label="Mi Perfil"
              />
              <SidebarBtn
                active={activeTab === "mis_proyectos"}
                onClick={() => handleTabChange("mis_proyectos")}
                icon={<Folder className="w-5 h-5" />}
                label="Mis Proyectos"
              />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-700 mt-auto bg-[#1E293B]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-transparent border-2 border-gray-600 hover:border-red-500 hover:text-red-500 text-gray-300 font-bold py-3 transition"
          >
            <LogOut className="w-5 h-5 mr-2" /> SALIR
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-hidden w-full">
        <header className="mb-6 md:mb-8 border-b-2 border-gray-200 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] capitalize">
            {activeTab.replace("_", " ")}
          </h1>
        </header>

        {currentUser.role === "ADMIN" && activeTab === "usuarios" && (
          <AdminUsuariosCRUD />
        )}
        {currentUser.role === "ADMIN" && activeTab === "competencias" && (
          <AdminCompetenciasCRUD />
        )}
        {currentUser.role === "ADMIN" && activeTab === "proyectos_admin" && (
          <AdminAuditoriaCRUD />
        )}
        {currentUser.role === "ADMIN" && activeTab === "aprobaciones" && (
          <AdminAprobaciones />
        )}
        {currentUser.role === "INTEGRANTE" && activeTab === "perfil" && (
          <IntegrantePerfilCRUD />
        )}
        {activeTab === "mis_proyectos" && <IntegranteProyectosCRUD />}
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
      <span className="truncate text-left text-sm md:text-base">{label}</span>
    </button>
  );
}
