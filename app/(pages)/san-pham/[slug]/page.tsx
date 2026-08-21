/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/app/components/Footer";
import { Navbar } from "@/app/components/Navbar";
import { ProductVariantSelector } from "@/app/components/ProductVariantSelector";
import { BreadcrumbBar } from "@/app/components/Breadcrumb";
import { getProductIdFromSlug, getProductImageUrl } from "@/app/lib/product";
import { getProduct } from "@/app/services/product.service";

export const dynamic = "force-dynamic";

async function loadProduct(slug: string) {
  const id = getProductIdFromSlug(slug);
  if (!id) return null;
  return getProduct(id).catch(() => null);
}

export async function generateMetadata({ params }: PageProps<"/san-pham/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm | Nhựa Cửu Long STA" };
  return { title: `${product.product_name} | Nhựa Cửu Long STA`, description: product.description ?? `Thông tin chi tiết sản phẩm ${product.product_name}.` };
}

export default async function ProductDetailPage({ params }: PageProps<"/san-pham/[slug]">) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const images = product.images.length ? product.images : product.first_image ? [product.first_image] : [];

  return <><Navbar/><BreadcrumbBar items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm", href: "/san-pham" }, { label: product.product_name }]}/><main className="bg-white pb-20"><div className="mx-auto max-w-[1240px] px-5 pt-5 lg:px-8">
    <section className="grid gap-8 rounded-3xl border border-sky-100 bg-white p-5 shadow-[0_18px_55px_rgba(16,50,78,.07)] sm:p-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12"><div><div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">{images[0] ? <img src={getProductImageUrl(images[0]) ?? ""} alt={product.product_name} className="size-full object-cover"/> : <div className="grid size-full place-items-center text-slate-400">Chưa có hình ảnh</div>}</div>{images.length > 1 && <div className="mt-4 grid grid-cols-4 gap-3">{images.slice(1, 5).map((image) => <div key={image.id} className="aspect-square overflow-hidden rounded-xl border border-sky-100 bg-slate-100"><img src={getProductImageUrl(image) ?? ""} alt={image.title || product.product_name} className="size-full object-cover"/></div>)}</div>}</div>
      <div className="py-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-sky-100 px-3 py-1.5 text-[11px] font-bold text-brand">{product.category_names || "Chưa phân loại"}</span>{product.is_featured && <span className="rounded-full bg-[#173f5b] px-3 py-1.5 text-[11px] font-bold text-white">Sản phẩm nổi bật</span>}</div><h1 className="mt-5 text-3xl font-bold leading-tight tracking-[-.02em] text-ink sm:text-4xl">{product.product_name}</h1><p className="mt-3 text-sm text-slate-400">Mã sản phẩm: <strong className="font-semibold text-slate-600">{product.sku || "Đang cập nhật"}</strong></p><ProductVariantSelector groups={product.variant_groups ?? []} variants={product.variants}/><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/lien-he" className="rounded-full bg-brand px-7 py-3.5 text-center text-sm font-bold text-white shadow-[0_10px_25px_rgba(8,117,189,.22)] transition hover:bg-brand-dark">Nhận tư vấn sản phẩm</Link><a href="tel:0901234567" className="rounded-full border border-sky-200 bg-white px-7 py-3.5 text-center text-sm font-bold text-ink transition hover:border-brand hover:text-brand">Gọi 0901 234 567</a></div><div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-100 pt-7 text-xs text-slate-500"><p><strong className="block text-sm font-semibold text-ink">Giao hàng toàn quốc</strong>Hỗ trợ vận chuyển linh hoạt</p><p><strong className="block text-sm font-semibold text-ink">Tư vấn kỹ thuật</strong>Chọn đúng giải pháp sử dụng</p></div></div></section>
    <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><article className="rounded-3xl border border-sky-100 bg-white p-6 sm:p-8"><p className="text-[11px] font-bold uppercase tracking-[.2em] text-brand">Chi tiết sản phẩm</p><h2 className="mt-3 text-2xl font-bold text-ink">Mô tả sản phẩm</h2><div className="mt-6 whitespace-pre-line text-base leading-7 text-slate-600">{product.description || "Thông tin mô tả sản phẩm đang được cập nhật. Vui lòng liên hệ để được tư vấn chi tiết."}</div></article><aside className="rounded-3xl bg-[#082b45] p-7 text-white sm:p-8"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-sky-300">Cần hỗ trợ?</p><h2 className="mt-4 text-2xl font-bold">Nhận báo giá nhanh</h2><p className="mt-4 text-sm leading-6 text-white/65">Đội ngũ Cửu Long STA sẽ tư vấn vật liệu, quy cách và số lượng phù hợp với nhu cầu của bạn.</p><Link href="/lien-he" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-brand">Liên hệ ngay →</Link></aside></section>
  </div></main><Footer/></>;
}
