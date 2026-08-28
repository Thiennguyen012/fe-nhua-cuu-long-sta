"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ProductBlankImage } from "./ProductBlankImage";
import type { ProductImage } from "../models/product.model";
import { getProductImageUrl } from "../lib/product";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  variantImage?: string | null;
}

export function ProductGallery({ images, productName, variantImage }: ProductGalleryProps) {
  const productImgUrls = images
    .map((img) => getProductImageUrl(img))
    .filter((url): url is string => Boolean(url));

  const allUrls = variantImage
    ? productImgUrls.includes(variantImage)
      ? [variantImage, ...productImgUrls.filter((u) => u !== variantImage)]
      : [variantImage, ...productImgUrls]
    : productImgUrls;

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (variantImage) {
      setSelectedIndex(0);
    }
  }, [variantImage]);

  const activeUrl = allUrls[selectedIndex] || null;

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allUrls.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < allUrls.length - 1 ? prev + 1 : 0));
  };

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
              {selectedIndex + 1} / {allUrls.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {allUrls.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {allUrls.map((url, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={url + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-square size-20 overflow-hidden rounded-xl border transition ${
                  isSelected
                    ? "scale-105 border-brand ring-2 ring-sky-200"
                    : "border-slate-200 bg-slate-100 opacity-75 hover:border-slate-300 hover:opacity-100"
                }`}
              >
                <img src={url} alt={`${productName} thumbnail ${idx + 1}`} className="size-full object-contain" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
