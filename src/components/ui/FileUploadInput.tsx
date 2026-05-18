"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { ApiRepository } from "@/services/api";
import { UploadType } from "@/lib/upload";

interface FileUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  uploadType: UploadType;
  accept: string;
  label: string;
  placeholder?: string;
  preview?: boolean;
}

export default function FileUploadInput({
  value,
  onChange,
  uploadType,
  accept,
  label,
  placeholder = "Selecciona un archivo...",
  preview = false,
}: FileUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await ApiRepository.uploadFile(file, uploadType);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir el archivo");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    onChange("");
    setError(null);
  };

  const fileName = value ? value.split("/").pop() : null;
  const isExternalUrl = value && !value.startsWith("/uploads/");

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono text-gray-500">{label}</label>

      {value && preview && !isExternalUrl ? (
        <div className="relative mb-2">
          {uploadType === "profiles" || uploadType === "covers" ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-32 object-cover border-2 border-gray-200 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex items-center gap-2 p-3 bg-gray-50 border-2 border-gray-200 rounded">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600 truncate">{fileName}</span>
            </div>
          )}
        </div>
      ) : null}

      <div className="flex gap-2">
        {isExternalUrl ? (
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 border-2 border-gray-300 p-2 outline-none focus:border-[#F37021] text-sm disabled:bg-gray-100"
            placeholder={placeholder}
          />
        ) : (
          <div className="flex-1 flex items-center gap-2 p-2 border-2 border-gray-300 bg-gray-50 text-sm text-gray-600">
            {fileName ? (
              <>
                {uploadType === "profiles" || uploadType === "covers" ? (
                  <ImageIcon className="w-4 h-4 text-gray-400" />
                ) : (
                  <FileText className="w-4 h-4 text-gray-400" />
                )}
                <span className="truncate">{fileName}</span>
              </>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
        )}

        <label
          className={`bg-[#1E293B] text-white px-4 py-2 text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-black transition ${isUploading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <UploadCloud className="w-4 h-4 mr-2" />
              SUBIR
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="bg-red-500 text-white px-3 py-2 text-xs font-bold hover:bg-red-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
