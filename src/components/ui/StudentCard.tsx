import Link from "next/link";
import { Member } from "@/types";

interface StudentCardProps {
  member: Member;
}

export default function StudentCard({ member }: StudentCardProps) {
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
          className={`text-[10px] font-mono px-2 py-1 border border-[#1E293B] ${member.academicStatus === "GRADUATE" ? "bg-[#2D5A27] text-white" : "bg-gray-100 text-[#334155]"}`}
        >
          {member.academicStatus}
        </span>
      </div>
      <h3 className="font-bold text-lg text-[#2D5A27] mb-1 leading-tight group-hover:text-[#F37021] transition-colors">
        {member.fullName}
      </h3>
      <p className="text-[#334155] text-sm font-medium mb-4 flex-grow">
        {member.role}
      </p>
      <div className="flex flex-wrap gap-1 mt-auto">
        {member.tech.slice(0, 3).map((t) => (
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
