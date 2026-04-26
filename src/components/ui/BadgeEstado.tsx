import React from "react";
import { EstadoAprobacion } from "@/types";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface BadgeEstadoProps {
  estado: EstadoAprobacion;
}

export default function BadgeEstado({ estado }: BadgeEstadoProps) {
  switch (estado) {
    case "ACTIVO":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-800 border border-green-200 uppercase tracking-wide">
          <CheckCircle className="w-3 h-3" /> Activo
        </span>
      );
    case "PENDIENTE":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 uppercase tracking-wide">
          <Clock className="w-3 h-3" /> Pendiente
        </span>
      );
    case "RECHAZADO":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 uppercase tracking-wide">
          <AlertCircle className="w-3 h-3" /> Requiere Cambios
        </span>
      );
    default:
      return null;
  }
}
