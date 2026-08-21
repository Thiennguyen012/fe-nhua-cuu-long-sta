import { HomePage } from "@/app/components/HomePage";
import { getPageContent } from "@/app/services/page-content.service";

export default async function Page() {
  const pageContent = await getPageContent("trang-chu");
  return <HomePage pageContent={pageContent} />;
}
