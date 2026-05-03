import React from "react";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { AcademicProduct } from "@/types";
import BadgeEstado from "@/components/ui/BadgeEstado";

type Props = {
  product: AcademicProduct;
  loadingAction: string | null;
  onEdit: () => void;
  onDelete: () => void;
};

const categoryLabel = {
  DEVELOPMENT: "DESARROLLO",
  WRITING: "ESCRITO",
  EVENT: "EVENTO",
} as const;

const categoryColor = {
  DEVELOPMENT: "bg-blue-600",
  WRITING: "bg-purple-600",
  EVENT: "bg-[#F37021]",
} as const;

export default function ProductCard({ product, loadingAction, onEdit, onDelete }: Props) {
  const isDeleting = loadingAction === `delete-prod-${product.id}`;

  return (
    <div
      className={`border p-4 relative group transition flex flex-col ${
        isDeleting ? "border-red-300 bg-red-50 opacity-50" : "border-gray-200 hover:border-[#1E293B]"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`text-[10px] font-mono font-bold px-2 py-1 inline-block text-white ${
              categoryColor[product.categoryType]
            }`}
          >
            {categoryLabel[product.categoryType]}
          </div>
          <BadgeEstado estado={product.approvalStatus} />
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={onEdit}
            disabled={loadingAction !== null}
            className="bg-gray-100 text-gray-600 p-1.5 hover:bg-blue-600 hover:text-white transition disabled:opacity-50"
            title="Editar Producto y Equipo"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={loadingAction !== null}
            className="bg-gray-100 text-gray-600 p-1.5 hover:bg-red-600 hover:text-white transition disabled:opacity-50 flex items-center justify-center min-w-[30px]"
            title="Eliminar Producto"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <h5 className="font-bold text-[#1E293B] mb-1">{product.title}</h5>
      <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{product.description}</p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <div className="flex -space-x-2">
          {(product.participations || []).map((part) => (
            <img
              key={part.id}
              src={part.memberPhotoUrl || undefined}
              alt={part.memberName}
              title={`${part.memberName} - ${part.productRole}`}
              className="w-8 h-8 border-2 border-white bg-gray-200 object-cover rounded-full"
            />
          ))}
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          {product.participations?.length || 0} Integrante(s)
        </span>
      </div>
    </div>
  );
}
