import type { Metadata } from "next";
import { AboutPageContent } from "@/app/components/AboutPageContent";
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
  return <AboutPageContent pageContent={pageContent} />;
}
