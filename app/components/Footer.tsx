"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { useCategories, usePageConfig } from "./PageConfigProvider";
import { navData } from "../data/navigation";

const fallbackAddresses = ["KCN Tân Tạo, Q. Bình Tân, TP. Hồ Chí Minh"];

export function Footer() {
  const config = usePageConfig();
  const categories = useCategories();
  const oldestCategories = [...categories]
    .sort((first, second) => first.created_at.localeCompare(second.created_at))
    .slice(0, 3);
  const addresses = config?.addresses?.length ? config.addresses : fallbackAddresses;
  const hotline = config?.hotline || "0901 234 567";
  const email = config?.email || "info@nhuacuulongsta.vn";
  const phoneHref = hotline.replace(/[^\d+]/g, "");
  const description = config?.description?.trim() || "Cung cấp giải pháp nhựa công nghiệp bền vững, đồng hành cùng sự phát triển của doanh nghiệp Việt.";

  return <footer id="lien-he" className="bg-[#071d2e] text-white">
    <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_.8fr_1.1fr] lg:px-8 lg:py-20">
      <div><BrandLogo light/><p className="mt-6 max-w-sm whitespace-pre-line text-sm leading-7 text-white/55">{description}</p></div>
      <div><h3 className="font-bold">Liên kết</h3><div className="mt-5 space-y-3 text-sm text-white/55">{navData.map(([label, href]) => <Link key={href} className="block hover:text-white" href={href}>{label}</Link>)}</div></div>
      <div><h3 className="font-bold">Sản phẩm</h3><div className="mt-5 space-y-3 text-sm text-white/55">{oldestCategories.length ? oldestCategories.map((category) => <Link key={category.id} href={`/san-pham?category_ids%5B%5D=${category.id}`} className="block transition hover:text-white">{category.category_name}</Link>) : <p>Đang cập nhật</p>}</div></div>
      <div><h3 className="font-bold">Thông tin liên hệ</h3><div className="mt-5 space-y-3 text-sm leading-6 text-white/55">{addresses.map((address, index) => <p key={`${address}-${index}`}>{address}</p>)}<p><a className="transition hover:text-white" href={`tel:${phoneHref}`}>{hotline}</a></p><p><a className="break-all transition hover:text-white" href={`mailto:${email}`}>{email}</a></p></div></div>
    </div>
    <div className="border-t border-white/10"><div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-6 text-xs text-white/40 sm:flex-row sm:justify-between lg:px-8"><p>© 2026 {config?.company_name || "Nhựa Cửu Long STA"}. All rights reserved.</p><p>{config?.slogan || "Chất lượng tạo niềm tin · Bền vững tạo tương lai"}</p></div></div>
  </footer>;
}
