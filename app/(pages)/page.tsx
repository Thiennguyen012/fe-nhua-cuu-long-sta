import type { Metadata } from "next";
import { HomePage } from "@/app/components/HomePage";
import { getPageContent } from "@/app/services/page-content.service";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Page() {
  const pageContent = await getPageContent("trang-chu");
  return <HomePage pageContent={pageContent} />;
}
