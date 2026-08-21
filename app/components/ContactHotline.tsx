"use client";

import { usePageConfig } from "./PageConfigProvider";

export function ContactHotline() {
  const config = usePageConfig();
  const hotline = config?.hotline?.trim() || "0901 234 567";
  const hotlineHref = hotline.replace(/[^\d+]/g, "");

  return <div className="rounded-3xl bg-[#071d2e] p-8 text-white sm:p-10">
    <p className="text-xs font-bold uppercase tracking-[.2em] text-sky-300">Hỗ trợ nhanh</p>
    <h2 className="mt-4 text-2xl font-extrabold">Cần tư vấn ngay?</h2>
    <p className="mt-4 text-sm leading-7 text-white/60">Gọi trực tiếp hotline để được kết nối với chuyên viên sản phẩm.</p>
    <a href={`tel:${hotlineHref}`} className="mt-7 inline-flex rounded-full bg-brand px-6 py-3.5 text-sm font-bold">{hotline}</a>
  </div>;
}
