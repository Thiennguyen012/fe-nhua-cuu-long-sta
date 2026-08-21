"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { formatProductPrice, getProductHref, getProductImageUrl } from "../lib/product";
import type { ProductListItem, ProductListResponse } from "../models/product.model";

export function ProductSearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [resolvedQuery, setResolvedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyword = query.trim();
    const params = new URLSearchParams();
    if (keyword) params.set("search", keyword);
    router.push(`/san-pham${params.size ? `?${params.toString()}` : ""}`);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => inputRef.current?.focus(), 50);
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleEscape); };
  }, [open, onClose]);

  useEffect(() => {
    const keyword = query.trim();
    if (!open || !keyword) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setSearchFailed(false);
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api").replace(/\/$/, "");
        const params = new URLSearchParams({ search: keyword, per_page: "6", page: "1" });
        const response = await fetch(`${apiUrl}/products?${params.toString()}`, { headers: { Accept: "application/json", lang: "vi" }, signal: controller.signal });
        if (!response.ok) throw new Error(`Search failed (${response.status})`);
        const payload = (await response.json()) as Partial<ProductListResponse>;
        setResults(Array.isArray(payload.data) ? payload.data : []);
        setResolvedQuery(keyword);
      } catch (error) {
        if ((error as Error).name !== "AbortError") { setResults([]); setSearchFailed(true); setResolvedQuery(keyword); }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [open, query]);

  if (!open) return null;
  const keyword = query.trim();
  const resultsAreCurrent = resolvedQuery === keyword;
  const visibleResults = resultsAreCurrent ? results : [];
  const isSearching = Boolean(keyword) && (!resultsAreCurrent || loading);
  const visibleSearchFailed = resultsAreCurrent && searchFailed;

  return <div className="fixed inset-x-0 bottom-0 top-[84px] z-[100] bg-slate-950/35 backdrop-blur-md" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }} role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="search-title" className="search-dropdown max-h-[calc(100vh-84px)] w-full overflow-y-auto rounded-b-3xl bg-white shadow-[0_24px_60px_rgba(15,23,42,.22)]"><div className="mx-auto max-w-[1240px] px-5 py-6 sm:px-8 sm:py-8"><div className="flex items-center justify-between gap-4"><div><h2 id="search-title" className="text-lg font-extrabold text-ink">Tìm kiếm sản phẩm</h2><p className="mt-1 text-xs text-slate-500">Tìm theo tên, mã SKU hoặc mô tả sản phẩm</p></div><button type="button" onClick={onClose} aria-label="Đóng tìm kiếm" className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 text-2xl text-slate-600 transition hover:bg-slate-200">×</button></div><form onSubmit={submitSearch} className="mt-5 flex flex-col gap-3 sm:flex-row"><label className="relative block min-w-0 flex-1"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-brand">⌕</span><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ví dụ: túi nhựa, ống PVC..." className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-sky-100"/>{query && <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label="Xóa nội dung tìm kiếm" className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-xl text-slate-400 transition hover:bg-slate-200 hover:text-slate-700">×</button>}</label><button type="submit" className="h-12 rounded-2xl bg-brand px-7 text-sm font-bold text-white transition hover:bg-brand-dark">Tìm kiếm</button></form>
      {keyword ? <div className="mt-5 border-t border-slate-100 pt-5"><div className="mb-4 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">{isSearching ? "Đang tìm kiếm..." : `${visibleResults.length} sản phẩm phù hợp`}</p><Link href={`/san-pham?search=${encodeURIComponent(keyword)}`} onClick={onClose} className="text-xs font-bold text-brand hover:text-brand-dark">Xem tất cả →</Link></div>{isSearching ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="flex animate-pulse gap-3 rounded-2xl border border-slate-100 p-3"><div className="size-20 shrink-0 rounded-xl bg-slate-100"/><div className="flex-1 py-1"><div className="h-3 w-20 rounded bg-slate-100"/><div className="mt-3 h-4 w-full rounded bg-slate-100"/><div className="mt-3 h-3 w-24 rounded bg-slate-100"/></div></div>)}</div> : visibleSearchFailed ? <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-6 text-center text-sm text-red-500">Không thể tải kết quả. Vui lòng thử lại.</div> : visibleResults.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visibleResults.map((product) => { const imageUrl = getProductImageUrl(product.first_image); return <Link key={product.id} href={getProductHref(product)} onClick={onClose} className="group flex min-w-0 gap-3 rounded-2xl border border-slate-100 p-3 transition hover:border-sky-200 hover:bg-sky-50"><div className="size-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">{imageUrl ? <img src={imageUrl} alt={product.product_name} className="size-full object-cover"/> : <span className="grid size-full place-items-center text-[10px] text-slate-400">Chưa có ảnh</span>}</div><div className="min-w-0 py-1"><p className="text-[10px] font-bold uppercase tracking-wide text-brand">{product.category_names || "Sản phẩm"}</p><h3 className="mt-1 line-clamp-1 text-sm font-bold text-ink transition group-hover:text-brand">{product.product_name}</h3><p className="mt-1 text-[10px] text-slate-400">SKU: {product.sku || "—"}</p><strong className="mt-2 block text-xs text-brand">{formatProductPrice(product)}</strong></div></Link>; })}</div> : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center"><p className="text-sm font-semibold text-slate-600">Không tìm thấy sản phẩm</p><p className="mt-1 text-xs text-slate-400">Thử một từ khóa khác hoặc xem toàn bộ danh mục.</p></div>}</div> : <div className="mt-4 flex items-center justify-between gap-4"><p className="text-xs text-slate-400">Nhập từ khóa để xem gợi ý sản phẩm.</p><Link href="/san-pham" onClick={onClose} className="shrink-0 text-xs font-bold text-brand hover:text-brand-dark">Xem tất cả →</Link></div>}
    </div></section></div>;
}
