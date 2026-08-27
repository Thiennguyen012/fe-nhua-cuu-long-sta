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
    (config.company_name === undefined || typeof config.company_name === "string" || config.company_name === null) &&
    (config.slogan === undefined || typeof config.slogan === "string" || config.slogan === null) &&
    (config.description === undefined || typeof config.description === "string" || config.description === null) &&
    (config.addresses === undefined || Array.isArray(config.addresses) || config.addresses === null) &&
    (config.hotline === undefined || typeof config.hotline === "string" || config.hotline === null) &&
    (config.email === undefined || typeof config.email === "string" || config.email === null) &&
    (config.working_hour === undefined || typeof config.working_hour === "string" || config.working_hour === null) &&
    (config.map_url === undefined || typeof config.map_url === "string" || config.map_url === null) &&
    (config.socials === undefined || config.socials === null || typeof config.socials === "object") &&
    (config.favicon_path === undefined || typeof config.favicon_path === "string" || config.favicon_path === null) &&
    (config.logo_path === undefined || typeof config.logo_path === "string" || config.logo_path === null)
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
