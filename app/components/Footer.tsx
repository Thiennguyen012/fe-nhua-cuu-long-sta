"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { useCategories, usePageConfig } from "./PageConfigProvider";
import { navData } from "../data/navigation";
import { stripHtml } from "../services/page-content.service";
import { getPageConfigAssetUrl } from "../services/page-config.service";

const fallbackAddresses = ["KCN Tân Tạo, Q. Bình Tân, TP. Hồ Chí Minh"];

export function Footer() {
  const config = usePageConfig();
  const categories = useCategories();
  const oldestCategories = [...categories]
    .sort((first, second) => first.created_at.localeCompare(second.created_at))
    .slice(0, 3);

  const rawCompanyName = config?.company_name;
  const companyName = rawCompanyName ? stripHtml(rawCompanyName) : "Nhựa Cửu Long STA";

  const addresses = config?.addresses?.length ? config.addresses : fallbackAddresses;
  const hotline = config?.hotline || "0901 234 567";
  const email = config?.email || "info@nhuacuulongsta.vn";
  const phoneHref = hotline.replace(/[^\d+]/g, "");

  const rawDescription = config?.description?.trim();
  const description = rawDescription
    ? stripHtml(rawDescription)
    : "Cung cấp giải pháp nhựa công nghiệp bền vững, đồng hành cùng sự phát triển của doanh nghiệp Việt.";

  const rawSlogan = config?.slogan?.trim();
  const slogan = rawSlogan
    ? stripHtml(rawSlogan)
    : "Chất lượng tạo niềm tin · Bền vững tạo tương lai";

  const rawWorkingHour = config?.working_hour?.trim();
  const workingHour = rawWorkingHour
    ? stripHtml(rawWorkingHour)
    : "Thứ 2 - Thứ 7: 8:00 - 17:00";

  const facebookUrl = config?.socials?.facebook || null;
  const tiktokUrl = config?.socials?.tiktok || null;
  const youtubeUrl = config?.socials?.youtube || null;
  const zaloUrl = config?.socials?.zalo || null;
  const hasSocials = Boolean(facebookUrl || tiktokUrl || youtubeUrl || zaloUrl);

  return (
    <footer id="lien-he" className="bg-[#071d2e] text-white">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_.8fr_1.1fr] lg:px-8 lg:py-20">
        <div>
          <BrandLogo light />
          <p className="mt-6 max-w-sm whitespace-pre-line text-sm leading-7 text-white/55">
            {description}
          </p>

          {/* Social Network Icon Buttons */}
          {hasSocials && (
            <div className="mt-5 flex items-center gap-3">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                  aria-label="Facebook"
                  className="grid size-9 place-items-center rounded-full bg-[#1877F2] text-white transition hover:opacity-90 shadow-md"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="TikTok"
                  aria-label="TikTok"
                  className="grid size-9 place-items-center rounded-full bg-slate-900 text-white transition hover:opacity-90 border border-white/20 shadow-md"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.2a6.34 6.34 0 0 0-5.46 6.26 6.34 6.34 0 1 0 11.8-3.41V8.69a8.27 8.27 0 0 0 3.77.91V6.15a4.8 4.8 0 0 1-.0.54z" />
                  </svg>
                </a>
              )}
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="YouTube"
                  aria-label="YouTube"
                  className="grid size-9 place-items-center rounded-full bg-[#FF0000] text-white transition hover:opacity-90 shadow-md"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              {zaloUrl && (
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Zalo"
                  aria-label="Zalo"
                  className="grid size-9 place-items-center rounded-full bg-[#0068FF] text-white transition hover:opacity-90 shadow-md"
                >
                  <span className="text-[10px] font-bold">Zalo</span>
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-bold">Liên kết</h3>
          <div className="mt-5 space-y-3 text-sm text-white/55">
            {navData.map(([label, href]) => (
              <Link key={href} className="block hover:text-white" href={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold">Sản phẩm</h3>
          <div className="mt-5 space-y-3 text-sm text-white/55">
            {oldestCategories.length ? (
              oldestCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/san-pham?category_ids%5B%5D=${category.id}`}
                  className="block transition hover:text-white"
                >
                  {category.category_name}
                </Link>
              ))
            ) : (
              <p>Đang cập nhật</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-bold">Thông tin liên hệ</h3>
          <div className="mt-5 space-y-4 text-sm leading-6 text-white/55">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-white/80">
                Địa chỉ:
              </span>
              {addresses.map((address, index) => (
                <p key={`${address}-${index}`} className="mt-0.5">
                  {stripHtml(address)}
                </p>
              ))}
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-white/80">
                Hotline:
              </span>
              <p className="mt-0.5">
                <a className="transition hover:text-white" href={`tel:${phoneHref}`}>
                  {hotline}
                </a>
              </p>
            </div>
            {email && (
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-white/80">
                  Email:
                </span>
                <p className="mt-0.5">
                  <a className="break-all transition hover:text-white" href={`mailto:${email}`}>
                    {email}
                  </a>
                </p>
              </div>
            )}
            {workingHour && (
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-white/80">
                  Giờ làm việc:
                </span>
                <p className="mt-0.5">{workingHour}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-6 text-xs text-white/40 sm:flex-row sm:justify-between lg:px-8">
          <p>© 2026 {stripHtml(config?.company_name) || "Nhựa Cửu Long STA"}. All rights reserved.</p>
          <p>{slogan}</p>
        </div>
      </div>
    </footer>
  );
}
