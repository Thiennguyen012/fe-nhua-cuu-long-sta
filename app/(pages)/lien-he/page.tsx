import type { Metadata } from "next";
import { ContactPageContent } from "@/app/components/ContactPageContent";
import { getPageContent } from "@/app/services/page-content.service";

export const metadata: Metadata = {
  title: "Liên hệ | Nhựa Cửu Long STA",
  description: "Liên hệ Nhựa Cửu Long STA để được tư vấn giải pháp và sản phẩm nhựa công nghiệp.",
  alternates: { canonical: "/lien-he" },
  openGraph: {
    title: "Liên hệ | Nhựa Cửu Long STA",
    description: "Liên hệ Nhựa Cửu Long STA để được tư vấn giải pháp và sản phẩm nhựa công nghiệp.",
    url: "/lien-he",
  },
};

export default async function ContactPage() {
  const pageContent = await getPageContent("lien-he");
  return <ContactPageContent pageContent={pageContent} />;
}
