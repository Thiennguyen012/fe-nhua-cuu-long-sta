import type { Category, PaginationMeta } from "./category.model";

export interface ProductImage {
  id: number;
  title: string | null;
  file_name: string;
  path: string;
  external_url: string | null;
  mime_type: string;
  sort_order: number;
}

export interface ProductOption {
  id: number;
  product_variant_group_id: number;
  product_id?: number;
  variant_group_id?: number;
  option_code: string;
  option_name: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProductVariantGroup {
  id: number;
  variant_group_id: number;
  group_code: string;
  group_name: string;
  is_required: boolean;
  sort_order: number;
  options: ProductOption[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: string;
  stock: number;
  is_active: boolean;
  options: ProductOption[];
  option_names: string;
}

export interface ProductListItem {
  id: number;
  product_name: string;
  slug?: string;
  sku: string | null;
  description: string | null;
  is_active: boolean;
  is_featured: boolean;
  categories: Category[];
  category_names: string;
  images: ProductImage[];
  first_image: ProductImage | null;
  variant_groups: ProductVariantGroup[];
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  status_code: number;
  message: string;
  data: ProductListItem[];
  meta: PaginationMeta;
}

export interface ProductDetailResponse {
  status_code: number;
  message: string;
  data: ProductListItem;
}

export type ProductSort = "price_asc" | "price_desc" | "name_asc" | "name_desc" | "latest";

export interface ProductListParams {
  search?: string;
  categorySlugs?: string[];
  categorySlug?: string;
  categoryIds?: number[];
  sort?: ProductSort;
  isFeatured?: boolean;
  perPage?: number;
  page?: number;
}
