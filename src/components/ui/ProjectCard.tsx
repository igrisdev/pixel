import Link from "next/link";
import { Code, Calendar } from "lucide-react";
import { Project } from "@/types";

export default function ProjectCard({ project }: { project: Project }) {
  const projects = project.products || [];
  const primerProducto = projects[0];

  // Extraemos y combinamos todas las tecnologías de los projects tipo DESARROLLO
  const todasLasTech = projects
    .filter((p) => p.categoryType === "DEVELOPMENT")
    .flatMap((p) => p.technologies || []);
  const uniqueTech = Array.from(new Set(todasLasTech)).slice(0, 3); // Mostramos solo 3

  // Extraemos y combinamos todo el equipo (sin repetir integrantes)
  const todosLosIntegrantes = projects.flatMap((p) => p.participations || []);
  const uniqueTeam = Array.from(
    new Map(todosLosIntegrantes.map((p) => [p.memberId, p])).values(),
  );

  return (
    <Link
      href={`/project/${project.id}`}
      className="bg-white pixel-border overflow-hidden group hover:border-[#F37021] transition flex flex-col h-full cursor-pointer"
    >
      <div className="h-48 relative overflow-hidden bg-[#1E293B]">
        <img
          src={project.coverImageUrl || undefined}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
        />
        {primerProducto && (
          <div className="absolute top-3 left-3 bg-[#F37021] text-white text-[10px] font-mono px-2 py-1 font-bold shadow-md">
            {primerProducto.categoryType}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-[#1E293B] mb-2 group-hover:text-[#F37021] transition line-clamp-2">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
          {project.objective}
        </p>

        <div className="mt-auto space-y-4">
          {uniqueTech.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uniqueTech.map((t) => (
                <span
                  key={t}
                  className="text-[10px] bg-gray-100 border border-gray-200 text-[#334155] px-2 py-1 flex items-center font-mono"
                >
                  <Code className="w-3 h-3 mr-1 text-[#2D5A27]" /> {t}
                </span>
              ))}
              {todasLasTech.length > 3 && (
                <span className="text-xs text-gray-400 font-mono flex items-center">
                  +{todasLasTech.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex -space-x-2">
              {uniqueTeam.slice(0, 4).map((member, i) => (
                <img
                  key={i}
                  src={member.memberPhotoUrl || undefined}
                  alt={member.memberName}
                  className="w-8 h-8 rounded-none border border-[#1E293B] bg-white object-cover"
                  title={member.memberName}
                />
              ))}
              {uniqueTeam.length > 4 && (
                <div className="w-8 h-8 border border-[#1E293B] bg-gray-100 flex items-center justify-center text-[10px] font-bold text-[#1E293B] z-10">
                  +{uniqueTeam.length - 4}
                </div>
              )}
            </div>
            <span className="text-xs font-mono text-gray-400 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />{" "}
              {project.startDate.substring(0, 4)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
