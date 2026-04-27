import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SystemRole } from "@/types";
import { ApiRepository } from "@/services/api";
import { useDataStore } from "./useDataStore"; // <-- Importamos el store de datos

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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      userRole: null,

      login: async (email, pass) => {
        await ApiRepository.verifyCredentials();

        // Extraemos dinámicamente el arreglo de miembros actual (del otro store)
        const members = useDataStore.getState().members;

        // Buscamos al usuario sea Admin o Integrante usando sus emails
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
              role: user.systemRole, // "ADMIN" o "MEMBER"
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
    }),
    {
      name: "pixel-auth-storage", // <-- Guarda la sesión en su propia llave
    },
  ),
);
