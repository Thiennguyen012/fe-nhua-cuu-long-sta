"use client";

import { type FormEvent, useState } from "react";
import { useCategories } from "./PageConfigProvider";
import { createCustomerContact } from "../services/customer-contact.service";

const fieldClassName = "mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-sky-100";

export function ContactForm() {
  const categories = useCategories();
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSubmitting(true);
    setError("");

    try {
      await createCustomerContact({
        full_name: String(formData.get("full_name") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        category_id: Number(formData.get("category_id")),
        consultation_content: String(formData.get("consultation_content") ?? "").trim(),
      });
      form.reset();
      setSent(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Không thể gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return <div className="grid min-h-[460px] place-items-center rounded-3xl border border-sky-100 bg-white p-8 text-center shadow-[0_18px_55px_rgba(16,50,78,.08)]">
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-sky-100 text-2xl text-brand">✓</span>
        <h2 className="mt-6 text-2xl font-extrabold text-ink">Đã nhận thông tin của bạn</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">Đội ngũ Cửu Long STA sẽ liên hệ lại trong thời gian sớm nhất.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white">Gửi yêu cầu khác</button>
      </div>
    </div>;
  }

  return <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_55px_rgba(16,50,78,.08)] sm:p-9">
    <div>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-brand">Gửi yêu cầu</p>
      <h2 className="mt-3 text-2xl font-extrabold text-ink sm:text-3xl">Chúng tôi có thể giúp gì cho bạn?</h2>
      <p className="mt-3 text-sm leading-6 text-slate-500">Điền thông tin bên dưới, chuyên viên của Cửu Long STA sẽ chủ động liên hệ.</p>
    </div>

    <div className="mt-7 grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-semibold text-slate-700">
        Họ và tên <span className="text-red-500">*</span>
        <input required name="full_name" autoComplete="name" placeholder="Nhập họ và tên" className={fieldClassName}/>
      </label>
      <label className="text-sm font-semibold text-slate-700">
        Số điện thoại <span className="text-red-500">*</span>
        <input required name="phone" type="tel" autoComplete="tel" placeholder="Nhập số điện thoại" className={fieldClassName}/>
      </label>
      <label className="text-sm font-semibold text-slate-700">
        Email
        <input name="email" type="email" autoComplete="email" placeholder="Nhập địa chỉ email" className={fieldClassName}/>
      </label>
      <label className="text-sm font-semibold text-slate-700">
        Sản phẩm quan tâm <span className="text-red-500">*</span>
        <select required name="category_id" defaultValue="" className={`${fieldClassName} bg-white text-slate-600`}>
          <option value="" disabled>Chọn danh mục sản phẩm</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.category_name}</option>)}
        </select>
      </label>
      <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
        Nội dung cần tư vấn <span className="text-red-500">*</span>
        <textarea required name="consultation_content" rows={5} placeholder="Nhập nội dung cần tư vấn" className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-sky-100"/>
      </label>
    </div>

    {error && <p role="alert" aria-live="polite" className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

    <button disabled={isSubmitting} type="submit" className="mt-6 w-full rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(8,117,189,.22)] transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
      {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu tư vấn"} {!isSubmitting && <span aria-hidden>→</span>}
    </button>
  </form>;
}
