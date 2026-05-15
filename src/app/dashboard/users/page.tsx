"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminUsuariosCRUD from "@/components/dashboard/AdminUsuariosCRUD";

export default function UsersPage() {
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

  return <AdminUsuariosCRUD />;
}