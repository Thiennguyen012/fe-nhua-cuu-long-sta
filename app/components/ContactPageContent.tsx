"use client";

import Image from "next/image";
import { ContactForm } from "./ContactForm";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { BreadcrumbBar } from "./Breadcrumb";
import { ContactMap } from "./ContactMap";
import { ContactAddresses } from "./ContactAddresses";
import { ContactHotline } from "./ContactHotline";
import type { PageContent, PageSection } from "../models/page-content.model";
import { getFileUrl, stripHtml } from "../services/page-content.service";
import { shouldBypassImageOptimization } from "../lib/image";

interface ContactPageContentProps {
  pageContent?: PageContent | null;
}

export function ContactPageContent({ pageContent }: ContactPageContentProps) {
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

  const heroSection = getSection(1, "lắng nghe") || getSection(1, "kết nối");
  const infoSection = getSection(2, "thông tin");
  const hotlineSection = getSection(3, "tư vấn") || getSection(3, "hỗ trợ");

  // Hero section values
  const heroSubtitle = heroSection?.subtitle || "Kết nối cùng Cửu Long STA";
  const heroTitle = heroSection?.title || "Chúng tôi luôn sẵn sàng lắng nghe";
  const heroText =
    stripHtml(heroSection?.content) ||
    "Hãy chia sẻ nhu cầu của bạn để đội ngũ Cửu Long STA tư vấn giải pháp phù hợp và hiệu quả nhất.";
  const heroBgImage =
    (heroSection?.files && heroSection.files.length > 0
      ? getFileUrl(heroSection.files[0])
      : null) ||
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=90";

  // Info section values
  const infoSubtitle = infoSection?.subtitle || infoSection?.title || "Thông tin liên hệ";
  const infoTitle = infoSection?.title || "Hãy bắt đầu một cuộc trò chuyện";
  const infoText =
    stripHtml(infoSection?.content) ||
    "Bạn có thể liên hệ qua bất kỳ kênh nào dưới đây. Chúng tôi phản hồi mọi yêu cầu trong giờ làm việc.";

  return (
    <>
      <Navbar />
      <BreadcrumbBar items={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]} />
      <main>
        {/* Hero Section */}
        <section className="relative isolate flex min-h-[360px] items-center overflow-hidden bg-[#07243a]">
          <Image
            fill
            preload
            sizes="100vw"
            src={heroBgImage}
            alt={heroTitle}
            unoptimized={shouldBypassImageOptimization(heroBgImage)}
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,31,50,.96),rgba(7,55,88,.76),rgba(3,24,39,.4))]" />
          <div className="mx-auto w-full max-w-[1240px] px-5 py-16 text-white lg:px-8">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.24em] text-sky-300">
              <span className="h-px w-10 bg-sky-400" />
              {heroSubtitle}
            </p>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-.035em] sm:text-5xl lg:text-[56px]">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">{heroText}</p>
          </div>
        </section>

        {/* Contact Info & Form Section */}
        <section className="bg-surface py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 lg:grid-cols-[.85fr_1.15fr] lg:gap-14 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-brand">{infoSubtitle}</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-.025em] sm:text-4xl">
                {infoTitle}
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-600">{infoText}</p>
              <ContactAddresses />
            </div>
            <ContactForm />
          </div>
        </section>

        {/* Map & Hotline Section */}
        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-[1240px] items-stretch gap-6 px-5 md:grid-cols-[1.2fr_.8fr] lg:px-8">
            <ContactMap />
            <ContactHotline section={hotlineSection} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
