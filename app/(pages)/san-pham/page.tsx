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
  description: "Danh mục hũ nhựa, chai nhựa, hộp nhựa và bao bì nhựa chất lượng cao.",
};

type ProductsPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = await searchParams;
  const search = typeof query["tim-kiem"] === "string" ? query["tim-kiem"] : typeof query.search === "string" ? query.search : "";

  const categories = await getCategories().catch((error: unknown) => {
    console.error("Failed to load product categories:", error);
    return [];
  });

  let categorySlugs: string[] = [];
  const addSlugs = (val: string | string[] | undefined) => {
    if (!val) return;
    const arr = Array.isArray(val) ? val : [val];
    arr.forEach((str) => {
      if (typeof str === "string") {
        str.split(",").forEach((s) => {
          if (s.trim()) categorySlugs.push(s.trim());
        });
      }
    });
  };

  addSlugs(query["danh-muc"]);
  addSlugs(query["danh-muc-slugs"]);
  addSlugs(query["category_slugs[]"]);
  addSlugs(query.category_slugs);
  addSlugs(query.category_slug);
  categorySlugs = Array.from(new Set(categorySlugs));

  const rawIds = query["danh-muc-ids"] || query["category_ids[]"] || query.category_ids;
  if (!categorySlugs.length && rawIds) {
    const rawIdsArr = Array.isArray(rawIds) ? rawIds : [rawIds];
    const ids: number[] = [];
    rawIdsArr.forEach((item) => {
      if (typeof item === "string") {
        item.split(",").forEach((s) => {
          const num = Number(s.trim());
          if (Number.isInteger(num) && num > 0) ids.push(num);
        });
      } else if (typeof item === "number" && Number.isInteger(item) && item > 0) {
        ids.push(item);
      }
    });
    categorySlugs = categories.filter((c) => ids.includes(c.id)).map((c) => c.slug || String(c.id));
  }

  const allowedSorts: ProductSort[] = ["price_asc", "price_desc", "name_asc", "name_desc", "latest"];
  const sortParamRaw = typeof query["sap-xep"] === "string" ? query["sap-xep"] : typeof query.sort === "string" ? query.sort : "latest";
  const sortMap: Record<string, ProductSort> = {
    "moi-nhat": "latest",
    "gia-thap-den-cao": "price_asc",
    "gia-tang": "price_asc",
    "gia-cao-den-thap": "price_desc",
    "gia-giam": "price_desc",
    "ten-a-z": "name_asc",
    "ten-z-a": "name_desc",
  };
  const sortParam = sortMap[sortParamRaw] || sortParamRaw;
  const sort: ProductSort = allowedSorts.includes(sortParam as ProductSort) ? (sortParam as ProductSort) : "latest";

  const featuredParamRaw = typeof query["noi-bat"] === "string" ? query["noi-bat"] : typeof query.is_featured === "string" ? query.is_featured : "";
  const isFeatured = featuredParamRaw === "true" ? true : featuredParamRaw === "false" ? false : undefined;

  const parsedPage = Number(typeof query.trang === "string" ? query.trang : typeof query.page === "string" ? query.page : 1);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const productResponse = await getProducts({ search, categorySlugs, sort, isFeatured, page, perPage: 12 }).catch(
    (error: unknown) => {
      console.error("Failed to load products:", error);
      return { status_code: 500, message: "", data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 } };
    }
  );

  return (
    <>
      <Navbar />
      <BreadcrumbBar items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]} />
      <ProductCatalog
        key={search + categorySlugs.join(",")}
        categories={categories}
        products={productResponse.data}
        meta={productResponse.meta}
        search={search}
        selectedCategorySlugs={categorySlugs}
        sort={sort}
        isFeatured={isFeatured}
      />
      <Footer />
    </>
  );
}
