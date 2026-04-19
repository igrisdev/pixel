import React from "react";
import Link from "next/link";
import { Student } from "@/types";

interface StudentCardProps {
  student: Student;
}

export default function StudentCard({ student }: StudentCardProps) {
  return (
    <Link
      href={`/profile/${student.id}`}
      className="bg-white pixel-border p-5 hover-lift flex flex-col h-full group"
    >
      <div className="flex justify-between items-start w-full mb-4">
        <img
          src={student.img}
          alt={student.name}
          className="w-16 h-16 object-cover border-2 border-[#1E293B]"
        />
        <span
          className={`text-[10px] font-mono px-2 py-1 border border-[#1E293B] ${student.status === "EGRESADO" ? "bg-[#2D5A27] text-white" : "bg-gray-100 text-[#334155]"}`}
        >
          {student.status}
        </span>
      </div>
      <h3 className="font-bold text-lg text-[#2D5A27] mb-1 leading-tight group-hover:text-[#F37021] transition-colors">
        {student.name}
      </h3>
      <p className="text-[#334155] text-sm font-medium mb-4 flex-grow">
        {student.role}
      </p>
      <div className="flex flex-wrap gap-1 mt-auto">
        {student.tech.slice(0, 3).map((t) => (
          <span
            key={t}
            className="bg-gray-100 text-[#334155] text-xs px-2 py-1 font-mono border border-gray-300"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
