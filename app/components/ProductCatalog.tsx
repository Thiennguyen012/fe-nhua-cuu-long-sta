"use client";

/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTransition } from "react";
import { formatProductPrice, getProductHref, getProductImageUrl } from "../lib/product";
import type { Category, PaginationMeta } from "../models/category.model";
import type { ProductListItem, ProductSort } from "../models/product.model";

type Props = { categories: Category[]; products: ProductListItem[]; meta: PaginationMeta; search: string; selectedCategoryIds: number[]; sort: ProductSort; isFeatured?: boolean };

export function ProductCatalog({ categories, products, meta, search, selectedCategoryIds, sort, isFeatured }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const navigate = (values: { search?: string; categoryIds?: number[]; sort?: ProductSort; isFeatured?: boolean | null; page?: number }) => {
    const query = new URLSearchParams();
    const nextSearch = values.search ?? search;
    const nextCategories = values.categoryIds ?? selectedCategoryIds;
    const nextSort = values.sort ?? sort;
    const nextFeatured = values.isFeatured === null ? undefined : values.isFeatured ?? isFeatured;
    if (nextSearch) query.set("search", nextSearch);
    nextCategories.forEach((id) => query.append("category_ids[]", String(id)));
    if (nextSort) query.set("sort", nextSort);
    if (typeof nextFeatured === "boolean") query.set("is_featured", String(nextFeatured));
    if ((values.page ?? 1) > 1) query.set("page", String(values.page));
    startTransition(() => router.push(`/san-pham?${query}`));
  };
  const toggleCategory = (id: number) => navigate({ categoryIds: selectedCategoryIds.includes(id) ? selectedCategoryIds.filter((item) => item !== id) : [...selectedCategoryIds, id], page: 1 });

  return <div className={`min-h-screen bg-white transition-opacity ${isPending ? "opacity-60" : ""}`}><main className="mx-auto grid max-w-[1254px] gap-6 px-4 pb-12 pt-7 lg:grid-cols-[220px_1fr] lg:px-0">
    <aside className="h-fit rounded-2xl border border-[#8ecbfa] bg-white p-5 shadow-sm lg:sticky lg:top-24"><h2 className="text-sm font-bold text-[#355b76]">Danh mục</h2><button onClick={() => navigate({ categoryIds: [], page: 1 })} className={`mt-4 block w-full rounded-xl px-3 py-2.5 text-left text-sm ${!selectedCategoryIds.length ? "bg-[#90cdf5] font-medium text-[#31546e]" : "text-slate-500 hover:bg-sky-50"}`}>Tất cả</button><div className="mt-1 space-y-1">{categories.map((category) => <label key={category.id} className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${selectedCategoryIds.includes(category.id) ? "bg-[#90cdf5] font-medium text-[#31546e]" : "text-slate-500 hover:bg-sky-50"}`}><input type="checkbox" checked={selectedCategoryIds.includes(category.id)} onChange={() => toggleCategory(category.id)} className="accent-[#0875bd]"/>{category.category_name}</label>)}</div></aside>
    <section><div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-slate-500">Tìm thấy <strong className="text-[#244f6e]">{meta.total}</strong> sản phẩm</p>{search && <p className="mt-1 text-xs text-slate-400">Từ khóa: <strong className="text-brand">“{search}”</strong> <button type="button" onClick={() => navigate({ search: "", page: 1 })} className="ml-1 font-bold text-slate-500 hover:text-brand">Xóa</button></p>}</div><div className="flex flex-col gap-2 sm:flex-row"><label className="flex items-center gap-2 text-sm text-slate-500"><span className="shrink-0">Hiển thị:</span><select value={typeof isFeatured === "boolean" ? String(isFeatured) : ""} onChange={(event) => navigate({ isFeatured: event.target.value === "" ? null : event.target.value === "true", page: 1 })} className="h-11 rounded-full border border-sky-200 bg-white px-4 text-sm text-ink outline-none focus:border-brand"><option value="">Tất cả sản phẩm</option><option value="true">Sản phẩm nổi bật</option><option value="false">Không nổi bật</option></select></label><label className="flex items-center gap-2 text-sm text-slate-500"><span className="shrink-0">Sắp xếp:</span><select value={sort} onChange={(event) => navigate({ sort: event.target.value as ProductSort, page: 1 })} className="h-11 rounded-full border border-sky-200 bg-white px-4 text-sm text-ink outline-none focus:border-brand"><option value="latest">Mới nhất</option><option value="price_asc">Giá thấp đến cao</option><option value="price_desc">Giá cao đến thấp</option><option value="name_asc">Tên A – Z</option><option value="name_desc">Tên Z – A</option></select></label></div></div>
      {products.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{products.map((product) => { const imageUrl = getProductImageUrl(product.first_image); return <article key={product.id} className="group overflow-hidden rounded-2xl border border-[#8ecbfa] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><Link href={getProductHref(product)} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">{imageUrl ? <img src={imageUrl} alt={product.product_name} className="size-full object-cover transition duration-500 group-hover:scale-105"/> : <span className="grid size-full place-items-center text-sm text-slate-400">Chưa có hình ảnh</span>}{product.is_featured && <span className="absolute left-3 top-3 rounded-full bg-[#173f5b] px-3 py-1 text-[11px] font-bold text-white">Nổi bật</span>}</Link><div className="p-4"><span className="inline-block rounded-full bg-[#99d6fb] px-2.5 py-1 text-[11px] font-medium text-[#285b78]">{product.category_names || "Chưa phân loại"}</span><Link href={getProductHref(product)}><h2 className="mt-2 line-clamp-1 text-[15px] font-semibold text-[#174565] transition group-hover:text-brand">{product.product_name}</h2></Link><p className="mt-1 text-[11px] text-slate-400">SKU: {product.sku || "—"}</p><p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{product.description || "Chưa có mô tả sản phẩm."}</p><div className="mt-3 flex items-center justify-between gap-3"><strong className="text-sm text-[#123f60]">{formatProductPrice(product)}</strong><Link href={getProductHref(product)} className="shrink-0 rounded-full bg-[#79afd3] px-3.5 py-2 text-[11px] font-bold text-white">Chi tiết →</Link></div></div></article>; })}</div> : <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-sky-200 bg-white text-sm text-slate-400">Không tìm thấy sản phẩm phù hợp.</div>}
      {meta.last_page > 1 && <nav aria-label="Phân trang" className="mt-8 flex flex-wrap items-center justify-center gap-2"><button disabled={meta.current_page <= 1} onClick={() => navigate({ page: meta.current_page - 1 })} className="rounded-full border border-sky-200 bg-white px-4 py-2 text-sm disabled:opacity-40">Trước</button>{Array.from({ length: meta.last_page }, (_, index) => index + 1).map((page) => <button key={page} onClick={() => navigate({ page })} className={`size-10 rounded-full text-sm font-semibold ${page === meta.current_page ? "bg-brand text-white" : "border border-sky-200 bg-white text-[#31546e]"}`}>{page}</button>)}<button disabled={meta.current_page >= meta.last_page} onClick={() => navigate({ page: meta.current_page + 1 })} className="rounded-full border border-sky-200 bg-white px-4 py-2 text-sm disabled:opacity-40">Sau</button></nav>}
    </section>
  </main></div>;
}
