import type { Category, CategoryListResponse } from "../models/category.model";

const getApiBaseUrl = () => {
  const baseUrl =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8000/api";

  return baseUrl.replace(/\/$/, "");
};

const isCategory = (value: unknown): value is Category => {
  if (!value || typeof value !== "object") return false;

  const category = value as Partial<Category>;
  return (
    typeof category.id === "number" &&
    typeof category.category_name === "string" &&
    (typeof category.description === "string" || category.description === null)
  );
};

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${getApiBaseUrl()}/categories`, {
    headers: {
      Accept: "application/json",
      lang: "vi",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Không thể tải danh mục sản phẩm (${response.status})`);
  }

  const payload: unknown = await response.json();
  const categoryResponse = payload as Partial<CategoryListResponse>;

  if (!Array.isArray(categoryResponse.data) || !categoryResponse.data.every(isCategory)) {
    throw new Error("Dữ liệu danh mục sản phẩm không đúng định dạng");
  }

  return categoryResponse.data;
}
