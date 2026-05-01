import Link from "next/link";
import { Member } from "@/types";
import { ExternalLink } from "lucide-react";

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  // Traducción de valores en inglés al español para la interfaz
  const statusText =
    member.academicStatus === "GRADUATE" ? "EGRESADO" : "ESTUDIANTE";

  // 1. Extraemos SOLO las competencias técnicas para mostrarlas como etiquetas
  const techSkills =
    member.competencies
      ?.filter((c) => c.type === "TECHNICAL")
      .map((c) => c.name) || [];

  return (
    <Link
      href={`/profile/${member.id}`}
      className="bg-white pixel-border p-5 hover-lift flex flex-col h-full group"
    >
      <div className="flex justify-between items-start w-full mb-4">
        <img
          src={member.photoUrl}
          alt={member.fullName}
          className="w-16 h-16 object-cover border-2 border-[#1E293B]"
        />
        <span
          className={`text-[10px] font-mono px-2 py-1 border border-[#1E293B] ${
            member.academicStatus === "GRADUATE"
              ? "bg-[#2D5A27] text-white"
              : "bg-gray-100 text-[#334155]"
          }`}
        >
          {statusText}
        </span>
      </div>

      <h3 className="font-bold text-lg text-[#2D5A27] mb-1 leading-tight group-hover:text-[#F37021] transition-colors">
        {member.fullName}
      </h3>

      <p className="text-[#334155] text-sm font-medium">{member.role}</p>

      {/* Campo de Carrera */}
      <p className="text-gray-500 text-[10px] font-mono mb-4 flex-grow uppercase">
        {member.career}
      </p>

      {/* Indicadores de Enlaces */}
      {member.links && member.links.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {member.links.map((link) => (
            <div
              key={link.id}
              className="flex items-center text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 border border-blue-200"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {link.platform}
            </div>
          ))}
        </div>
      )}

      {/* Tecnologías (Extraídas de las competencias) */}
      <div className="flex flex-wrap gap-1 mt-auto">
        {techSkills.slice(0, 3).map((techName) => (
          <span
            key={techName}
            className="bg-gray-100 text-[#334155] text-xs px-2 py-1 font-mono border border-gray-300"
          >
            {techName}
          </span>
        ))}
        {/* Indicador de que hay más tecnologías ocultas */}
        {techSkills.length > 3 && (
          <span className="bg-gray-100 text-[#334155] text-xs px-2 py-1 font-mono border border-gray-300 font-bold">
            +{techSkills.length - 3}
          </span>
        )}
      </div>
    </Link>
  );
}
