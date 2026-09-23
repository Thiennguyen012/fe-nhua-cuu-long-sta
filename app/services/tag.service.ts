import type { ProductTagGroup, ProductTagGroupListResponse } from "../models/tag.model";

const getApiBaseUrl = () =>
  (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api").replace(/\/$/, "");

const isTagGroup = (value: unknown): value is ProductTagGroup => {
  if (!value || typeof value !== "object") return false;

  const group = value as Partial<ProductTagGroup>;
  return (
    typeof group.id === "number" &&
    typeof group.name === "string" &&
    Array.isArray(group.tags) &&
    group.tags.every((tag) =>
      Boolean(tag) &&
      typeof tag === "object" &&
      typeof tag.id === "number" &&
      typeof tag.name === "string" &&
      typeof tag.slug === "string"
    )
  );
};

export async function getTagGroups(): Promise<ProductTagGroup[]> {
  const response = await fetch(`${getApiBaseUrl()}/tag-groups`, {
    headers: { Accept: "application/json", lang: "vi" },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Không thể tải nhóm tag sản phẩm (${response.status})`);

  const payload = (await response.json()) as Partial<ProductTagGroupListResponse>;
  if (!Array.isArray(payload.data) || !payload.data.every(isTagGroup)) {
    throw new Error("Dữ liệu nhóm tag sản phẩm không đúng định dạng");
  }

  return payload.data;
}
