"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, X, Loader2, Images } from "lucide-react";
import { ApiRepository } from "@/services/api";
import { MAX_PRODUCT_IMAGES } from "@/lib/validations";

interface ProductImagesInputProps {
  value: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
}

export default function ProductImagesInput({
  value,
  onChange,
  disabled = false,
}: ProductImagesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const images = value || [];
  const remaining = MAX_PRODUCT_IMAGES - images.length;
  const isFull = remaining <= 0;

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError(null);

    // Solo subimos las que caben en el límite restante.
    const toUpload = files.slice(0, remaining);
    const ignored = files.length - toUpload.length;

    setIsUploading(true);
    try {
      const uploaded: string[] = [];
      const failed: string[] = [];

      for (const file of toUpload) {
        try {
          const result = await ApiRepository.uploadFile(file, "products");
          uploaded.push(result.url);
        } catch {
          failed.push(file.name);
        }
      }

      if (uploaded.length > 0) {
        onChange([...images, ...uploaded]);
      }

      const problemas: string[] = [];
      if (ignored > 0) {
        problemas.push(
          `${ignored} imagen${ignored !== 1 ? "es" : ""} omitida${ignored !== 1 ? "s" : ""}: máximo ${MAX_PRODUCT_IMAGES}.`,
        );
      }
      if (failed.length > 0) {
        problemas.push(`No se pudieron subir: ${failed.join(", ")}.`);
      }
      setError(problemas.length > 0 ? problemas.join(" ") : null);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
    setError(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono text-gray-500 flex items-center">
          <Images className="w-3 h-3 mr-1" /> IMÁGENES DEL PRODUCTO
        </label>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 border ${
            isFull
              ? "bg-orange-50 text-[#F37021] border-[#F37021]"
              : "bg-gray-50 text-gray-500 border-gray-300"
          }`}
        >
          {images.length}/{MAX_PRODUCT_IMAGES}
        </span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative group border-2 border-gray-200 bg-gray-50 aspect-square overflow-hidden"
            >
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "0.2";
                }}
              />
              {index === 0 && (
                <span className="absolute bottom-0 left-0 bg-[#1E293B] text-white text-[9px] font-mono px-1.5 py-0.5">
                  PORTADA
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={disabled || isUploading}
                className="absolute top-1 right-1 bg-white/90 text-gray-500 hover:bg-red-600 hover:text-white border border-gray-300 p-1 transition cursor-pointer disabled:opacity-50"
                title="Quitar imagen"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-center p-4 border border-dashed border-gray-300 text-gray-500 text-xs">
          Aún no has añadido imágenes a este producto.
        </p>
      )}

      <label
        className={`bg-[#1E293B] text-white px-4 py-2 text-xs font-bold inline-flex items-center justify-center transition cursor-pointer hover:bg-black ${
          disabled || isUploading || isFull
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : ""
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> SUBIENDO...
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4 mr-2" />
            {isFull ? "LÍMITE ALCANZADO" : "AÑADIR IMÁGENES"}
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleFilesChange}
          disabled={disabled || isUploading || isFull}
        />
      </label>

      <p className="text-[10px] text-gray-400">
        Puedes seleccionar varias a la vez. La primera imagen se usa como portada. Máximo{" "}
        {MAX_PRODUCT_IMAGES} imágenes de 5MB cada una.
      </p>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
