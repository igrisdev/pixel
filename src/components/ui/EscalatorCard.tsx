import React from "react";
import Link from "next/link";
import { Member } from "@/types";

interface EscalatorCardProps {
  member: Member;
}

export default function EscalatorCard({ member }: EscalatorCardProps) {
  return (
    <Link
      href={`/profile/${member.id}`}
      className="bg-[#F8F9FA] border-2 border-[#1E293B] p-3 flex items-center hover:border-[#F37021] transition-colors group"
    >
      <img
        src={member.photoUrl}
        alt={member.fullName}
        className="w-12 h-12 border border-[#1E293B] mr-4"
      />
      <div>
        <h4 className="font-bold text-[#1E293B] text-sm group-hover:text-[#F37021]">
          {member.fullName}
        </h4>
        <p className="text-xs text-[#334155]">{member.role}</p>
      </div>
    </Link>
  );
}
