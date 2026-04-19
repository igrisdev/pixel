import React from "react";
import Link from "next/link";
import { Student } from "@/types";

interface EscalatorCardProps {
  student: Student;
}

export default function EscalatorCard({ student }: EscalatorCardProps) {
  return (
    <Link
      href={`/profile/${student.id}`}
      className="bg-[#F8F9FA] border-2 border-[#1E293B] p-3 flex items-center hover:border-[#F37021] transition-colors group"
    >
      <img
        src={student.img}
        alt={student.name}
        className="w-12 h-12 border border-[#1E293B] mr-4"
      />
      <div>
        <h4 className="font-bold text-[#1E293B] text-sm group-hover:text-[#F37021]">
          {student.name}
        </h4>
        <p className="text-xs text-[#334155]">{student.role}</p>
      </div>
    </Link>
  );
}
