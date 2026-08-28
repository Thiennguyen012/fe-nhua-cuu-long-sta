"use client";

import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/app/components/Footer";
import { Navbar } from "@/app/components/Navbar";
import { BreadcrumbBar } from "@/app/components/Breadcrumb";
import type { PageContent, PageSection } from "../models/page-content.model";
import { getFileUrl, stripHtml } from "../services/page-content.service";
import { shouldBypassImageOptimization } from "../lib/image";

interface AboutPageContentProps {
  pageContent?: PageContent | null;
}

const defaultVisionMission = [
  {
    title: "Tầm nhìn",
    subtitle: "Trở thành doanh nghiệp nhựa công nghiệp được tin chọn hàng đầu Việt Nam",
    content: "Dẫn đầu bằng chất lượng, công nghệ và những giải pháp có trách nhiệm với tương lai.",
    bg: "bg-[#082b45]",
    subColor: "text-sky-300",
    textColor: "text-white/65",
  },
  {
    title: "Sứ mệnh",
    subtitle: "Tạo ra giải pháp thiết thực, nâng cao hiệu quả cho khách hàng",
    content: "Mang đến sản phẩm ổn định, dịch vụ tận tâm và giá trị lâu dài cho từng đối tác.",
    bg: "bg-brand",
    subColor: "text-white/65",
    textColor: "text-white/75",
  },
];

const defaultValues = [
  ["01", "Chất lượng", "Chất lượng là nền tảng trong mọi quyết định, từ nguyên liệu đến dịch vụ sau bán hàng."],
  ["02", "Đổi mới", "Liên tục cải tiến công nghệ và quy trình để tạo ra giải pháp hiệu quả hơn."],
  ["03", "Tận tâm", "Lắng nghe nhu cầu, tư vấn minh bạch và đồng hành lâu dài cùng khách hàng."],
  ["04", "Bền vững", "Cân bằng hiệu quả kinh doanh với trách nhiệm dành cho cộng đồng và môi trường."],
];

const defaultMilestones = [
  ["2011", "Khởi đầu hành trình", "Thành lập xưởng sản xuất đầu tiên tại TP. Hồ Chí Minh."],
  ["2016", "Mở rộng quy mô", "Đầu tư dây chuyền hiện đại và phát triển mạng lưới phân phối."],
  ["2020", "Chuẩn hóa chất lượng", "Áp dụng hệ thống quản lý chất lượng theo tiêu chuẩn ISO 9001:2015."],
  ["2026", "Vươn tầm toàn quốc", "Phục vụ hơn 2.000 khách hàng tại 63 tỉnh thành."],
];

