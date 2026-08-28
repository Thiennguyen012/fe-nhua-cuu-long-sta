import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { PageConfigProvider } from "./components/PageConfigProvider";
import { getPageConfig, getPageConfigAssetUrl } from "./services/page-config.service";
import { getCategories } from "./services/category.service";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { JsonLd } from "./components/JsonLd";
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

  const siteUrl = getSiteUrl();
  const companyName = pageConfig?.company_name?.trim() || "Nhựa Cửu Long STA";
  const sameAs = Object.values(pageConfig?.socials ?? {}).filter(
    (url): url is string => typeof url === "string" && /^https?:\/\//i.test(url)
  );
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: companyName,
    url: siteUrl,
    ...(pageConfig?.logo_path
      ? { logo: getPageConfigAssetUrl(pageConfig.logo_path) }
      : {}),
    ...(pageConfig?.description?.trim()
      ? { description: pageConfig.description.trim() }
      : {}),
    ...(pageConfig?.hotline?.trim()
      ? { telephone: pageConfig.hotline.trim() }
      : {}),
    ...(pageConfig?.email?.trim() ? { email: pageConfig.email.trim() } : {}),
    ...(pageConfig?.addresses?.length
      ? {
          address: pageConfig.addresses.filter(Boolean).map((address) => ({
            "@type": "PostalAddress",
            streetAddress: address,
            addressCountry: "VN",
          })),
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  return <html lang="vi" className={`${font.variable} ${font.className}`}><body><JsonLd data={organizationJsonLd}/><PageConfigProvider config={pageConfig} categories={categories}>{children}<ScrollToTopButton/></PageConfigProvider></body></html>;
}
