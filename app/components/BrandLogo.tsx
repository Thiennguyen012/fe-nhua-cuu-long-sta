"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePageConfig } from "./PageConfigProvider";
import { stripHtml } from "../services/page-content.service";

const getAssetUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
  return `${apiUrl.replace(/\/api\/?$/, "")}/storage/${path.replace(/^\//, "")}`;
};

export function BrandLogo({ light = false, logoOnly = true }: { light?: boolean; logoOnly?: boolean }) {
  const config = usePageConfig();
  const rawCompanyName = config?.company_name;
  const companyName = rawCompanyName ? stripHtml(rawCompanyName) : "Nhựa Cửu Long STA";
  const rawSlogan = config?.slogan;
  const slogan = rawSlogan ? stripHtml(rawSlogan) : "Bền vững cùng tương lai";
  const logoUrl = config?.logo_path ? getAssetUrl(config.logo_path) : null;

  return (
    <Link href="/" aria-label={`${companyName} - Trang chủ`} className="group flex min-w-0 items-center gap-3">
      <span
        className={`grid shrink-0 place-items-center overflow-hidden ${
          logoOnly && logoUrl ? "h-14 w-32 sm:w-44" : "size-14"
        } ${logoUrl ? "bg-transparent" : "rounded-[14px] bg-brand shadow-[0_8px_22px_rgba(8,117,189,.25)]"}`}
      >
        {logoUrl ? (
          <img src={logoUrl} alt={`Logo ${companyName}`} className="size-full object-contain" />
        ) : (
          <span className="text-xl font-extrabold tracking-[-.08em] text-white">CL</span>
        )}
      </span>
      {!logoOnly && (
        <span className="min-w-0">
          <strong className={`block text-[17px] font-extrabold uppercase leading-6 tracking-[.06em] ${light ? "text-white" : "text-slate-900"}`}>
            {companyName}
          </strong>
          <span className={`mt-0.5 block text-[9px] font-semibold uppercase leading-4 tracking-[.22em] ${light ? "text-sky-300" : "text-brand"}`}>
            {slogan}
          </span>
        </span>
      )}
    </Link>
  );
}
