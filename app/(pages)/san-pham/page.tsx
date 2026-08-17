import type { Metadata } from "next";
import { Footer } from "@/app/components/Footer";
import { Navbar } from "@/app/components/Navbar";
import { ProductCatalog } from "@/app/components/ProductCatalog";
import { BreadcrumbBar } from "@/app/components/Breadcrumb";
import { getCategories } from "@/app/services/category.service";
import { getProducts } from "@/app/services/product.service";
import type { ProductSort } from "@/app/models/product.model";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sản phẩm | Nhựa Cửu Long STA",
  description: "Danh mục túi nhựa, ống nhựa, tấm nhựa, thùng nhựa, bao bì và màng nhựa.",
};

type ProductsPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = await searchParams;
  const search = typeof query.search === "string" ? query.search : "";
  const categoryParam = query["category_ids[]"];
  const categoryIds = (Array.isArray(categoryParam) ? categoryParam : categoryParam ? [categoryParam] : []).map(Number).filter((id) => Number.isInteger(id) && id > 0);
  const allowedSorts: ProductSort[] = ["price_asc", "price_desc", "name_asc", "name_desc", "latest"];
  const sortParam = typeof query.sort === "string" ? query.sort : "latest";
  const sort: ProductSort = allowedSorts.includes(sortParam as ProductSort) ? sortParam as ProductSort : "latest";
  const featuredParam = typeof query.is_featured === "string" ? query.is_featured : "";
  const isFeatured = featuredParam === "true" ? true : featuredParam === "false" ? false : undefined;
  const parsedPage = Number(typeof query.page === "string" ? query.page : 1);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [categories, productResponse] = await Promise.all([
    getCategories().catch((error: unknown) => { console.error("Failed to load product categories:", error); return []; }),
    getProducts({ search, categoryIds, sort, isFeatured, page, perPage: 12 }).catch((error: unknown) => { console.error("Failed to load products:", error); return { status_code: 500, message: "", data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 } }; }),
  ]);

  return <><Navbar/><BreadcrumbBar items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]}/><ProductCatalog categories={categories} products={productResponse.data} meta={productResponse.meta} search={search} selectedCategoryIds={categoryIds} sort={sort} isFeatured={isFeatured}/><Footer/></>;
}
