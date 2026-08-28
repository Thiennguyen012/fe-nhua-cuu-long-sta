import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { PageConfigProvider } from "./components/PageConfigProvider";
import { getPageConfig, getPageConfigAssetUrl } from "./services/page-config.service";
import { getCategories } from "./services/category.service";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { getSiteUrl } from "./lib/seo";
export const dynamic = "force-dynamic";
const font = Be_Vietnam_Pro({ variable: "--font-be-vietnam", subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700", "800"] });
export async function generateMetadata(): Promise<Metadata> {
  const pageConfig = await getPageConfig().catch(() => null);
  const siteUrl = getSiteUrl();
  const faviconUrl = pageConfig?.favicon_path
    ? getPageConfigAssetUrl(pageConfig.favicon_path)
    : "/favicon.ico";

  return {
    metadataBase: new URL(siteUrl),
    title: "Nhựa Cửu Long STA | Giải pháp nhựa công nghiệp",
    description: "Sản phẩm nhựa chất lượng cao cho công nghiệp và đời sống.",
    applicationName: "Nhựa Cửu Long STA",
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: "Nhựa Cửu Long STA",
      title: "Nhựa Cửu Long STA | Giải pháp nhựa công nghiệp",
      description: "Sản phẩm nhựa chất lượng cao cho công nghiệp và đời sống.",
      url: siteUrl,
      ...(pageConfig?.logo_path
        ? { images: [{ url: getPageConfigAssetUrl(pageConfig.logo_path), alt: "Nhựa Cửu Long STA" }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: "Nhựa Cửu Long STA | Giải pháp nhựa công nghiệp",
      description: "Sản phẩm nhựa chất lượng cao cho công nghiệp và đời sống.",
    },
    icons: {
      icon: [{ url: faviconUrl }],
      shortcut: [{ url: faviconUrl }],
    },
  };
}
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [pageConfig, categories] = await Promise.all([
    getPageConfig().catch((error: unknown) => {
      console.error("Failed to load page config:", error);
      return null;
    }),
    getCategories().catch((error: unknown) => {
      console.error("Failed to load categories:", error);
      return [];
    }),
  ]);

  return <html lang="vi" className={`${font.variable} ${font.className}`}><body><PageConfigProvider config={pageConfig} categories={categories}>{children}<ScrollToTopButton/></PageConfigProvider></body></html>;
}
