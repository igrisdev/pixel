import Link from "next/link";
import { Member } from "@/types";

interface EscalatorCardProps {
  member: Member;
}

export default function EscalatorCard({ member }: EscalatorCardProps) {
  // Extraemos SOLO las competencias técnicas para mostrarlas como etiquetas
  const techSkills =
    member.competencies
      ?.filter((c) => c.type === "TECHNICAL")
      .map((c) => c.name) || [];

  return (
    <Link
      href={`/profile/${member.id}`}
      // <-- PLUS 1: Animación de "levantamiento" con sombra estilo Pixel Art
      className="bg-[#F8F9FA] border-2 border-[#1E293B] p-3 flex items-center transition-all group hover:-translate-y-1 hover:border-[#F37021] hover:shadow-[4px_4px_0_0_#F37021]"
    >
      <div className="relative shrink-0 mr-4">
        <img
          src={member.photoUrl}
          alt={member.fullName}
          className="w-12 h-12 border-2 border-[#1E293B] object-cover bg-white"
        />
        <div
          className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-[#1E293B] ${
            member.academicStatus === "GRADUATE"
              ? "bg-[#2D5A27]"
              : "bg-green-400"
          }`}
          title={
            member.academicStatus === "GRADUATE"
              ? "Egresado"
              : "Estudiante Activo"
          }
        ></div>
      </div>

      <div className="flex-1 overflow-hidden">
        <h4 className="font-bold text-[#1E293B] text-sm group-hover:text-[#F37021] truncate transition-colors">
          {member.fullName}
        </h4>
        <p className="text-[10px] text-[#334155] font-mono uppercase truncate mb-1">
          {member.role}
        </p>

        {/* Reemplazamos member.tech por techSkills */}
        {techSkills.length > 0 && (
          <div className="flex gap-1">
            {techSkills.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[9px] bg-white border border-gray-300 px-1 font-bold text-gray-500 truncate max-w-[65px]"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
