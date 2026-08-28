"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { formatProductPrice, getProductHref, getProductImageUrl } from "../lib/product";
import type { Category, PaginationMeta } from "../models/category.model";
import type { ProductListItem, ProductSort } from "../models/product.model";
import { stripHtml } from "../services/page-content.service";
import { ProductBlankImage } from "./ProductBlankImage";

type Props = {
  categories: Category[];
  products: ProductListItem[];
  meta: PaginationMeta;
  search: string;
  selectedCategorySlugs: string[];
  sort: ProductSort;
  isFeatured?: boolean;
};

type CatalogView = "grid" | "list";

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <rect x="3" y="10" width="18" height="4" rx="1" />
      <rect x="3" y="16" width="18" height="4" rx="1" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 8V4m0 0h4M5 4a9 9 0 1 1-1.5 9" />
    </svg>
  );
}

export function ProductCatalog({
  categories,
  products,
  meta,
  search,
  selectedCategorySlugs,
  sort,
  isFeatured,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState<CatalogView>("grid");
  const [catalogSearch, setCatalogSearch] = useState(search);

  const getCatSlugKey = (cat: Category) => cat.slug || String(cat.id);

  const navigate = (values: {
    search?: string;
    categorySlugs?: string[];
    sort?: ProductSort;
    isFeatured?: boolean | null;
    page?: number;
  }) => {
    const query = new URLSearchParams();
    const nextSearch = values.search ?? search;
    const nextCategorySlugs = values.categorySlugs ?? selectedCategorySlugs;
    const nextSort = values.sort ?? sort;
    const nextFeatured = values.isFeatured === null ? undefined : values.isFeatured ?? isFeatured;

    if (nextSearch) query.set("tim-kiem", nextSearch);
    if (nextCategorySlugs.length > 0) {
      query.set("danh-muc", nextCategorySlugs.join(","));
    }
    if (nextSort && nextSort !== "latest") query.set("sap-xep", nextSort);
    if (typeof nextFeatured === "boolean") query.set("noi-bat", String(nextFeatured));
    if ((values.page ?? 1) > 1) query.set("trang", String(values.page));

    const searchString = query.toString().replace(/%2C/g, ",");
    startTransition(() => router.push(searchString ? `/san-pham?${searchString}` : "/san-pham"));
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate({ search: catalogSearch.trim(), page: 1 });
    setFilterOpen(false);
  };

  const toggleCategory = (catKey: string) =>
    navigate({
      categorySlugs: selectedCategorySlugs.includes(catKey)
        ? selectedCategorySlugs.filter((item) => item !== catKey)
        : [...selectedCategorySlugs, catKey],
      page: 1,
    });

  const clearFilters = () => navigate({ search: "", categorySlugs: [], sort: "latest", isFeatured: null, page: 1 });
  const resetFilters = () => {
    setCatalogSearch("");
    clearFilters();
  };

  const activeCategories = categories.filter((category) =>
    selectedCategorySlugs.includes(getCatSlugKey(category))
  );

  const filterPanel = (
    <div className="space-y-6">
      <form onSubmit={submitSearch} className="flex items-center gap-2">
        <label htmlFor="catalog-search" className="sr-only">
          Tìm trong danh sách sản phẩm
        </label>
        <div className="relative min-w-0 flex-1">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 fill-none stroke-slate-400"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            id="catalog-search"
            name="catalog-search"
            value={catalogSearch}
            onChange={(event) => setCatalogSearch(event.target.value)}
            placeholder="Tên, SKU, mô tả..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-ink outline-none transition placeholder:text-[11px] placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>
        <button
          type="button"
          onClick={resetFilters}
          aria-label="Đặt lại bộ lọc"
          title="Đặt lại bộ lọc"
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-brand hover:bg-sky-50 hover:text-brand"
        >
          <ResetIcon />
        </button>
      </form>

      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-[13px] font-bold text-ink">Danh mục</h3>
        <div className="mt-3 space-y-1">
          <button
            type="button"
            onClick={() => navigate({ categorySlugs: [], page: 1 })}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] transition ${
              !selectedCategorySlugs.length
                ? "bg-sky-50 font-semibold text-brand"
                : "text-slate-500 hover:bg-slate-50 hover:text-ink"
            }`}
          >
            <span>Tất cả sản phẩm</span>
            <span className="text-xs">{!selectedCategorySlugs.length ? "✓" : ""}</span>
          </button>
          {categories.map((category) => {
            const catKey = getCatSlugKey(category);
            const isChecked = selectedCategorySlugs.includes(catKey);
            return (
              <label
                key={category.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition ${
                  isChecked ? "bg-sky-50 font-semibold text-brand" : "text-slate-500 hover:bg-slate-50 hover:text-ink"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCategory(catKey)}
                  className="size-3.5 rounded accent-[#0875bd]"
                />
                <span>{stripHtml(category.category_name)}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-ink">Khoảng giá</h3>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-slate-400">
            Chờ API
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {["Dưới 100.000đ", "100.000đ – 500.000đ", "Trên 500.000đ"].map((label) => (
            <label key={label} className="flex cursor-not-allowed items-center gap-3 text-xs text-slate-400">
              <input disabled type="radio" name="price-range" className="size-3.5" />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-ink">Tình trạng</h3>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-slate-400">
            Chờ API
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {["Còn hàng", "Hết hàng"].map((label) => (
            <button
              disabled
              key={label}
              type="button"
              className="cursor-not-allowed rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-400"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-ink">Chất liệu</h3>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-slate-400">
            Chờ API
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["HDPE", "PP", "PVC", "PET"].map((label) => (
            <button
              disabled
              key={label}
              type="button"
              className="cursor-not-allowed rounded-full border border-slate-200 px-3 py-1.5 text-[11px] text-slate-400"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto grid max-w-[1240px] gap-7 px-5 py-9 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(16,50,78,.06)] lg:sticky lg:top-[104px] lg:block">
          {filterPanel}
        </aside>

        <section className={`min-w-0 transition-opacity duration-200 ${isPending ? "opacity-50" : ""}`}>
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFilterOpen(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-sky-200 bg-white px-4 text-xs font-semibold text-ink lg:hidden"
                >
                  <FilterIcon />
                  Bộ lọc
                  {selectedCategorySlugs.length > 0 && (
                    <span className="grid size-5 place-items-center rounded-full bg-brand text-[10px] text-white">
                      {selectedCategorySlugs.length}
                    </span>
                  )}
                </button>
                <div>
                  <h1 className="text-lg font-bold text-ink">Danh sách sản phẩm</h1>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Tìm thấy <strong className="text-ink">{meta.total}</strong> sản phẩm
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="relative">
                  <span className="sr-only">Lọc sản phẩm nổi bật</span>
                  <select
                    value={isFeatured === true ? "true" : ""}
                    onChange={(event) =>
                      navigate({
                        isFeatured: event.target.value === "true" ? true : null,
                        page: 1,
                      })
                    }
                    className="h-10 appearance-none rounded-full border border-slate-200 bg-white py-0 pl-4 pr-9 text-[11px] text-ink outline-none focus:border-brand"
                  >
                    <option value="">Tất cả sản phẩm</option>
                    <option value="true">Sản phẩm nổi bật</option>
                  </select>
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 fill-none stroke-slate-500"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="m6 8 4 4 4-4" />
                  </svg>
                </label>

                <label className="relative">
                  <span className="sr-only">Sắp xếp sản phẩm</span>
                  <select
                    value={sort}
                    onChange={(event) => navigate({ sort: event.target.value as ProductSort, page: 1 })}
                    className="h-10 appearance-none rounded-full border border-slate-200 bg-white py-0 pl-4 pr-9 text-[11px] text-ink outline-none focus:border-brand"
                  >
                    <option value="latest">Mới nhất</option>
                    <option value="price_asc">Giá thấp đến cao</option>
                    <option value="price_desc">Giá cao đến thấp</option>
                    <option value="name_asc">Tên A – Z</option>
                    <option value="name_desc">Tên Z – A</option>
                  </select>
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 fill-none stroke-slate-500"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="m6 8 4 4 4-4" />
                  </svg>
                </label>

                <div className="hidden h-10 rounded-full border border-slate-200 p-1 sm:flex">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    aria-label="Hiển thị dạng lưới"
                    className={`grid size-8 place-items-center rounded-full transition ${
                      view === "grid" ? "bg-brand text-white" : "text-slate-400"
                    }`}
                  >
                    <GridIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    aria-label="Hiển thị dạng danh sách"
                    className={`grid size-8 place-items-center rounded-full transition ${
                      view === "list" ? "bg-brand text-white" : "text-slate-400"
                    }`}
                  >
                    <ListIcon />
                  </button>
                </div>
              </div>
            </div>

            {(search || activeCategories.length > 0 || isFeatured === true) && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-400">Đang lọc:</span>
                {search && (
                  <button
                    type="button"
                    onClick={() => navigate({ search: "", page: 1 })}
                    className="group inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-brand shadow-sm transition duration-200 hover:border-sky-300 hover:bg-sky-100 hover:shadow"
                  >
                    <span>“{search}”</span>
                    <span className="grid size-4 place-items-center rounded-full bg-sky-200/70 text-[10px] font-bold text-brand transition duration-200 group-hover:bg-brand group-hover:text-white">
                      ✕
                    </span>
                  </button>
                )}
                {activeCategories.map((category) => (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => toggleCategory(getCatSlugKey(category))}
                    className="group inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-brand shadow-sm transition duration-200 hover:border-sky-300 hover:bg-sky-100 hover:shadow"
                  >
                    <span>{stripHtml(category.category_name)}</span>
                    <span className="grid size-4 place-items-center rounded-full bg-sky-200/70 text-[10px] font-bold text-brand transition duration-200 group-hover:bg-brand group-hover:text-white">
                      ✕
                    </span>
                  </button>
                ))}
                {isFeatured === true && (
                  <button
                    type="button"
                    onClick={() => navigate({ isFeatured: null, page: 1 })}
                    className="group inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-brand shadow-sm transition duration-200 hover:border-sky-300 hover:bg-sky-100 hover:shadow"
                  >
                    <span>Nổi bật</span>
                    <span className="grid size-4 place-items-center rounded-full bg-sky-200/70 text-[10px] font-bold text-brand transition duration-200 group-hover:bg-brand group-hover:text-white">
                      ✕
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {products.length ? (
            <div className={`mt-6 grid gap-5 ${view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {products.map((product) => {
                const imageUrl = getProductImageUrl(product.first_image);
                return (
                  <article
                    key={product.id}
                    className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_18px_40px_rgba(16,50,78,.1)] ${
                      view === "list" ? "sm:grid sm:h-[190px] sm:grid-cols-[210px_minmax(0,1fr)]" : ""
                    }`}
                  >
                    <Link
                      href={getProductHref(product)}
                      className={`relative block overflow-hidden bg-white ${
                        view === "list" ? "aspect-square sm:h-[190px] sm:aspect-auto" : "aspect-square"
                      }`}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.product_name}
                          className="size-full object-contain p-2 transition duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <ProductBlankImage />
                      )}
                      {product.is_featured && (
                        <span
                          aria-label="Sản phẩm nổi bật"
                          title="Sản phẩm nổi bật"
                          className="absolute right-4 top-0 rounded-b-xl bg-brand px-3 pb-2 pt-2.5 text-[10px] font-bold uppercase tracking-[.08em] text-white shadow-[0_6px_16px_rgba(8,117,189,.25)]"
                        >
                          Nổi bật
                        </span>
                      )}
                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        {product.variants.length > 0 && (
                          <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold text-slate-600 shadow-sm backdrop-blur">
                            {product.variants.length} lựa chọn
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="flex flex-col p-4 sm:p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[.14em] text-brand">
                        {product.category_names || "Chưa phân loại"}
                      </p>
                      <Link href={getProductHref(product)}>
                        <h2 className="mt-2 line-clamp-2 text-base font-bold leading-6 text-ink transition group-hover:text-brand">
                          {product.product_name}
                        </h2>
                      </Link>
                      <p className="mt-1 text-[11px] text-slate-400">SKU: {product.sku || "—"}</p>
                      <p className={`mt-3 line-clamp-2 text-xs leading-5 text-slate-500 ${view === "grid" ? "min-h-10" : ""}`}>
                        {product.description ? stripHtml(product.description) : "Chưa có mô tả sản phẩm."}
                      </p>
                      <div className="mt-1.5 flex items-end justify-between gap-3">
                        <strong className="text-sm font-semibold text-brand">{formatProductPrice(product)}</strong>
                        <Link
                          href={getProductHref(product)}
                          aria-label={`Xem chi tiết ${product.product_name}`}
                          className="grid size-9 shrink-0 place-items-center rounded-full border border-sky-200 text-brand transition group-hover:border-brand group-hover:bg-brand group-hover:text-white"
                        >
                          →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 grid min-h-80 place-items-center rounded-3xl border border-dashed border-sky-200 bg-sky-50/30 text-center">
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-white text-2xl shadow-sm">
                  ⌕
                </span>
                <h2 className="mt-4 font-bold text-ink">Không tìm thấy sản phẩm</h2>
                <p className="mt-2 text-sm text-slate-400">Thử thay đổi từ khóa hoặc xóa bớt bộ lọc.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}

          {meta.last_page > 1 && (
            <nav aria-label="Phân trang" className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                disabled={meta.current_page <= 1}
                onClick={() => navigate({ page: meta.current_page - 1 })}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm disabled:opacity-40"
              >
                Trước
              </button>
              {Array.from({ length: meta.last_page }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => navigate({ page })}
                  className={`size-10 rounded-full text-sm font-semibold ${
                    page === meta.current_page
                      ? "bg-brand text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={meta.current_page >= meta.last_page}
                onClick={() => navigate({ page: meta.current_page + 1 })}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm disabled:opacity-40"
              >
                Sau
              </button>
            </nav>
          )}
        </section>
      </main>

      {filterOpen && (
        <div
          className="fixed inset-0 z-[80] bg-slate-950/35 backdrop-blur-sm lg:hidden"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setFilterOpen(false);
          }}
        >
          <aside className="h-full w-[min(88vw,340px)] overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <strong className="text-lg text-ink">Bộ lọc sản phẩm</strong>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                aria-label="Đóng bộ lọc"
                className="grid size-10 place-items-center rounded-full bg-slate-100 text-xl text-slate-600"
              >
                ×
              </button>
            </div>
            {filterPanel}
          </aside>
        </div>
      )}
    </div>
  );
}
