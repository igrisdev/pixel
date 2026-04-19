"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Credenciales inválidas. Intenta nuevamente.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8F9FA] relative p-4">
      {/* Fondo de grilla estilo pixel */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#1E293B 1px, transparent 1px), linear-gradient(90deg, #1E293B 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="bg-white pixel-border p-8 md:p-12 w-full max-w-md relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block bg-[#1E293B] text-white px-3 py-1 font-mono text-xs mb-4">
            ACCESO RESTRINGIDO
          </div>
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2">
            Portal <span className="text-[#F37021]">Pixel</span>
          </h1>
          <p className="text-sm text-gray-500 font-mono">
            Autenticación de Integrantes
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-start text-sm font-semibold">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-2">
              CORREO INSTITUCIONAL
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#F8F9FA] border-2 border-[#1E293B] outline-none focus:border-[#F37021] text-[#334155] font-medium transition"
                placeholder="ejemplo@unimayor.edu.co"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-2">
              CONTRASEÑA
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#F8F9FA] border-2 border-[#1E293B] outline-none focus:border-[#F37021] text-[#334155] font-medium transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D5A27] hover:bg-[#1f3f1b] text-white font-bold py-4 pixel-border hover-lift transition flex justify-center items-center"
          >
            INICIAR SESIÓN
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400 font-mono">
            Demo Admin: admin@unimayor.edu.co / admin123
            <br />
            Demo Integrante: johan@gmail.com / est123
          </p>
        </div>
      </div>
    </main>
  );
}
