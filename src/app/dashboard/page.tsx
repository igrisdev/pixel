"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    } else {
      // Redirect según el rol
      if (currentUser.role === "ADMIN") {
        router.push("/dashboard/users");
      } else {
        router.push("/dashboard/profile");
      }
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#F37021] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-mono">Cargando...</p>
      </div>
    </div>
  );
}