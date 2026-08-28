import type { MetadataRoute } from "next";
import { getProductHref, getProductImageUrl } from "./lib/product";
import { getSiteUrl } from "./lib/seo";
import { getProducts } from "./services/product.service";
import type { ProductListItem } from "./models/product.model";

export const dynamic = "force-dynamic";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: "/", changeFrequency: "weekly", priority: 1 },
  { url: "/san-pham", changeFrequency: "daily", priority: 0.9 },
  { url: "/gioi-thieu", changeFrequency: "monthly", priority: 0.7 },
  { url: "/lien-he", changeFrequency: "monthly", priority: 0.7 },
];

function getLastModified(value: string): Date | undefined {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const staticEntries = STATIC_ROUTES.map((entry) => ({
    ...entry,
    url: `${siteUrl}${entry.url}`,
  }));

  try {
    const firstPage = await getProducts({ page: 1, perPage: 100 });
    const remainingPages = await Promise.all(
      Array.from({ length: Math.max(0, firstPage.meta.last_page - 1) }, (_, index) =>
        getProducts({ page: index + 2, perPage: 100 })
      )
    );
    const products: ProductListItem[] = [
      ...firstPage.data,
      ...remainingPages.flatMap((response) => response.data),
    ];

    const productEntries: MetadataRoute.Sitemap = products.map((product) => {
      const imageUrl = getProductImageUrl(product.first_image);
      return {
        url: `${siteUrl}${getProductHref(product)}`,
        lastModified: getLastModified(product.updated_at),
        changeFrequency: "weekly",
        priority: 0.8,
        ...(imageUrl ? { images: [imageUrl] } : {}),
      };
    });

    return [...staticEntries, ...productEntries];
  } catch (error) {
    console.error("Failed to generate product sitemap:", error);
    return staticEntries;
  }
}
