"use client";

import React, { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

// Miniaturas visibles en la tarjeta antes de agrupar el resto en "+N".
const VISIBLE_THUMBS = 4;

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const total = images.length;
  const visible = images.slice(0, VISIBLE_THUMBS);
  const extra = total - visible.length;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + total) % total)),
    [total],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % total)),
    [total],
  );

  // Navegación por teclado y bloqueo del scroll de fondo mientras el visor está abierto.
  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, prev, next]);

  if (total === 0) return null;

  return (
    <>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {visible.map((url, i) => {
          const showsExtra = extra > 0 && i === visible.length - 1;

          return (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setOpenIndex(i)}
              title={showsExtra ? `Ver las ${total} imágenes` : `Ver imagen ${i + 1}`}
              className="relative aspect-square border-2 border-gray-200 bg-white overflow-hidden group hover:border-[#F37021] transition cursor-pointer"
            >
              <img
                src={url}
                alt={`${title} — imagen ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              {showsExtra && (
                <span className="absolute inset-0 bg-[#1E293B]/75 text-white flex items-center justify-center font-mono font-bold">
                  +{extra}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de ${title}`}
        >
          <div className="absolute inset-0 bg-black/85" onClick={close} />

          <div className="relative z-10 w-full max-w-4xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-white bg-[#1E293B] px-2 py-1 border border-white/20">
                {openIndex + 1} / {total}
              </span>
              <button
                type="button"
                onClick={close}
                title="Cerrar (Esc)"
                className="text-white/70 hover:text-white bg-[#1E293B] border border-white/20 p-2 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-black border-2 border-white/20">
              <img
                src={images[openIndex]}
                alt={`${title} — imagen ${openIndex + 1}`}
                className="w-full max-h-[75vh] object-contain"
              />

              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    title="Anterior (←)"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#1E293B]/90 text-white border border-white/20 p-2 hover:bg-[#F37021] transition cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    title="Siguiente (→)"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1E293B]/90 text-white border border-white/20 p-2 hover:bg-[#F37021] transition cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {total > 1 && (
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {images.map((url, i) => (
                  <button
                    key={`nav-${url}-${i}`}
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    className={`w-12 h-12 border-2 overflow-hidden transition cursor-pointer ${
                      i === openIndex
                        ? "border-[#F37021]"
                        : "border-white/25 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
