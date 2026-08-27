"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductGallery } from "./ProductGallery";
import { ProductVariantSelector } from "./ProductVariantSelector";
import type { ProductListItem, ProductVariant } from "../models/product.model";
import { getProductImageUrl } from "../lib/product";

interface ProductDetailViewProps {
  product: ProductListItem;
}

function getVariantImageUrl(variant: ProductVariant | null): string | null {
  if (!variant) return null;
  const v = variant as unknown as Record<string, unknown>;
  if (typeof v.image_url === "string" && v.image_url) return v.image_url;
  if (v.first_image) return getProductImageUrl(v.first_image as any);
  if (v.image) return getProductImageUrl(v.image as any);
  if (Array.isArray(v.images) && v.images.length > 0) return getProductImageUrl(v.images[0]);
  return null;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const images = product.images.length ? product.images : product.first_image ? [product.first_image] : [];
  const variantImage = getVariantImageUrl(selectedVariant);

  return (
    <section className="grid gap-8 rounded-3xl border border-sky-100 bg-white p-5 shadow-[0_18px_55px_rgba(16,50,78,.07)] sm:p-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
      {/* Left Column: Image Carousel */}
      <div>
        <ProductGallery
          images={images}
          productName={product.product_name}
          variantImage={variantImage}
        />
      </div>

      {/* Right Column: Product Info & Variant Selector */}
      <div className="py-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-100 px-3 py-1.5 text-[11px] font-bold text-brand">
            {product.category_names || "Chưa phân loại"}
          </span>
          {product.is_featured && (
            <span className="rounded-full bg-[#173f5b] px-3 py-1.5 text-[11px] font-bold text-white">
              Sản phẩm nổi bật
            </span>
          )}
        </div>

        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-[-.02em] text-ink sm:text-4xl">
          {product.product_name}
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          Mã sản phẩm:{" "}
          <strong className="font-semibold text-slate-600">
            {selectedVariant?.sku || product.sku || "Đang cập nhật"}
          </strong>
        </p>

        <ProductVariantSelector
          groups={product.variant_groups ?? []}
          variants={product.variants ?? []}
          onVariantChange={setSelectedVariant}
        />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/lien-he"
            className="rounded-full bg-brand px-7 py-3.5 text-center text-sm font-bold text-white shadow-[0_10px_25px_rgba(8,117,189,.22)] transition hover:bg-brand-dark"
          >
            Nhận tư vấn sản phẩm
          </Link>
          <a
            href="tel:0901234567"
            className="rounded-full border border-sky-200 bg-white px-7 py-3.5 text-center text-sm font-bold text-ink transition hover:border-brand hover:text-brand"
          >
            Gọi 0901 234 567
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-100 pt-7 text-xs text-slate-500">
          <p>
            <strong className="block text-sm font-semibold text-ink">Giao hàng toàn quốc</strong>
            Hỗ trợ vận chuyển linh hoạt
          </p>
          <p>
            <strong className="block text-sm font-semibold text-ink">Tư vấn kỹ thuật</strong>
            Chọn đúng giải pháp sử dụng
          </p>
        </div>
      </div>
    </section>
  );
}
