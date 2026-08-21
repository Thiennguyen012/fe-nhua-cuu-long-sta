import type { PageConfig, PageConfigResponse } from "../models/page-config.model";

const getApiBaseUrl = () =>
  (process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8000/api")
    .replace(/\/$/, "");

export const getPageConfigAssetUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;

  const apiOrigin = getApiBaseUrl().replace(/\/api\/?$/, "");
  return `${apiOrigin}/storage/${path.replace(/^\//, "")}`;
};

const isPageConfig = (value: unknown): value is PageConfig => {
  if (!value || typeof value !== "object") return false;

  const config = value as Partial<PageConfig>;
  return (
    typeof config.id === "number" &&
    typeof config.company_name === "string" &&
    (typeof config.slogan === "string" || config.slogan === null) &&
    (typeof config.description === "string" || config.description === null) &&
    Array.isArray(config.addresses) &&
    config.addresses.every((address) => typeof address === "string") &&
    typeof config.hotline === "string" &&
    (config.email === undefined || typeof config.email === "string" || config.email === null) &&
    typeof config.working_hour === "string" &&
    (config.map_url === undefined || typeof config.map_url === "string" || config.map_url === null) &&
    !!config.socials &&
    typeof config.socials === "object" &&
    (typeof config.favicon_path === "string" || config.favicon_path === null) &&
    (typeof config.logo_path === "string" || config.logo_path === null)
  );
};

export async function getPageConfig(): Promise<PageConfig> {
  const response = await fetch(`${getApiBaseUrl()}/page-configs`, {
    headers: {
      Accept: "application/json",
      lang: "vi",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Không thể tải cấu hình trang (${response.status})`);
  }

  const payload: unknown = await response.json();
  const pageConfigResponse = payload as Partial<PageConfigResponse>;

  if (!isPageConfig(pageConfigResponse.data)) {
    throw new Error("Dữ liệu cấu hình trang không đúng định dạng");
  }

  return pageConfigResponse.data;
}
