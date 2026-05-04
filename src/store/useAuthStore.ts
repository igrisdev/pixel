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
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (updates: Partial<CurrentUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      userRole: null,
      currentMember: null,

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
          });
          return true;
        } catch (error) {
          console.error("Error en login:", error);
          return false;
        }
      },

      logout: () => {
        set({ currentUser: null, userRole: null, currentMember: null });
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
    },
  ),
);
