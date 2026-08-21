"use client";

import { usePageConfig } from "./PageConfigProvider";

const getDirectionsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export function ContactAddresses() {
  const config = usePageConfig();
  const addresses = config?.addresses?.filter((address) => address.trim()) ?? [];

  if (!addresses.length) {
    return <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-400">
      Địa chỉ công ty đang được cập nhật.
    </div>;
  }

  return <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
    {addresses.map((address, index) => <article key={`${address}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[.14em] text-brand">Địa chỉ {String(index + 1).padStart(2, "0")}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-ink">{address}</p>
      <a href={getDirectionsUrl(address)} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold text-brand">Xem chỉ đường →</a>
    </article>)}
  </div>;
}
