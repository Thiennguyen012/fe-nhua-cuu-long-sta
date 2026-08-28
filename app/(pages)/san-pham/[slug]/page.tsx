import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Footer } from "@/app/components/Footer";
import { Navbar } from "@/app/components/Navbar";
import { BreadcrumbBar } from "@/app/components/Breadcrumb";
import { ProductDetailView } from "@/app/components/ProductDetailView";
import { JsonLd } from "@/app/components/JsonLd";
import { createProductSlug, getProductIdFromSlug, getProductImageUrl } from "@/app/lib/product";
import { getProduct } from "@/app/services/product.service";
import { stripHtml } from "@/app/services/page-content.service";
import { createBreadcrumbJsonLd, getSiteUrl } from "@/app/lib/seo";

export const dynamic = "force-dynamic";

async function loadProduct(slug: string) {
  const id = getProductIdFromSlug(slug);
  if (!id) return null;
  return getProduct(id).catch(() => null);
}

export async function generateMetadata({ params }: PageProps<"/san-pham/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm | Nhựa Cửu Long STA",
      robots: { index: false, follow: false },
    };
  }
  const canonicalPath = `/san-pham/${createProductSlug(product.product_name, product.id)}`;
  const description = product.description
    ? stripHtml(product.description)
    : `Thông tin chi tiết sản phẩm ${product.product_name}.`;
  const imageUrl = getProductImageUrl(product.first_image);

  return {
    title: `${product.product_name} | Nhựa Cửu Long STA`,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      title: `${product.product_name} | Nhựa Cửu Long STA`,
      description,
      url: canonicalPath,
      ...(imageUrl ? { images: [{ url: imageUrl, alt: product.product_name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.product_name} | Nhựa Cửu Long STA`,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps<"/san-pham/[slug]">) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();
  const canonicalSlug = createProductSlug(product.product_name, product.id);
  if (slug !== canonicalSlug) permanentRedirect(`/san-pham/${canonicalSlug}`);
  const canonicalPath = `/san-pham/${canonicalSlug}`;
  const productUrl = `${getSiteUrl()}${canonicalPath}`;
  const description = product.description
    ? stripHtml(product.description)
    : `Thông tin chi tiết sản phẩm ${product.product_name}.`;
  const images = Array.from(
    new Set(
      [product.first_image, ...(product.images ?? [])]
        .map((image) => getProductImageUrl(image))
        .filter((url): url is string => Boolean(url))
    )
  );
  const offers = product.is_contact_price
    ? []
    : (product.variants ?? [])
        .filter((variant) => {
          const price = Number(variant.price);
          return variant.is_active && !variant.is_contact_price && Number.isFinite(price) && price > 0;
        })
        .map((variant) => ({
          "@type": "Offer",
          price: Number(variant.price).toFixed(0),
          priceCurrency: "VND",
          availability: variant.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: productUrl,
          ...(variant.sku ? { sku: variant.sku } : {}),
          seller: { "@id": `${getSiteUrl()}/#organization` },
        }));
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.product_name,
    description,
    url: productUrl,
    ...(images.length ? { image: images } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.category_names ? { category: product.category_names } : {}),
    brand: { "@id": `${getSiteUrl()}/#organization` },
    ...(offers.length ? { offers } : {}),
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Sản phẩm", path: "/san-pham" },
          { name: product.product_name, path: canonicalPath },
        ])}
      />
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
