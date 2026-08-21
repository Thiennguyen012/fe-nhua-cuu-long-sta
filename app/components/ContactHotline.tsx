"use client";

import { usePageConfig } from "./PageConfigProvider";
import type { PageSection } from "../models/page-content.model";
import { stripHtml } from "../services/page-content.service";

interface ContactHotlineProps {
  section?: PageSection;
}

export function ContactHotline({ section }: ContactHotlineProps) {
  const config = usePageConfig();
  const hotline = config?.hotline?.trim() || "0901 234 567";
  const hotlineHref = hotline.replace(/[^\d+]/g, "");

  const subtitle = section?.subtitle || "Hỗ trợ nhanh";
  const title = section?.title || "Cần tư vấn ngay?";
  const content =
    stripHtml(section?.content) ||
    "Gọi trực tiếp hotline để được kết nối với chuyên viên sản phẩm.";

  return (
    <div className="rounded-3xl bg-[#071d2e] p-8 text-white sm:p-10 flex flex-col justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-sky-300">{subtitle}</p>
        <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">{title}</h2>
        <p className="mt-4 text-sm leading-7 text-white/60">{content}</p>
      </div>
      <div>
        <a
          href={`tel:${hotlineHref}`}
          className="mt-7 inline-flex rounded-full bg-brand px-6 py-3.5 text-sm font-bold shadow-md transition hover:bg-sky-500"
        >
          {hotline}
        </a>
      </div>
    </div>
  );
}
