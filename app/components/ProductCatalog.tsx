"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { catalogProducts } from "../data/products";

const categories = ["Tất cả", "Túi nhựa", "Ống nhựa", "Tấm nhựa", "Thùng nhựa", "Bao bì", "Màng nhựa"];
type SortOption = "featured" | "name" | "price-asc" | "price-desc";
const badgePriority: Record<string, number> = { "Bán chạy": 0, "Hot": 1, "Mới": 2, "Phổ biến": 3 };
const getNumericPrice = (price: string) => price === "Liên hệ" ? null : Number(price.replace(/\D/g, ""));

export function ProductCatalog() {
  const [active, setActive] = useState("Tất cả");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const visibleProducts = useMemo(() => {
    const filtered = catalogProducts.filter((product) => active === "Tất cả" || product.category === active);
    return [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name, "vi");
      if (sortBy === "featured") return (badgePriority[a.badge ?? ""] ?? 4) - (badgePriority[b.badge ?? ""] ?? 4);
      const priceA = getNumericPrice(a.price);
      const priceB = getNumericPrice(b.price);
      if (priceA === null) return 1;
      if (priceB === null) return -1;
      return sortBy === "price-asc" ? priceA - priceB : priceB - priceA;
    });
  }, [active, sortBy]);

  return <div className="min-h-screen bg-[#f5f9fc]">
    <main className="mx-auto grid max-w-[1254px] gap-6 px-4 pb-6 pt-10 lg:grid-cols-[208px_1fr] lg:px-0">
      <aside className="h-fit rounded-2xl border border-[#8ecbfa] bg-white p-5 shadow-sm lg:sticky lg:top-24"><h2 className="text-sm font-bold text-[#355b76]">Danh mục</h2><div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible">{categories.map((category) => <button key={category} onClick={() => setActive(category)} className={`block shrink-0 rounded-xl px-3 py-2.5 text-left text-sm transition lg:w-full ${active === category ? "bg-[#90cdf5] font-medium text-[#31546e]" : "text-slate-500 hover:bg-sky-50"}`}>{category}</button>)}</div></aside>
      <section><div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500">Hiển thị <strong className="text-[#244f6e]">{visibleProducts.length}</strong> sản phẩm</p><label className="flex w-full items-center gap-3 sm:w-auto"><span className="shrink-0 text-sm font-medium text-slate-500">Sắp xếp:</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className="h-10 min-w-56 rounded-full border border-sky-200 bg-white px-4 text-sm text-[#244f6e] outline-none transition focus:border-brand"><option value="featured">Nổi bật</option><option value="name">Tên sản phẩm A – Z</option><option value="price-asc">Giá từ thấp đến cao</option><option value="price-desc">Giá từ cao đến thấp</option></select></label></div>{visibleProducts.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{visibleProducts.map((product) => <article key={product.id} className="group relative overflow-hidden rounded-2xl border border-[#8ecbfa] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="relative aspect-[4/3] overflow-hidden bg-slate-100"><Image fill sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 25vw" src={product.image} alt={product.name} className="object-cover transition duration-500 group-hover:scale-105"/>{product.badge && <span className="absolute left-3 top-3 rounded-full bg-[#173f5b] px-3 py-1 text-[11px] font-bold text-white">{product.badge}</span>}</div><div className="p-4"><span className="inline-block rounded-full bg-[#99d6fb] px-2.5 py-1 text-[11px] font-medium text-[#285b78]">{product.category}</span><h2 className="mt-2 line-clamp-1 text-[15px] font-semibold text-[#174565]">{product.name}</h2><p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{product.description}</p><div className="mt-3 flex items-center justify-between gap-3"><strong className="text-sm text-[#123f60]">{product.price}</strong><a href="tel:18001234" className="shrink-0 rounded-full bg-[#79afd3] px-3.5 py-2 text-[11px] font-bold text-white">☎&nbsp; Liên hệ</a></div></div></article>)}</div> : <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-sky-200 bg-white text-sm text-slate-400">Không tìm thấy sản phẩm phù hợp.</div>}</section>
    </main>
  </div>;
}
