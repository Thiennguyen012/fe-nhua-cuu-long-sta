"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { catalogProducts } from "../data/products";

export function ProductSearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => { const normalized = query.trim().toLocaleLowerCase("vi"); return normalized ? catalogProducts.filter((product) => `${product.name} ${product.category}`.toLocaleLowerCase("vi").includes(normalized)).slice(0, 6) : catalogProducts.slice(0, 4); }, [query]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => inputRef.current?.focus(), 50);
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleEscape); };
  }, [open, onClose]);

  if (!open) return null;
  return <div className="fixed inset-x-0 bottom-0 top-[84px] z-[100] bg-slate-950/35 backdrop-blur-md" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }} role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="search-title" className="search-dropdown max-h-[calc(100vh-84px)] w-full overflow-y-auto rounded-b-3xl bg-white shadow-[0_24px_60px_rgba(15,23,42,.22)]"><div className="sticky top-0 z-10 mx-auto max-w-[1240px] border-b border-slate-100 bg-white px-5 py-5 sm:px-8"><div className="flex items-center justify-between gap-4"><div><h2 id="search-title" className="text-lg font-extrabold text-ink">Tìm kiếm sản phẩm</h2><p className="mt-1 text-xs text-slate-500">Nhập tên hoặc danh mục sản phẩm bạn cần</p></div><button type="button" onClick={onClose} aria-label="Đóng tìm kiếm" className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 text-2xl text-slate-600 transition hover:bg-slate-200">×</button></div><label className="relative mt-5 block"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-brand">⌕</span><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ví dụ: túi nhựa, ống PVC..." className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-sky-100"/>{query && <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label="Xóa nội dung tìm kiếm" className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-xl text-slate-400 transition hover:bg-slate-200 hover:text-slate-700">×</button>}</label></div><div className="mx-auto max-w-[1240px] p-5 sm:p-8"><p className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-slate-400">{query.trim() ? `${results.length} kết quả phù hợp` : "Sản phẩm nổi bật"}</p>{results.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{results.map((product) => <Link key={product.id} href="/san-pham" onClick={onClose} className="group flex gap-3 rounded-2xl border border-slate-100 p-3 transition hover:border-sky-200 hover:bg-sky-50"><div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-slate-100"><Image fill sizes="80px" src={product.image} alt={product.name} className="object-cover"/></div><div className="min-w-0 py-1"><span className="text-[10px] font-bold uppercase tracking-wide text-brand">{product.category}</span><h3 className="mt-1 line-clamp-1 text-sm font-bold text-ink group-hover:text-brand">{product.name}</h3><strong className="mt-2 block text-xs text-[#123f60]">{product.price}</strong></div></Link>)}</div> : <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center"><div><p className="font-semibold text-slate-600">Không tìm thấy sản phẩm</p><p className="mt-1 text-xs text-slate-400">Thử một từ khóa khác nhé.</p></div></div>}<Link href="/san-pham" onClick={onClose} className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark">Xem tất cả sản phẩm <span>→</span></Link></div></section></div>;
}
