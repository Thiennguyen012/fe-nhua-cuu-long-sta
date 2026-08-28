import type { Metadata } from "next";
import { AboutPageContent } from "@/app/components/AboutPageContent";
import { JsonLd } from "@/app/components/JsonLd";
import { createBreadcrumbJsonLd } from "@/app/lib/seo";
import { getPageContent } from "@/app/services/page-content.service";

export const metadata: Metadata = {
  title: "Giới thiệu | Nhựa Cửu Long STA",
  description: "Tìm hiểu hành trình, tầm nhìn và năng lực của Nhựa Cửu Long STA.",
  alternates: { canonical: "/gioi-thieu" },
  openGraph: {
    title: "Giới thiệu | Nhựa Cửu Long STA",
    description: "Tìm hiểu hành trình, tầm nhìn và năng lực của Nhựa Cửu Long STA.",
    url: "/gioi-thieu",
  },
};

export default async function AboutPage() {
  const pageContent = await getPageContent("gioi-thieu");
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Giới thiệu", path: "/gioi-thieu" },
        ])}
      />
      <AboutPageContent pageContent={pageContent} />
    </>
  );
}
