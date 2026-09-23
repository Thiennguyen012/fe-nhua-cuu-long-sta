"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { formatProductPrice, getProductHref, getProductImageUrl } from "../lib/product";
import type { Category, PaginationMeta } from "../models/category.model";
import type { ProductListItem, ProductSort } from "../models/product.model";
import type { ProductTagGroup } from "../models/tag.model";
import { stripHtml } from "../services/page-content.service";
import { ProductBlankImage } from "./ProductBlankImage";

type Props = {
  categories: Category[];
  tagGroups: ProductTagGroup[];
  products: ProductListItem[];
  meta: PaginationMeta;
  search: string;
  selectedCategorySlugs: string[];
  selectedTagSlugs: string[];
  minPrice?: number;
  maxPrice?: number;
  sort: ProductSort;
  isFeatured?: boolean;
};

type CatalogView = "grid" | "list";

const MIN_PRICE = 0;
const MAX_PRICE = 2000000;
const PRICE_STEP = 10000;

const clampPrice = (value: number) => Math.min(MAX_PRICE, Math.max(MIN_PRICE, value));
const formatFilterPrice = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)}đ`;

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
  tagGroups,
  products,
  meta,
  search,
  selectedCategorySlugs,
  selectedTagSlugs,
  minPrice,
  maxPrice,
  sort,
  isFeatured,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState<CatalogView>("grid");
  const [catalogSearch, setCatalogSearch] = useState(search);
  const [draftMinPrice, setDraftMinPrice] = useState(String(minPrice ?? MIN_PRICE));
  const [draftMaxPrice, setDraftMaxPrice] = useState(String(maxPrice ?? MAX_PRICE));

  const parsedDraftMin = clampPrice(Number(draftMinPrice) || MIN_PRICE);
  const parsedDraftMax = clampPrice(Number(draftMaxPrice) || MAX_PRICE);
  const draftFrom = Math.min(parsedDraftMin, parsedDraftMax);
  const draftTo = Math.max(parsedDraftMin, parsedDraftMax);

  const getCatSlugKey = (cat: Category) => cat.slug || String(cat.id);

  const navigate = (values: {
    search?: string;
    categorySlugs?: string[];
    tagSlugs?: string[];
    minPrice?: number | null;
    maxPrice?: number | null;
    sort?: ProductSort;
    isFeatured?: boolean | null;
    page?: number;
  }) => {
    const query = new URLSearchParams();
    const nextSearch = values.search ?? search;
    const nextCategorySlugs = values.categorySlugs ?? selectedCategorySlugs;
    const nextTagSlugs = values.tagSlugs ?? selectedTagSlugs;
    const nextMinPrice = values.minPrice === null ? undefined : values.minPrice ?? minPrice;
    const nextMaxPrice = values.maxPrice === null ? undefined : values.maxPrice ?? maxPrice;
    const nextSort = values.sort ?? sort;
    const nextFeatured = values.isFeatured === null ? undefined : values.isFeatured ?? isFeatured;

    if (nextSearch) query.set("tim-kiem", nextSearch);
    if (nextCategorySlugs.length > 0) {
      query.set("danh-muc", nextCategorySlugs.join(","));
    }
    if (nextTagSlugs.length > 0) query.set("tag", nextTagSlugs.join(","));
    if (typeof nextMinPrice === "number" || typeof nextMaxPrice === "number") {
      query.set("khoang-gia", `${nextMinPrice ?? MIN_PRICE}-${nextMaxPrice ?? MAX_PRICE}`);
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

  const toggleTag = (tagSlug: string) =>
    navigate({
      tagSlugs: selectedTagSlugs.includes(tagSlug)
        ? selectedTagSlugs.filter((slug) => slug !== tagSlug)
        : [...selectedTagSlugs, tagSlug],
      page: 1,
    });

  const applyPriceFilter = () => {
    setDraftMinPrice(String(draftFrom));
    setDraftMaxPrice(String(draftTo));
    navigate({
      minPrice: draftFrom === MIN_PRICE && draftTo === MAX_PRICE ? null : draftFrom,
      maxPrice: draftFrom === MIN_PRICE && draftTo === MAX_PRICE ? null : draftTo,
      page: 1,
    });
    setFilterOpen(false);
  };

  const clearFilters = () =>
    navigate({
      search: "",
      categorySlugs: [],
      tagSlugs: [],
      minPrice: null,
      maxPrice: null,
      sort: "latest",
      isFeatured: null,
      page: 1,
    });
  const resetFilters = () => {
    setCatalogSearch("");
    setDraftMinPrice(String(MIN_PRICE));
    setDraftMaxPrice(String(MAX_PRICE));
    clearFilters();
  };

  const activeCategories = categories.filter((category) =>
    selectedCategorySlugs.includes(getCatSlugKey(category))
  );
  const activeTags = tagGroups.flatMap((group) => group.tags).filter((tag) => selectedTagSlugs.includes(tag.slug));
  const hasPriceFilter = typeof minPrice === "number" || typeof maxPrice === "number";
  const activePriceLabel = `${formatFilterPrice(minPrice ?? MIN_PRICE)} – ${formatFilterPrice(maxPrice ?? MAX_PRICE)}`;
  const activeFilterCount =
    selectedCategorySlugs.length +
    selectedTagSlugs.length +
    (hasPriceFilter ? 1 : 0) +
    (search ? 1 : 0) +
    (isFeatured ? 1 : 0);

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
        <h3 className="text-[13px] font-bold text-ink">Khoảng giá</h3>
        <div className="mt-5">
          <div className="relative h-5">
            <div className="absolute inset-x-0 top-2 h-1 rounded-full bg-slate-200" />
            <div
              className="absolute top-2 h-1 rounded-full bg-brand"
              style={{
                left: `${(draftFrom / MAX_PRICE) * 100}%`,
                right: `${100 - (draftTo / MAX_PRICE) * 100}%`,
              }}
            />
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={PRICE_STEP}
              value={draftFrom}
              aria-label="Giá thấp nhất"
              onChange={(event) =>
                setDraftMinPrice(String(Math.min(Number(event.target.value), draftTo)))
              }
              className="price-range-input absolute inset-x-0 top-0 w-full"
            />
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={PRICE_STEP}
              value={draftTo}
              aria-label="Giá cao nhất"
              onChange={(event) =>
                setDraftMaxPrice(String(Math.max(Number(event.target.value), draftFrom)))
              }
              className="price-range-input absolute inset-x-0 top-0 w-full"
            />
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <label className="min-w-0">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Từ</span>
              <div className="relative">
                <input
                  type="number"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={PRICE_STEP}
                  value={draftMinPrice}
                  onChange={(event) => setDraftMinPrice(event.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 pr-7 text-[11px] text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-sky-100"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">đ</span>
              </div>
            </label>
            <span className="pb-3 text-xs text-slate-300">–</span>
            <label className="min-w-0">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Đến</span>
              <div className="relative">
                <input
                  type="number"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={PRICE_STEP}
                  value={draftMaxPrice}
                  onChange={(event) => setDraftMaxPrice(event.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 pr-7 text-[11px] text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-sky-100"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">đ</span>
              </div>
            </label>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-400">
              {formatFilterPrice(draftFrom)} – {formatFilterPrice(draftTo)}
            </span>
            <button
              type="button"
              onClick={applyPriceFilter}
              className="cursor-pointer rounded-full bg-brand px-4 py-2 text-[11px] font-bold text-white transition hover:bg-brand-dark"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>

      {tagGroups.filter((group) => group.tags.length > 0).map((group) => (
        <div key={group.id} className="border-t border-slate-100 pt-5">
          <h3 className="text-[13px] font-bold text-ink">{group.name}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {group.tags.map((tag) => {
              const isSelected = selectedTagSlugs.includes(tag.slug);
              return (
                <button
                  key={tag.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleTag(tag.slug)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
                    isSelected
                      ? "border-brand bg-brand text-white shadow-sm"
                      : "border-slate-200 text-slate-500 hover:border-sky-300 hover:bg-sky-50 hover:text-brand"
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
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
                  {activeFilterCount > 0 && (
                    <span className="grid size-5 place-items-center rounded-full bg-brand text-[10px] text-white">
                      {activeFilterCount}
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

            {(search || activeCategories.length > 0 || activeTags.length > 0 || hasPriceFilter || isFeatured === true) && (
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
                {hasPriceFilter && (
                  <button
                    type="button"
                    onClick={() => navigate({ minPrice: null, maxPrice: null, page: 1 })}
                    className="group inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-brand shadow-sm transition duration-200 hover:border-sky-300 hover:bg-sky-100 hover:shadow"
                  >
                    <span>{activePriceLabel}</span>
                    <span className="grid size-4 place-items-center rounded-full bg-sky-200/70 text-[10px] font-bold text-brand transition duration-200 group-hover:bg-brand group-hover:text-white">
                      ✕
                    </span>
                  </button>
                )}
                {activeTags.map((tag) => (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => toggleTag(tag.slug)}
                    className="group inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-brand shadow-sm transition duration-200 hover:border-sky-300 hover:bg-sky-100 hover:shadow"
                  >
                    <span>{tag.name}</span>
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
