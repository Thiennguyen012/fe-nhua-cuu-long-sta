"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ProductBlankImage } from "./ProductBlankImage";
import type { ProductImage } from "../models/product.model";
import { getProductImageUrl } from "../lib/product";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  variantImages?: ProductImage[] | null;
}

export function ProductGallery({ images, productName, variantImages }: ProductGalleryProps) {
  const productImgUrls = images
    .map((img) => getProductImageUrl(img))
    .filter((url): url is string => Boolean(url));

  const variantImgUrls = (variantImages ?? [])
    .map((image) => getProductImageUrl(image))
    .filter((url): url is string => Boolean(url));

  // Preserve original product images order; append any extra variant images at the end
  const newVariantUrls = variantImgUrls.filter((url) => !productImgUrls.includes(url));
  const allUrls = [...productImgUrls, ...newVariantUrls];

  // Find index of first variant image in allUrls
  const initialVariantIndex = (() => {
    if (!variantImgUrls.length) return 0;
    const matchIdx = allUrls.findIndex((url) => variantImgUrls.includes(url));
    return matchIdx !== -1 ? matchIdx : 0;
  })();

  const initialThumbStart = (() => {
    if (allUrls.length <= 6) return 0;
    const maxStart = allUrls.length - 6;
    if (initialVariantIndex >= 6) {
      return Math.min(initialVariantIndex - 5, maxStart);
    }
    return 0;
  })();

  const [selectedIndex, setSelectedIndex] = useState(initialVariantIndex);
  const [thumbStartIndex, setThumbStartIndex] = useState(initialThumbStart);

  const safeSelectedIndex = selectedIndex < allUrls.length ? selectedIndex : 0;
  const activeUrl = allUrls[safeSelectedIndex] || null;

  const maxThumbStart = Math.max(0, allUrls.length - 6);
  const validThumbStart = Math.min(thumbStartIndex, maxThumbStart);

  const selectImage = (index: number) => {
    setSelectedIndex(index);
    if (allUrls.length > 6) {
      const maxStart = allUrls.length - 6;
      setThumbStartIndex((prev) => {
        if (index < prev) return index;
        if (index >= prev + 6) return Math.min(index - 5, maxStart);
        return prev;
      });
    }
  };

  const handlePrev = () => {
    const newIdx = safeSelectedIndex > 0 ? safeSelectedIndex - 1 : allUrls.length - 1;
    selectImage(newIdx);
  };

  const handleNext = () => {
    const newIdx = safeSelectedIndex < allUrls.length - 1 ? safeSelectedIndex + 1 : 0;
    selectImage(newIdx);
  };

  const handleThumbPrev = () => {
    setThumbStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleThumbNext = () => {
    setThumbStartIndex((prev) => Math.min(maxThumbStart, prev + 1));
  };

  const showThumbArrows = allUrls.length > 6;

  return (
    <div className="space-y-4">
      {/* Main Image Box */}
      <div className="group relative aspect-[6/5] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {activeUrl ? (
          <img
            key={activeUrl}
            src={activeUrl}
            alt={productName}
            className="size-full object-contain transition-opacity duration-300"
          />
        ) : (
          <ProductBlankImage />
        )}

        {/* Carousel Controls */}
        {allUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Ảnh trước"
              className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-md backdrop-blur transition hover:scale-110 hover:bg-white active:scale-95"
            >
              <svg viewBox="0 0 20 20" className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round">
                <path d="m12 15-5-5 5-5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Ảnh tiếp theo"
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-md backdrop-blur transition hover:scale-110 hover:bg-white active:scale-95"
            >
              <svg viewBox="0 0 20 20" className="size-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round">
                <path d="m8 5 5 5-5 5" />
              </svg>
            </button>

            {/* Counter Badge */}
            <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow backdrop-blur">
              {safeSelectedIndex + 1} / {allUrls.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {allUrls.length > 1 && (
        <div className="flex items-center gap-2">
          {showThumbArrows && (
            <button
              type="button"
              onClick={handleThumbPrev}
              disabled={validThumbStart === 0}
              aria-label="Thu nhỏ ảnh trước"
              className="grid size-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:active:scale-100"
            >
              <svg viewBox="0 0 20 20" className="size-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round">
                <path d="m12 15-5-5 5-5" />
              </svg>
            </button>
          )}

          <div className="overflow-hidden w-full py-1">
            <div
              className="flex gap-2 transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(calc(-${validThumbStart} * (100% + 0.5rem) / 6))`,
              }}
            >
              {allUrls.map((url, idx) => {
                const isSelected = idx === safeSelectedIndex;
                return (
                  <button
                    key={url + idx}
                    type="button"
                    onClick={() => selectImage(idx)}
                    style={{ width: "calc((100% - 2.5rem) / 6)" }}
                    className={`relative aspect-square shrink-0 overflow-hidden rounded-xl border transition ${
                      isSelected
                        ? "scale-105 border-brand ring-2 ring-sky-200 z-10"
                        : "border-slate-200 bg-slate-100 opacity-75 hover:border-slate-300 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`${productName} thumbnail ${idx + 1}`} className="size-full object-contain" />
                  </button>
                );
              })}
            </div>
          </div>

          {showThumbArrows && (
            <button
              type="button"
              onClick={handleThumbNext}
              disabled={validThumbStart >= maxThumbStart}
              aria-label="Thu nhỏ ảnh tiếp"
              className="grid size-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:active:scale-100"
            >
              <svg viewBox="0 0 20 20" className="size-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round">
                <path d="m8 5 5 5-5 5" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
