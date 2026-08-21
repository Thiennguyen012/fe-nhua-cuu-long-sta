"use client";

import { usePageConfig } from "./PageConfigProvider";
import { stripHtml } from "../services/page-content.service";

const getDirectionsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export function ContactAddresses() {
  const config = usePageConfig();
  const addresses = config?.addresses?.filter((address) => address.trim()) ?? [];
  const rawWorkingHour = config?.working_hour?.trim();
  const workingHour = rawWorkingHour ? stripHtml(rawWorkingHour) : null;

  if (!addresses.length && !workingHour) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-400">
        Địa chỉ công ty đang được cập nhật.
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {addresses.map((address, index) => {
        const cleanAddr = stripHtml(address);
        return (
          <article key={`${address}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-brand">
              Địa chỉ {addresses.length > 1 ? String(index + 1).padStart(2, "0") : ""}
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-ink">{cleanAddr}</p>
            <a
              href={getDirectionsUrl(cleanAddr)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs font-bold text-brand"
            >
              Xem chỉ đường →
            </a>
          </article>
        );
      })}

      {workingHour && (
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-brand">Giờ làm việc</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink">{workingHour}</p>
        </article>
      )}
    </div>
  );
}
