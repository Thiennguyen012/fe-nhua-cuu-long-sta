import type { PageContent, PageContentResponse, PageFile } from "../models/page-content.model";
import { getPageConfigAssetUrl } from "./page-config.service";

const getApiBaseUrl = () =>
  (process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8000/api")
    .replace(/\/$/, "");

export function getFileUrl(file?: PageFile | null): string | null {
  if (!file) return null;
  if (file.external_url) return file.external_url;
  if (file.path) return getPageConfigAssetUrl(file.path);
  return null;
}

export function stripHtml(html?: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

export async function getPageContent(slug: string): Promise<PageContent | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/page-contents/${slug}`, {
      headers: {
        Accept: "application/json",
        lang: "vi",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`Failed to fetch page content for slug '${slug}': ${response.status}`);
      return null;
    }

    const payload = (await response.json()) as Partial<PageContentResponse>;
    if (payload.status_code === 200 && payload.data && typeof payload.data === "object") {
      return payload.data as PageContent;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching page content for slug '${slug}':`, error);
    return null;
  }
}
