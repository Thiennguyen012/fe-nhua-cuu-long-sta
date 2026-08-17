"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

export function ProductSearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const submitSearch = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const keyword = query.trim(); const params = new URLSearchParams(); if (keyword) params.set("search", keyword); router.push(`/san-pham${params.size ? `?${params.toString()}` : ""}`); onClose(); };

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
  return <div className="fixed inset-x-0 bottom-0 top-[84px] z-[100] bg-slate-950/35 backdrop-blur-md" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }} role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="search-title" className="search-dropdown w-full rounded-b-3xl bg-white shadow-[0_24px_60px_rgba(15,23,42,.22)]"><div className="mx-auto max-w-[1240px] px-5 py-6 sm:px-8 sm:py-8"><div className="flex items-center justify-between gap-4"><div><h2 id="search-title" className="text-lg font-extrabold text-ink">Tìm kiếm sản phẩm</h2><p className="mt-1 text-xs text-slate-500">Tìm theo tên, mã SKU hoặc mô tả sản phẩm</p></div><button type="button" onClick={onClose} aria-label="Đóng tìm kiếm" className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 text-2xl text-slate-600 transition hover:bg-slate-200">×</button></div><form onSubmit={submitSearch} className="mt-5 flex flex-col gap-3 sm:flex-row"><label className="relative block min-w-0 flex-1"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-brand">⌕</span><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ví dụ: túi nhựa, ống PVC..." className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-sky-100"/>{query && <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label="Xóa nội dung tìm kiếm" className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-xl text-slate-400 transition hover:bg-slate-200 hover:text-slate-700">×</button>}</label><button type="submit" className="h-12 rounded-2xl bg-brand px-7 text-sm font-bold text-white transition hover:bg-brand-dark">Tìm kiếm</button></form><div className="mt-4 flex items-center justify-between gap-4"><p className="text-xs text-slate-400">Nhấn Enter để xem kết quả từ hệ thống sản phẩm.</p><Link href="/san-pham" onClick={onClose} className="shrink-0 text-xs font-bold text-brand hover:text-brand-dark">Xem tất cả →</Link></div></div></section></div>;
}
