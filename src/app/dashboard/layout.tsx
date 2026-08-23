"use client";

import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
  Users,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1E293B",
            color: "#fff",
            border: "2px solid #F37021",
            borderRadius: "0",
          },
          success: {
            iconTheme: {
              primary: "#2D5A27",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fff",
            },
          },
        }}
      />
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row relative">
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

      {/* FONDO OSCURO PARA EL MENÚ MÓVIL */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
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
              {/* Sección de Gestión (Exclusiva Admin) */}
              <SidebarBtn
                active={isActive("/dashboard/users")}
                href="/dashboard/users"
                icon={<User className="w-5 h-5" />}
                label="Gestión de Usuarios"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <SidebarBtn
                active={isActive("/dashboard/approvals")}
                href="/dashboard/approvals"
                icon={<CheckSquare className="w-5 h-5" />}
                label="Aprobaciones Pendientes"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <SidebarBtn
                active={isActive("/dashboard/audits")}
                href="/dashboard/audits"
                icon={<Folder className="w-5 h-5" />}
                label="Auditoría Global"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <SidebarBtn
                active={isActive("/dashboard/competencies")}
                href="/dashboard/competencies"
                icon={<BookOpen className="w-5 h-5" />}
                label="Catálogo Competencias"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Sección Personal (Compartida con Admin) */}
              <div className="pt-4 mt-4 border-t border-gray-700">
                <p className="text-[10px] text-gray-500 font-mono mb-2 px-2">
                  ÁREA PERSONAL
                </p>
                <SidebarBtn
                  active={isActive("/dashboard/profile")}
                  href="/dashboard/profile"
                  icon={<Settings className="w-5 h-5" />}
                  label="Mi Perfil"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <SidebarBtn
                  active={isActive("/dashboard/projects")}
                  href="/dashboard/projects"
                  icon={<FolderPlus className="w-5 h-5" />}
                  label="Mis Proyectos"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <SidebarBtn
                  active={isActive("/dashboard/participations")}
                  href="/dashboard/participations"
                  icon={<Users className="w-5 h-5" />}
                  label="Mis Participaciones"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </>
          ) : (
            <>
              {/* Sección Personal para Integrante */}
              <SidebarBtn
                active={isActive("/dashboard/profile")}
                href="/dashboard/profile"
                icon={<Settings className="w-5 h-5" />}
                label="Mi Perfil"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <SidebarBtn
                active={isActive("/dashboard/projects")}
                href="/dashboard/projects"
                icon={<Folder className="w-5 h-5" />}
                label="Mis Proyectos"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <SidebarBtn
                active={isActive("/dashboard/participations")}
                href="/dashboard/participations"
                icon={<Users className="w-5 h-5" />}
                label="Mis Participaciones"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </>
          )}
        </nav>

        {/* CERRAR SESIÓN */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white transition border-l-4 border-transparent cursor-pointer"
          >
            <span className="mr-3 shrink-0">
              <LogOut className="w-5 h-5" />
            </span>
            <span className="text-left text-sm md:text-base flex-1 leading-tight">
              Cerrar Sesión
            </span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 w-full overflow-x-hidden">
        {children}
      </main>
      </div>
    </>
  );
}

function SidebarBtn({
  active,
  href,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 font-semibold transition ${
        active
          ? "bg-[#F37021] text-white border-l-4 border-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent"
      }`}
    >
      <span className="mr-3 shrink-0">{icon}</span>
      <span className="text-left text-sm md:text-base flex-1 leading-tight whitespace-normal break-words">
        {label}
      </span>
    </Link>
  );
}