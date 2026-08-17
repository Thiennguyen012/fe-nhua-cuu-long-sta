import type { ProductImage, ProductListItem } from "../models/product.model";

export function createProductSlug(name: string, id: number) {
  const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  const slug = normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${slug || "san-pham"}-${id}`;
}

export function getProductHref(product: Pick<ProductListItem, "id" | "product_name">) {
  return `/san-pham/${createProductSlug(product.product_name, product.id)}`;
}

export function getProductIdFromSlug(slug: string) {
  const match = slug.match(/(?:^|-)(\d+)$/);
  return match ? Number(match[1]) : null;
}

export function getProductImageUrl(image: ProductImage | null | undefined) {
  if (!image) return null;
  if (image.external_url) return image.external_url;
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "http://localhost:8000/storage";
  return `${imageBaseUrl.replace(/\/$/, "")}/${image.path.replace(/^\//, "")}`;
}

export function getActiveProductPrices(product: Pick<ProductListItem, "variants">) {
  return product.variants.filter((variant) => variant.is_active).map((variant) => Number(variant.price)).filter(Number.isFinite);
}

export function formatProductPrice(product: Pick<ProductListItem, "variants">) {
  const prices = getActiveProductPrices(product);
  return prices.length ? `Từ ${Math.min(...prices).toLocaleString("vi-VN")}đ` : "Liên hệ";
}
