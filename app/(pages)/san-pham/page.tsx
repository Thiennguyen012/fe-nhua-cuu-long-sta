import type { Metadata } from "next";
import { Footer } from "@/app/components/Footer";
import { Navbar } from "@/app/components/Navbar";
import { ProductCatalog } from "@/app/components/ProductCatalog";
import { BreadcrumbBar } from "@/app/components/Breadcrumb";
import { JsonLd } from "@/app/components/JsonLd";
import { createBreadcrumbJsonLd } from "@/app/lib/seo";
import { getCategories } from "@/app/services/category.service";
import { getProducts } from "@/app/services/product.service";
import { getTagGroups } from "@/app/services/tag.service";
import type { ProductSort } from "@/app/models/product.model";

export const dynamic = "force-dynamic";

type ProductsPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const query = await searchParams;
  const hasQuery = Object.values(query).some((value) =>
    Array.isArray(value) ? value.some(Boolean) : Boolean(value)
  );

  return {
    title: "Sản phẩm | Nhựa Cửu Long STA",
    description: "Danh mục hũ nhựa, chai nhựa, hộp nhựa và bao bì nhựa chất lượng cao.",
    alternates: { canonical: "/san-pham" },
    robots: hasQuery ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: "Sản phẩm | Nhựa Cửu Long STA",
      description: "Danh mục hũ nhựa, chai nhựa, hộp nhựa và bao bì nhựa chất lượng cao.",
      url: "/san-pham",
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = await searchParams;
  const search = typeof query["tim-kiem"] === "string" ? query["tim-kiem"] : typeof query.search === "string" ? query.search : "";

  const [categories, tagGroups] = await Promise.all([
    getCategories().catch((error: unknown) => {
      console.error("Failed to load product categories:", error);
      return [];
    }),
    getTagGroups().catch((error: unknown) => {
      console.error("Failed to load product tag groups:", error);
      return [];
    }),
  ]);

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
  const isFeatured = featuredParamRaw === "true" ? true : undefined;

  const parsedPage = Number(typeof query.trang === "string" ? query.trang : typeof query.page === "string" ? query.page : 1);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const parsePositiveNumber = (value: string | string[] | undefined) => {
    const rawValue = Array.isArray(value) ? value[0] : value;
    if (!rawValue) return undefined;
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
  };
  const friendlyPriceValue =
    typeof query["khoang-gia"] === "string"
      ? query["khoang-gia"]
      : typeof query.gia === "string"
        ? query.gia
        : "";
  const friendlyPrice = friendlyPriceValue.match(/^(\d+)-(\d+)$/);
  const minPrice = friendlyPrice
    ? parsePositiveNumber(friendlyPrice[1])
    : parsePositiveNumber(query.min_price ?? query["gia-tu"]);
  const maxPrice = friendlyPrice
    ? parsePositiveNumber(friendlyPrice[2])
    : parsePositiveNumber(query.max_price ?? query["gia-den"]);

  const tagIds: number[] = [];
  const addTagIds = (value: string | string[] | undefined) => {
    if (!value) return;
    (Array.isArray(value) ? value : [value]).forEach((item) => {
      item.split(",").forEach((part) => {
        const id = Number(part.trim());
        if (Number.isInteger(id) && id > 0) tagIds.push(id);
      });
    });
  };
  addTagIds(query["tag_ids[]"]);
  addTagIds(query.tag_ids);
  addTagIds(query.tags);

  const tagSlugs: string[] = [];
  const addTagSlugs = (value: string | string[] | undefined) => {
    if (!value) return;
    (Array.isArray(value) ? value : [value]).forEach((item) => {
      item.split(",").forEach((part) => {
        const slug = part.trim();
        if (slug) tagSlugs.push(slug);
      });
    });
  };
  addTagSlugs(query["tag_slugs[]"]);
  addTagSlugs(query.tag_slugs);
  addTagSlugs(query.tag);

  const allTags = tagGroups.flatMap((group) => group.tags);
  const tagSlugsFromIds = allTags.filter((tag) => tagIds.includes(tag.id)).map((tag) => tag.slug);
  const selectedTagSlugs = Array.from(new Set([...tagSlugs, ...tagSlugsFromIds]));

  const productResponse = await getProducts({
    search,
    categorySlugs,
    tagSlugs: selectedTagSlugs,
    minPrice,
    maxPrice,
    sort,
    isFeatured,
    page,
    perPage: 12,
  }).catch(
    (error: unknown) => {
      console.error("Failed to load products:", error);
      return { status_code: 500, message: "", data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 } };
    }
  );

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Sản phẩm", path: "/san-pham" },
        ])}
      />
      <Navbar />
      <BreadcrumbBar items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]} />
      <ProductCatalog
        key={[search, categorySlugs.join(","), selectedTagSlugs.join(","), minPrice, maxPrice].join("|")}
        categories={categories}
        tagGroups={tagGroups}
        products={productResponse.data}
        meta={productResponse.meta}
        search={search}
        selectedCategorySlugs={categorySlugs}
        selectedTagSlugs={selectedTagSlugs}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sort={sort}
        isFeatured={isFeatured}
      />
      <Footer />
    </>
  );
}
