"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { ProductSearchModal } from "./ProductSearchModal";
import { navData } from "../data/navigation";
import { usePageConfig } from "./PageConfigProvider";

const links = navData;

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const config = usePageConfig();
  const hotline = config?.hotline?.trim() || "0901 234 567";
  const hotlineHref = hotline.replace(/[^\d+]/g, "");
  const isActive = (label: string) => label === "Giới thiệu" ? pathname === "/gioi-thieu" : label === "Sản phẩm" ? pathname === "/san-pham" : label === "Liên hệ" ? pathname === "/lien-he" : label === "Trang chủ" ? pathname === "/" : false;

  return <><header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl"><div className="mx-auto flex h-[84px] max-w-[1240px] items-center justify-between px-5 lg:px-8"><BrandLogo/><nav aria-label="Điều hướng chính" className="hidden items-center gap-8 lg:flex">{links.map(([label, href]) => <Link key={label} href={href} className={`text-sm font-semibold transition hover:text-brand ${isActive(label) ? "text-brand" : "text-slate-600"}`}>{label}</Link>)}</nav><div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-3"><button type="button" onClick={() => setSearchOpen(true)} aria-label="Tìm kiếm sản phẩm" className="grid size-11 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-brand hover:bg-sky-50 hover:text-brand"><SearchIcon/></button><a href="https://zalo.me/0901234567" target="_blank" rel="noreferrer" aria-label="Liên hệ qua Zalo" title="Liên hệ qua Zalo" className="grid size-11 place-items-center overflow-hidden rounded-full shadow-[0_8px_20px_rgba(0,104,255,.2)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,104,255,.3)]"><Image src="/zalo-icon.svg" alt="" width={44} height={44} className="size-11"/></a><a href={`tel:${hotlineHref}`} className="hidden rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-ink lg:block">{hotline}</a><Link href="/lien-he" className="hidden rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(8,117,189,.22)] transition hover:bg-brand-dark lg:block">Nhận tư vấn</Link><button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Mở menu" className="grid size-11 place-items-center rounded-xl border border-slate-200 lg:hidden"><span className="text-2xl leading-none">{open ? "×" : "≡"}</span></button></div></div>{open && <nav className="border-t border-slate-100 bg-white px-5 py-4 lg:hidden">{links.map(([label, href]) => <Link onClick={() => setOpen(false)} key={label} href={href} className={`block border-b border-slate-100 py-3 text-sm font-semibold last:border-0 ${isActive(label) ? "text-brand" : "text-slate-700"}`}>{label}</Link>)}</nav>}</header><ProductSearchModal open={searchOpen} onClose={() => setSearchOpen(false)}/></>;
}
