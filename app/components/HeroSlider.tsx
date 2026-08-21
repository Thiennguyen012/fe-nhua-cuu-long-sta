"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PageSectionItem } from "../models/page-content.model";
import { getFileUrl, stripHtml } from "../services/page-content.service";

const defaultSlides = [
  {
    eyebrow: "Giải pháp nhựa toàn diện",
    title: "Sản phẩm nhựa công nghiệp chất lượng cao",
    text: "Đồng hành cùng doanh nghiệp bằng những sản phẩm bền bỉ, an toàn và tối ưu chi phí vận hành.",
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=2000&q=90",
  },
  {
    eyebrow: "Sản xuất hiện đại",
    title: "Tiêu chuẩn cao trong từng sản phẩm",
    text: "Công nghệ tiên tiến, kiểm soát chất lượng chặt chẽ và năng lực cung ứng linh hoạt trên toàn quốc.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2000&q=90",
  },
  {
    eyebrow: "Vì một tương lai xanh",
    title: "Vật liệu bền vững, giá trị dài lâu",
    text: "Không ngừng cải tiến để giảm tác động môi trường và tạo ra những vòng đời sản phẩm hiệu quả hơn.",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=2000&q=90",
  },
];

interface HeroSliderProps {
  items?: PageSectionItem[];
}

export function HeroSlider({ items }: HeroSliderProps) {
  const slides = (items && items.length > 0)
    ? items.map((item, index) => {
        const fileImage = item.files && item.files.length > 0 ? getFileUrl(item.files[0]) : null;
        const defaultFallback = defaultSlides[index % defaultSlides.length];
        return {
          eyebrow: item.subtitle || item.title || defaultFallback.eyebrow,
          title: item.title || defaultFallback.title,
          text: stripHtml(item.content) || defaultFallback.text,
          image: fileImage || defaultFallback.image,
        };
      })
    : defaultSlides;

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => setActive((v) => (v + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active] || slides[0];

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-slate-900 sm:min-h-[620px] lg:min-h-[650px]">
      {slides.map((item, i) => (
        <div
          key={item.title + i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${item.image})` }}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,29,49,.94)_0%,rgba(5,47,79,.78)_43%,rgba(2,21,36,.18)_78%)]" />
      <div className="relative mx-auto flex min-h-[560px] max-w-[1240px] items-center px-5 py-20 sm:min-h-[620px] lg:min-h-[650px] lg:px-8">
        <div key={active} className="hero-content max-w-2xl pt-4 text-white">
          <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.24em] text-sky-300">
            <span className="h-px w-10 bg-sky-400" />
            {slide.eyebrow}
          </p>
          <h1 className="text-[38px] font-extrabold leading-[1.16] tracking-[-.035em] sm:text-5xl lg:text-[60px]">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            {slide.text}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="#san-pham"
              className="rounded-full bg-brand px-7 py-3.5 text-sm font-bold shadow-lg transition hover:bg-sky-500"
            >
              Khám phá sản phẩm <span aria-hidden>→</span>
            </Link>
            <Link
              href="/lien-he"
              className="rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-bold backdrop-blur transition hover:bg-white/20"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 sm:bottom-20">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Đến banner ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={`size-3 rounded-full border transition-all duration-300 ${
                i === active
                  ? "scale-110 border-white bg-white ring-4 ring-white/20"
                  : "border-white/70 bg-white/30 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
