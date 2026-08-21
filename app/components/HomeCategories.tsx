"use client";

import Link from "next/link";
import { useCategories } from "./PageConfigProvider";

function CategoryIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-9 fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z"/>
    <path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>
  </svg>;
}

export function HomeCategories() {
  const categories = useCategories();

  if (!categories.length) {
    return <div className="mt-12 rounded-3xl border border-dashed border-sky-200 bg-sky-50/40 px-6 py-14 text-center text-sm text-slate-400">
      Danh mục sản phẩm đang được cập nhật.
    </div>;
  }

  return <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {categories.map((category, index) => <Link
      key={category.id}
      href={`/san-pham?category_ids%5B%5D=${category.id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_20px_45px_rgba(13,58,92,.12)]"
    >
      <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#eaf6fd_0%,#d7edf9_52%,#c8e4f4_100%)] text-brand">
        <div className="absolute -right-12 -top-16 size-48 rounded-full border-[28px] border-white/35"/>
        <div className="absolute -bottom-20 -left-12 size-52 rounded-full border-[32px] border-white/30"/>
        <span className="relative grid size-20 place-items-center rounded-2xl bg-white/85 shadow-[0_14px_30px_rgba(8,117,189,.13)] backdrop-blur transition duration-300 group-hover:scale-105"><CategoryIcon/></span>
        <span className="absolute left-5 top-5 text-[11px] font-bold uppercase tracking-[.18em] text-brand/65">Danh mục {String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-bold text-ink transition group-hover:text-brand">{category.category_name}</h3>
        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">{category.description || "Khám phá các sản phẩm thuộc danh mục này."}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand">Xem sản phẩm <span className="transition-transform group-hover:translate-x-1">→</span></span>
      </div>
    </Link>)}
  </div>;
}
