import React from "react";
import Link from "next/link";
import { Code } from "lucide-react";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/project/${project.id}`}
      className="bg-white border-2 border-[#1E293B] overflow-hidden hover-lift flex flex-col group block"
    >
      <div className="relative h-48 border-b-2 border-[#1E293B] overflow-hidden bg-gray-200">
        <img
          src={project.img}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3 left-3 bg-[#F37021] text-white text-[10px] font-mono px-2 py-1 border border-[#1E293B] z-10">
          {project.type}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#1E293B] mb-2 group-hover:text-[#2D5A27] transition">
          {project.title}
        </h3>
        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          {project.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[#2D5A27] text-xs font-semibold flex items-center bg-gray-100 px-2 py-1 rounded-sm border border-gray-200"
            >
              <Code className="w-3 h-3 mr-1" /> {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
