"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductGallery } from "./ProductGallery";
import { ProductVariantSelector } from "./ProductVariantSelector";
import { usePageConfig } from "./PageConfigProvider";
import type {
  ProductImage,
  ProductListItem,
  ProductVariant,
  ProductVariantResponse,
} from "../models/product.model";

interface ProductDetailViewProps {
  product: ProductListItem;
}

const isProductImage = (value: unknown): value is ProductImage => {
  if (!value || typeof value !== "object") return false;
  const image = value as Partial<ProductImage>;
  return typeof image.id === "number" && (
    typeof image.path === "string" || typeof image.external_url === "string"
  );
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const config = usePageConfig();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [variantMedia, setVariantMedia] = useState<{ variantId: number; images: ProductImage[] } | null>(null);
  const hotline = config?.hotline?.trim() || "0901 234 567";
  const hotlineHref = hotline.replace(/[^\d+]/g, "");

  const images = product.images.length ? product.images : product.first_image ? [product.first_image] : [];
  const selectedVariantId = selectedVariant?.id ?? null;
  const selectedOptionIds = selectedVariant?.options.map((option) => option.id).sort((a, b) => a - b) ?? [];
  const optionIdsKey = selectedOptionIds.join(",");
  const resolvedVariantImages =
    selectedVariantId !== null && variantMedia?.variantId === selectedVariantId
      ? variantMedia.images
      : null;

  useEffect(() => {
    if (selectedVariantId === null || !optionIdsKey) return;

    const controller = new AbortController();
    const query = new URLSearchParams();
    optionIdsKey.split(",").forEach((optionId) => query.append("option_ids[]", optionId));

    void fetch(`/api/products/${product.id}/variant?${query}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Không thể tải ảnh biến thể (${response.status})`);
        return (await response.json()) as Partial<ProductVariantResponse>;
      })
      .then((payload) => {
        if (!payload.data) throw new Error("Dữ liệu biến thể không đúng định dạng");

        const variantImages = Array.isArray(payload.data.images)
          ? payload.data.images.filter(isProductImage)
          : [];
        if (variantImages.length === 0 && isProductImage(payload.data.first_image)) {
          variantImages.push(payload.data.first_image);
        }
        setVariantMedia({ variantId: selectedVariantId, images: variantImages });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Failed to load selected product variant:", error);
        setVariantMedia({ variantId: selectedVariantId, images: [] });
      });

    return () => controller.abort();
  }, [optionIdsKey, product.id, selectedVariantId]);

  return (
    <section className="grid gap-8 rounded-3xl border border-sky-100 bg-white p-5 shadow-[0_18px_55px_rgba(16,50,78,.07)] sm:p-8 lg:min-h-[540px] lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
      {/* Left Column: Image Carousel */}
      <div>
        <ProductGallery
          key={`${selectedVariantId ?? "product"}:${variantMedia?.variantId === selectedVariantId ? "resolved" : "pending"}`}
          images={images}
          productName={product.product_name}
          variantImages={resolvedVariantImages}
        />
      </div>

      {/* Right Column: Product Info & Variant Selector */}
      <div className="flex h-full flex-col py-1">
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

        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-[-.02em] text-ink sm:text-[34px]">
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
          isContactPrice={product.is_contact_price}
          onVariantChange={setSelectedVariant}
        />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:pt-6">
          <Link
            href="/lien-he"
            className="rounded-full bg-brand px-7 py-3.5 text-center text-sm font-bold text-white shadow-[0_10px_25px_rgba(8,117,189,.22)] transition hover:bg-brand-dark"
          >
            Nhận tư vấn sản phẩm
          </Link>
          <a
            href={`tel:${hotlineHref}`}
            className="rounded-full border border-sky-200 bg-white px-7 py-3.5 text-center text-sm font-bold text-ink transition hover:border-brand hover:text-brand"
          >
            Gọi {hotline}
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
