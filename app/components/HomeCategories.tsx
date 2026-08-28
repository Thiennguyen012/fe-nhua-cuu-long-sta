"use client";

import Link from "next/link";
import Image from "next/image";
import { useCategories } from "./PageConfigProvider";
import { stripHtml } from "../services/page-content.service";
import { getPageConfigAssetUrl } from "../services/page-config.service";
import { shouldBypassImageOptimization } from "../lib/image";

function CategoryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-9 fill-none stroke-current"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </svg>
  );
}

export function HomeCategories() {
  const categories = useCategories();
  const displayedCategories = categories.slice(0, 6);
  const hasMore = categories.length > 6;

  if (!categories.length) {
    return (
      <div className="mt-12 rounded-3xl border border-dashed border-sky-200 bg-sky-50/40 px-6 py-14 text-center text-sm text-slate-400">
        Danh mục sản phẩm đang được cập nhật.
      </div>
    );
  }

  return (
    <>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedCategories.map((category) => {
          const cleanDesc = category.description ? stripHtml(category.description) : "";
          const thumbUrl =
            category.thumbnail_url ||
            (category.thumbnail_path ? getPageConfigAssetUrl(category.thumbnail_path) : null);

          return (
            <Link
              key={category.id}
              href={`/san-pham?danh-muc=${category.slug || category.id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_20px_45px_rgba(13,58,92,.12)]"
            >
              <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white text-brand">
                {thumbUrl ? (
                  <Image
                    src={thumbUrl}
                    alt={category.category_name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={shouldBypassImageOptimization(thumbUrl)}
                    className="object-contain p-2 transition duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <>
                    <div className="absolute -right-12 -top-16 size-48 rounded-full border-[28px] border-white/35" />
                    <div className="absolute -bottom-20 -left-12 size-52 rounded-full border-[32px] border-white/30" />
                    <span className="relative grid size-20 place-items-center rounded-2xl bg-white/85 shadow-[0_14px_30px_rgba(8,117,189,.13)] backdrop-blur transition duration-300 group-hover:scale-105">
                      <CategoryIcon />
                    </span>
                  </>
                )}
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-bold text-ink transition group-hover:text-brand">
                  {stripHtml(category.category_name)}
                </h3>
                <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
                  {cleanDesc || "Khám phá các sản phẩm thuộc danh mục này."}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand">
                  Xem sản phẩm <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <Link
            href="/san-pham"
            className="group inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-8 py-3.5 text-sm font-bold text-brand shadow-sm transition duration-300 hover:border-brand hover:bg-brand hover:text-white hover:shadow-lg"
          >
            <span>Xem tất cả danh mục ({categories.length})</span>
            <span className="text-base transition-transform group-hover:translate-x-1.5">→</span>
          </Link>
        </div>
      )}
    </>
  );
}
