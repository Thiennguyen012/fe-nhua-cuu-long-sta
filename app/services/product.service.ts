import type {
  ProductDetailResponse,
  ProductListItem,
  ProductListParams,
  ProductListResponse,
} from "../models/product.model";

const getApiBaseUrl = () =>
  (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api").replace(/\/$/, "");

export async function getProducts(params: ProductListParams = {}): Promise<ProductListResponse> {
  const query = new URLSearchParams();
  if (params.search?.trim()) query.set("search", params.search.trim());

  if (params.categorySlugs?.length) {
    query.set("category_slug", params.categorySlugs.join(","));
  } else if (params.categorySlug?.trim()) {
    query.set("category_slug", params.categorySlug.trim());
  }

  if (params.categoryIds?.length) {
    params.categoryIds.forEach((id) => query.append("category_ids[]", String(id)));
  }

  if (params.sort) query.set("sort", params.sort);
  if (typeof params.isFeatured === "boolean") query.set("is_featured", String(params.isFeatured));
  query.set("per_page", String(params.perPage ?? 12));
  query.set("page", String(params.page ?? 1));

  const response = await fetch(`${getApiBaseUrl()}/products?${query}`, {
    headers: { Accept: "application/json", lang: "vi" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Không thể tải danh sách sản phẩm (${response.status})`);

  const payload = (await response.json()) as Partial<ProductListResponse>;
  if (!Array.isArray(payload.data) || !payload.meta)
    throw new Error("Dữ liệu danh sách sản phẩm không đúng định dạng");
  return payload as ProductListResponse;
}

export async function getProduct(id: number | string): Promise<ProductListItem> {
  const response = await fetch(`${getApiBaseUrl()}/products/${id}`, {
    headers: { Accept: "application/json", lang: "vi" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Không thể tải chi tiết sản phẩm (${response.status})`);

  const payload = (await response.json()) as Partial<ProductDetailResponse>;
  if (!payload.data || typeof payload.data.id !== "number")
    throw new Error("Dữ liệu chi tiết sản phẩm không đúng định dạng");
  return payload.data;
}
