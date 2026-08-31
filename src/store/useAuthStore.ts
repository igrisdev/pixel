import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SystemRole, Member } from "@/types";
import { ApiRepository } from "@/services/api";

export interface CurrentUser {
  id: number;
  name: string;
  role: SystemRole;
  email: string;
}

interface AuthState {
  currentUser: CurrentUser | null;
  userRole: SystemRole | null;
  currentMember: Member | null;
  // false hasta que se comprueba la sesión real contra el servidor. Evita
  // expulsar al usuario mientras el estado todavía se está rehidratando.
  authChecked: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  updateCurrentUser: (updates: Partial<CurrentUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      userRole: null,
      currentMember: null,
      authChecked: false,

      login: async (email, pass) => {
        try {
          const member = await ApiRepository.login(email, pass);

          if (member.isBanned) {
            console.warn("Intento de acceso de usuario vetado.");
            return false;
          }

          set({
            currentUser: {
              id: member.id,
              name: member.fullName,
              role: member.systemRole,
              email: member.institutionalEmail,
            },
            userRole: member.systemRole,
            currentMember: member,
            authChecked: true,
          });
          return true;
        } catch (error) {
          console.error("Error en login:", error);
          return false;
        }
      },

      logout: async () => {
        try {
          await ApiRepository.logout();
        } catch {
          // Aunque falle el servidor, limpiamos el estado local.
        }
        set({ currentUser: null, userRole: null, currentMember: null, authChecked: true });
      },

      // Revalida la sesión contra la cookie httpOnly (fuente de verdad del
      // servidor). El estado persistido en localStorage es solo caché de UI.
      hydrate: async () => {
        try {
          const member = await ApiRepository.me();
          set({
            currentUser: {
              id: member.id,
              name: member.fullName,
              role: member.systemRole,
              email: member.institutionalEmail,
            },
            userRole: member.systemRole,
            currentMember: member,
            authChecked: true,
          });
        } catch {
          set({ currentUser: null, userRole: null, currentMember: null, authChecked: true });
        }
      },

      updateCurrentUser: (updates) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...updates }
            : null,
        })),
    }),
    {
      name: "pixel-auth-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
        userRole: state.userRole,
        currentMember: state.currentMember,
      }),
    },
  ),
);
