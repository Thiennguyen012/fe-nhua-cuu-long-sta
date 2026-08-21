import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/app/components/Footer";
import { Navbar } from "@/app/components/Navbar";
import { BreadcrumbBar } from "@/app/components/Breadcrumb";
import { ProductDetailView } from "@/app/components/ProductDetailView";
import { getProductIdFromSlug } from "@/app/lib/product";
import { getProduct } from "@/app/services/product.service";
import { stripHtml } from "@/app/services/page-content.service";

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
  return {
    title: `${product.product_name} | Nhựa Cửu Long STA`,
    description: product.description ? stripHtml(product.description) : `Thông tin chi tiết sản phẩm ${product.product_name}.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps<"/san-pham/[slug]">) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  return (
    <>
      <Navbar />
      <BreadcrumbBar
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Sản phẩm", href: "/san-pham" },
          { label: product.product_name },
        ]}
      />
      <main className="bg-white pb-20">
        <div className="mx-auto max-w-[1240px] px-5 pt-5 lg:px-8">
          <ProductDetailView product={product} />

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <article className="rounded-3xl border border-sky-100 bg-white p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[.2em] text-brand">Chi tiết sản phẩm</p>
              <h2 className="mt-3 text-2xl font-bold text-ink">Mô tả sản phẩm</h2>
              {product.description ? (
                <div
                  className="mt-6 text-base leading-7 text-slate-600 [&>p]:mb-3 [&_strong]:font-bold [&_strong]:text-slate-800"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <div className="mt-6 text-base leading-7 text-slate-600">
                  Thông tin mô tả sản phẩm đang được cập nhật. Vui lòng liên hệ để được tư vấn chi tiết.
                </div>
              )}
            </article>
            <aside className="rounded-3xl bg-[#082b45] p-7 text-white sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[.18em] text-sky-300">Cần hỗ trợ?</p>
              <h2 className="mt-4 text-2xl font-bold">Nhận báo giá nhanh</h2>
              <p className="mt-4 text-sm leading-6 text-white/65">
                Đội ngũ Cửu Long STA sẽ tư vấn vật liệu, quy cách và số lượng phù hợp với nhu cầu của bạn.
              </p>
              <Link href="/lien-he" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-brand">
                Liên hệ ngay →
              </Link>
            </aside>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
