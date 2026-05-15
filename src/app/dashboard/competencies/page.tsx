"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminCompetenciasCRUD from "@/components/dashboard/AdminCompetenciasCRUD";

export default function CompetenciesPage() {
  const { currentUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "ADMIN") {
    return null;
  }

  return <AdminCompetenciasCRUD />;
}