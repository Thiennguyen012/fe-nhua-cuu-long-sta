"use client";

import Image from "next/image";
import { Footer } from "./Footer";
import { HeroSlider } from "./HeroSlider";
import { Navbar } from "./Navbar";
import { Stats } from "./Stats";
import { HomeCategories } from "./HomeCategories";
import { usePageConfig } from "./PageConfigProvider";
import type { PageContent, PageSection } from "../models/page-content.model";
import { getFileUrl, stripHtml } from "../services/page-content.service";
import { shouldBypassImageOptimization } from "../lib/image";

interface HomePageProps {
  pageContent?: PageContent | null;
}

const defaultAboutItems = [
  "Nguyên liệu đạt chuẩn",
  "Quy trình hiện đại",
  "Giao hàng toàn quốc",
  "Hỗ trợ tận tâm",
];

const defaultCommitmentItems = [
  { n: "01", t: "Chất lượng ổn định", d: "Sản phẩm được kiểm định kỹ lưỡng trước khi xuất xưởng." },
  { n: "02", t: "Giải pháp phù hợp", d: "Tư vấn theo đúng nhu cầu sử dụng và ngân sách thực tế." },
  { n: "03", t: "Đồng hành lâu dài", d: "Dịch vụ hậu mãi nhanh chóng trong suốt vòng đời sản phẩm." },
];

export function HomePage({ pageContent }: HomePageProps) {
  const pageConfig = usePageConfig();
  const sections = pageContent?.sections;

  const getSection = (order: number, keyword: string): PageSection | undefined => {
    if (!sections) return undefined;
    return (
      sections.find((s) => s.sort_order === order) ||
      sections.find(
        (s) =>
          s.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          s.subtitle?.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const heroSection = getSection(1, "hero");
  const categorySection = getSection(2, "danh mục");
  const aboutSection = getSection(3, "về");
  const commitmentSection = getSection(4, "cam kết");
  const ctaSection = getSection(5, "phù hợp");

  // About Section values
  const aboutSubtitle = aboutSection?.subtitle || "Về Cửu Long STA";
  const aboutTitle = aboutSection?.title || "Nền tảng vững chắc cho mọi hoạt động sản xuất";
  const aboutText =
    stripHtml(aboutSection?.content) ||
    "Từ tư vấn lựa chọn vật liệu đến sản xuất và giao hàng, đội ngũ Cửu Long STA kiểm soát chặt chẽ từng công đoạn để mang đến chất lượng đồng nhất.";
  const aboutImage =
    (aboutSection?.files && aboutSection.files.length > 0
      ? getFileUrl(aboutSection.files[0])
      : null) ||
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=90";

  const aboutItems =
    aboutSection?.items && aboutSection.items.length > 0
      ? aboutSection.items.map((item) => item.title || "").filter(Boolean)
      : defaultAboutItems;

  // Commitment Section values
  const commitmentSubtitle = commitmentSection?.subtitle || "Cam kết của chúng tôi";
  const commitmentTitle =
    commitmentSection?.title || "Chất lượng tạo niềm tin, bền vững tạo tương lai";
  const commitmentItems =
    commitmentSection?.items && commitmentSection.items.length > 0
      ? commitmentSection.items.map((item, idx) => ({
          n: String(idx + 1).padStart(2, "0"),
          t: item.title || "",
          d: stripHtml(item.content),
        }))
      : defaultCommitmentItems;

  // CTA Section values
  const ctaTitle = ctaSection?.title || "Bạn đang cần giải pháp phù hợp?";
  const ctaSubtitle = ctaSection?.subtitle || "Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ.";
  const hotline = pageConfig?.hotline || "0901 234 567";
  const hotlineHref = `tel:${hotline.replace(/\s+/g, "")}`;

  return (
    <>
      <Navbar />
      <main>
        <HeroSlider items={heroSection?.items} />
        <Stats />

        {/* Danh mục sản phẩm */}
        <section id="san-pham" className="mx-auto max-w-[1240px] px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[.24em] text-brand">
              {categorySection?.subtitle || "Danh mục sản phẩm"}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-.025em] text-ink sm:text-4xl">
              {categorySection?.title || "Khám phá sản phẩm theo danh mục"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              {stripHtml(categorySection?.content) ||
                "Tìm nhanh nhóm sản phẩm phù hợp với nhu cầu sản xuất, lưu trữ và vận hành của doanh nghiệp."}
            </p>
          </div>
          <HomeCategories />
        </section>

        {/* Về Cửu Long STA */}
        <section id="gioi-thieu" className="bg-surface py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                src={aboutImage}
                alt={aboutTitle}
                unoptimized={shouldBypassImageOptimization(aboutImage)}
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.24em] text-brand">{aboutSubtitle}</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-.025em] sm:text-4xl">
                {aboutTitle}
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">{aboutText}</p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {aboutItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-semibold">
                    <span className="grid size-6 place-items-center rounded-full bg-sky-100 text-xs text-brand">
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cam kết của chúng tôi */}
        <section id="tin-tuc" className="mx-auto max-w-[1240px] px-5 py-20 text-center sm:py-24 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[.24em] text-brand">{commitmentSubtitle}</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-[-.025em] sm:text-4xl">
            {commitmentTitle}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {commitmentItems.map(({ n, t, d }) => (
              <article key={n + t} className="rounded-2xl border border-slate-200 p-7 text-left">
                <span className="text-3xl font-extrabold text-sky-100">{n}</span>
                <h3 className="mt-6 text-lg font-bold">{t}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="bg-brand">
          <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-7 px-5 py-12 text-white sm:flex-row sm:items-center lg:px-8">
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">{ctaTitle}</h2>
              <p className="mt-2 text-sm text-white/70">{ctaSubtitle}</p>
            </div>
            <a
              href={hotlineHref}
              className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand shadow-lg"
            >
              Gọi {hotline}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