export function AboutPageContent({ pageContent }: AboutPageContentProps) {
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

  const introSection = getSection(1, "lời giới thiệu") || getSection(1, "giới thiệu");
  const visionSection = getSection(2, "tầm nhìn");
  const valuesSection = getSection(3, "giá trị");
  const milestoneSection = getSection(4, "hành trình");
  const ctaSection = getSection(5, "bền vững");

  // Intro section values
  const introSubtitle = introSection?.subtitle || "CÔNG TY TNHH THƯƠNG MẠI VÀ SẢN XUẤT NHỰA CỬU LONG STA";
  const introTitle = introSection?.title || "LỜI GIỚI THIỆU";
  const introImage =
    (introSection?.files && introSection.files.length > 0
      ? getFileUrl(introSection.files[0])
      : null) ||
    "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=1400&q=90";

  // Vision & Mission items
  const visionItems =
    visionSection?.items && visionSection.items.length >= 2
      ? [
          {
            title: visionSection.items[0].title || "Tầm nhìn",
            subtitle: visionSection.items[0].subtitle || "",
            content: stripHtml(visionSection.items[0].content),
            bg: "bg-[#082b45]",
            subColor: "text-sky-300",
            textColor: "text-white/65",
          },
          {
            title: visionSection.items[1].title || "Sứ mệnh",
            subtitle: visionSection.items[1].subtitle || "",
            content: stripHtml(visionSection.items[1].content),
            bg: "bg-brand",
            subColor: "text-white/65",
            textColor: "text-white/75",
          },
        ]
      : defaultVisionMission;

  // Values items
  const valueItems =
    valuesSection?.items && valuesSection.items.length > 0
      ? valuesSection.items.map((item, idx) => ({
          n: String(idx + 1).padStart(2, "0"),
          title: item.title || "",
          text: stripHtml(item.content) || item.subtitle || "",
        }))
      : defaultValues.map(([n, title, text]) => ({ n, title, text }));

  // Milestones items
  const milestoneItems =
    milestoneSection?.items && milestoneSection.items.length > 0
      ? milestoneSection.items.map((item) => ({
          year: item.title || "",
          title: item.subtitle || "",
          text: stripHtml(item.content),
        }))
      : defaultMilestones.map(([year, title, text]) => ({ year, title, text }));

  // CTA Section
  const ctaTitle = ctaSection?.title || "Cùng Cửu Long STA tạo nên giá trị bền vững";
  const ctaSubtitle = ctaSection?.subtitle || "Chúng tôi sẵn sàng lắng nghe và đồng hành cùng dự án của bạn.";

  return (
    <>
      <Navbar />
      <BreadcrumbBar items={[{ label: "Trang chủ", href: "/" }, { label: "Giới thiệu" }]} />
      <main>
        {/* Section 1: Lời giới thiệu */}
        <section className="bg-[#f5f9fc]">
          <div className="mx-auto flow-root max-w-[1240px] px-5 pb-12 pt-8 sm:pb-20 sm:pt-12 lg:px-8">
            <div className="relative mb-12 lg:float-left lg:mb-8 lg:mr-14 lg:w-[calc((100%-3.5rem)/2)]">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-2 shadow-sm">
                <Image
                  src={introImage}
                  alt={introTitle}
                  width={1000}
                  height={750}
                  unoptimized={shouldBypassImageOptimization(introImage)}
                  className="h-auto w-full rounded-2xl object-contain"
                />
              </div>
              <div className="absolute -bottom-5 right-4 z-10 rounded-2xl bg-brand px-6 py-4 text-white shadow-2xl sm:right-[-16px]">
                <strong className="block text-2xl font-extrabold sm:text-3xl">15+</strong>
                <span className="text-xs text-white/80">Năm phát triển bền vững</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[.24em] text-brand">{introSubtitle}</p>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-.025em] sm:text-4xl">
                {introTitle}
              </h1>
              {introSection?.content ? (
                <div
                  className="mt-6 space-y-4 text-sm leading-7 text-slate-600 sm:text-base [&>p]:mb-3 [&_strong]:font-bold [&_strong]:text-slate-800"
                  dangerouslySetInnerHTML={{ __html: introSection.content }}
                />
              ) : (
                <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                  <p>
                    Cửu Long STA được hình thành từ một mong muốn giản dị: tạo ra những sản phẩm nhựa chất lượng, phù hợp với điều kiện vận hành thực tế của doanh nghiệp Việt.
                  </p>
                  <p>
                    Qua từng giai đoạn, chúng tôi kiên định đầu tư vào công nghệ, con người và hệ thống quản lý. Mỗi sản phẩm xuất xưởng không chỉ đáp ứng yêu cầu kỹ thuật mà còn mang theo cam kết về sự bền bỉ và trách nhiệm.
                  </p>
                </div>
              )}

              <div className="mt-8 flex gap-8 border-t border-slate-200 pt-7">
                <div>
                  <strong className="block text-2xl font-extrabold text-brand">2.000+</strong>
                  <span className="text-xs text-slate-500">Khách hàng</span>
                </div>
                <div>
                  <strong className="block text-2xl font-extrabold text-brand">120+</strong>
                  <span className="text-xs text-slate-500">Dòng sản phẩm</span>
                </div>
                <div>
                  <strong className="block text-2xl font-extrabold text-brand">63</strong>
                  <span className="text-xs text-slate-500">Tỉnh thành</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Tầm nhìn & Sứ mệnh */}
        <section className="bg-surface py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-6 px-5 md:grid-cols-2 lg:px-8">
            {visionItems.map((item, idx) => (
              <article key={idx} className={`rounded-3xl ${item.bg} p-8 text-white sm:p-11`}>
                <span className={`text-xs font-bold uppercase tracking-[.22em] ${item.subColor}`}>
                  {item.title}
                </span>
                <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">{item.subtitle}</h2>
                <p className={`mt-5 text-sm leading-7 ${item.textColor}`}>{item.content}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Section 3: Giá trị cốt lõi */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[.24em] text-brand">
                {valuesSection?.subtitle || "Giá trị cốt lõi"}
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-.025em] sm:text-4xl">
                {valuesSection?.title || "Nguyên tắc dẫn đường cho mọi hành động"}
              </h2>
            </div>
            <div className={`mt-12 grid gap-5 sm:grid-cols-2 ${valueItems.length > 4 ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-4"}`}>
              {valueItems.map((val) => (
                <article
                  key={val.n + val.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="text-3xl font-extrabold text-sky-100">{val.n}</span>
                  <h3 className="mt-7 text-lg font-bold">{val.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{val.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Hành trình phát triển */}
        <section className="bg-[#071d2e] py-20 text-white sm:py-24">
          <div className="mx-auto max-w-[1040px] px-5 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[.24em] text-sky-300">
                {milestoneSection?.subtitle || "Hành trình phát triển"}
              </p>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                {milestoneSection?.title || "Những cột mốc đáng nhớ"}
              </h2>
            </div>
            <div className="relative mt-14 grid gap-7 md:grid-cols-4">
              <div className="absolute left-0 right-0 top-[9px] hidden h-px bg-white/15 md:block" />
              {milestoneItems.map((item) => (
                <article
                  key={item.year + item.title}
                  className="relative border-l border-white/15 pl-6 md:border-l-0 md:pl-0 md:pt-10"
                >
                  <span className="absolute -left-[5px] top-1 size-2.5 rounded-full bg-sky-400 ring-4 ring-[#0d3048] md:left-0 md:top-1" />
                  <strong className="text-2xl font-extrabold text-sky-300">{item.year}</strong>
                  <h3 className="mt-3 font-bold">{item.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-white/50">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Call to Action */}
        <section className="relative overflow-hidden bg-brand">
          <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-7 px-5 py-14 text-white sm:flex-row sm:items-center lg:px-8">
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">{ctaTitle}</h2>
              <p className="mt-2 text-sm text-white/70">{ctaSubtitle}</p>
            </div>
            <Link
              href="/lien-he"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand shadow-lg"
            >
              Liên hệ với chúng tôi
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
