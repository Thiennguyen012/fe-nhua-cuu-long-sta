"use client";

/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { ProductSearchModal } from "./ProductSearchModal";
import { navData } from "../data/navigation";
import { usePageConfig, useCategories } from "./PageConfigProvider";
import { stripHtml } from "../services/page-content.service";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function ChevronDownIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`fill-none stroke-current ${className}`}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="m6 8 4 4 4-4" />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(true);

  const pathname = usePathname();
  const config = usePageConfig();
  const categories = useCategories();

  const hotline = config?.hotline?.trim() || "0901 234 567";
  const hotlineHref = hotline.replace(/[^\d+]/g, "");

  const isActive = (label: string) => {
    if (label === "Giới thiệu") return pathname === "/gioi-thieu";
    if (label === "Sản phẩm") return pathname.startsWith("/san-pham");
    if (label === "Liên hệ") return pathname === "/lien-he";
    if (label === "Trang chủ") return pathname === "/";
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[84px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <BrandLogo />

          {/* Desktop Navigation */}
          <nav aria-label="Điều hướng chính" className="hidden items-center gap-8 lg:flex">
            {navData.map(([label, href]) => {
              if (label === "Sản phẩm") {
                return (
                  <div
                    key={label}
                    className="relative py-7"
                    onMouseEnter={() => setProductDropdownOpen(true)}
                    onMouseLeave={() => setProductDropdownOpen(false)}
                  >
                    <Link
                      href={href}
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold transition hover:text-brand ${
                        isActive(label) ? "text-brand" : "text-slate-600"
                      }`}
                    >
                      <span>{label}</span>
                      <ChevronDownIcon
                        className={`size-4 transition-transform duration-200 ${
                          productDropdownOpen ? "rotate-180 text-brand" : "text-slate-400"
                        }`}
                      />
                    </Link>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute left-1/2 top-full -translate-x-1/2 w-72 rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-[0_20px_50px_rgba(13,58,92,.15)] backdrop-blur-xl transition-all duration-200 ${
                        productDropdownOpen
                          ? "visible opacity-100 translate-y-0"
                          : "invisible opacity-0 translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="space-y-1">
                        <Link
                          href="/san-pham"
                          onClick={() => setProductDropdownOpen(false)}
                          className="block rounded-xl px-3.5 py-2.5 text-xs font-bold text-ink transition hover:bg-sky-50 hover:text-brand"
                        >
                          Tất cả sản phẩm
                        </Link>

                        {categories.length > 0 && <div className="my-1 border-t border-slate-100" />}

                        {categories.map((cat) => {
                          const cleanName = stripHtml(cat.category_name);
                          return (
                            <Link
                              key={cat.id}
                              href={`/san-pham?danh-muc=${cat.slug || cat.id}`}
                              onClick={() => setProductDropdownOpen(false)}
                              className="block rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-sky-50 hover:text-brand"
                            >
                              <span className="line-clamp-1">{cleanName}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={label}
                  href={href}
                  className={`text-sm font-semibold transition hover:text-brand ${
                    isActive(label) ? "text-brand" : "text-slate-600"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Tìm kiếm sản phẩm"
              className="grid size-11 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-brand hover:bg-sky-50 hover:text-brand"
            >
              <SearchIcon />
            </button>
            <a
              href="https://zalo.me/0901234567"
              target="_blank"
              rel="noreferrer"
              aria-label="Liên hệ qua Zalo"
              title="Liên hệ qua Zalo"
              className="grid size-11 place-items-center overflow-hidden rounded-full shadow-[0_8px_20px_rgba(0,104,255,.2)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,104,255,.3)]"
            >
              <Image src="/zalo-icon.svg" alt="" width={44} height={44} className="size-11" />
            </a>
            <a
              href={`tel:${hotlineHref}`}
              className="hidden rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-ink lg:block"
            >
              {hotline}
            </a>
            <Link
              href="/lien-he"
              className="hidden rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(8,117,189,.22)] transition hover:bg-brand-dark lg:block"
            >
              Nhận tư vấn
            </Link>
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Mở menu"
              className="grid size-11 place-items-center rounded-xl border border-slate-200 lg:hidden"
            >
              <span className="text-2xl leading-none">{open ? "×" : "≡"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <nav className="border-t border-slate-100 bg-white px-5 py-4 lg:hidden">
            {navData.map(([label, href]) => {
              if (label === "Sản phẩm") {
                return (
                  <div key={label} className="border-b border-slate-100 py-2">
                    <div className="flex items-center justify-between py-1">
                      <Link
                        onClick={() => setOpen(false)}
                        href={href}
                        className={`text-sm font-semibold ${isActive(label) ? "text-brand" : "text-slate-700"}`}
                      >
                        {label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                        className="p-2 text-slate-400"
                        aria-label="Toggle submenu"
                      >
                        <ChevronDownIcon className={`size-4 transition-transform ${mobileSubmenuOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    {mobileSubmenuOpen && (
                      <div className="mt-2 space-y-1.5 pl-3">
                        <Link
                          onClick={() => setOpen(false)}
                          href="/san-pham"
                          className="block rounded-lg py-1.5 text-xs font-medium text-slate-500 hover:text-brand"
                        >
                          • Tất cả sản phẩm
                        </Link>
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            onClick={() => setOpen(false)}
                            href={`/san-pham?danh-muc=${cat.slug || cat.id}`}
                            className="block rounded-lg py-1.5 text-xs font-medium text-slate-500 hover:text-brand"
                          >
                            • {stripHtml(cat.category_name)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  onClick={() => setOpen(false)}
                  key={label}
                  href={href}
                  className={`block border-b border-slate-100 py-3 text-sm font-semibold last:border-0 ${
                    isActive(label) ? "text-brand" : "text-slate-700"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <ProductSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
