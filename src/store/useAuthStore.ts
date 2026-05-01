import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SystemRole } from "@/types";
import { ApiRepository } from "@/services/api";
import { useDataStore } from "./useDataStore";

export interface CurrentUser {
  id: number;
  name: string;
  role: SystemRole;
  email: string;
}

interface AuthState {
  currentUser: CurrentUser | null;
  userRole: SystemRole | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  // <-- NUEVO: Función para actualizar datos en la sesión activa
  updateCurrentUser: (updates: Partial<CurrentUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      userRole: null,

      login: async (email, pass) => {
        await ApiRepository.verifyCredentials();

        // Extraemos dinámicamente el arreglo de miembros actual
        const members = useDataStore.getState().members;

        // Buscamos al usuario usando sus emails
        const user = members.find(
          (m) => m.institutionalEmail === email || m.personalEmail === email,
        );

        if (user && pass === user.passwordHash) {
          if (user.isBanned) {
            console.warn("Intento de acceso de usuario vetado.");
            return false;
          }

          set({
            currentUser: {
              id: user.id,
              name: user.fullName,
              role: user.systemRole,
              email: user.institutionalEmail,
            },
            userRole: user.systemRole,
          });
          return true;
        }

        return false;
      },

      logout: () => {
        set({ currentUser: null, userRole: null });
      },

      // <-- NUEVO: Implementación para fusionar los datos nuevos con la sesión actual
      updateCurrentUser: (updates) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, ...updates }
            : null,
        })),
    }),
    {
      name: "pixel-auth-storage",
    },
  ),
);
