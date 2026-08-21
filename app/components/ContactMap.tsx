"use client";

import { usePageConfig } from "./PageConfigProvider";

const getEmbedMapUrl = (value: string) => {
  try {
    const url = new URL(value);
    const isGoogleMaps = url.protocol === "https:" &&
      (url.hostname === "www.google.com" || url.hostname === "maps.google.com");

    if (!isGoogleMaps) return null;
    if (url.pathname.startsWith("/maps/embed")) return url.toString();

    const directionMatch = url.pathname.match(/^\/maps\/dir\/\/([^/]+)/);
    const placeMatch = url.pathname.match(/^\/maps\/place\/([^/]+)/);
    const pathQuery = directionMatch?.[1] || placeMatch?.[1];
    const query = url.searchParams.get("q") ||
      (pathQuery ? decodeURIComponent(pathQuery).replace(/\+/g, " ") : null);

    if (query) {
      const embedUrl = new URL("https://www.google.com/maps");
      embedUrl.searchParams.set("q", query);
      embedUrl.searchParams.set("output", "embed");
      return embedUrl.toString();
    }

    url.hostname = "www.google.com";
    url.searchParams.set("output", "embed");
    return url.toString();
  } catch {
    return null;
  }
};

export function ContactMap() {
  const config = usePageConfig();
  const mapUrl = config?.map_url?.trim() ?? "";
  const embedMapUrl = getEmbedMapUrl(mapUrl);

  if (embedMapUrl) {
    return <div className="relative min-h-[330px] overflow-hidden rounded-3xl border border-sky-100 bg-slate-100">
      <iframe
        title={`Bản đồ ${config?.company_name || "Cửu Long STA"}`}
        src={embedMapUrl}
        className="absolute inset-0 size-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>;
  }

  return <div className="relative min-h-[330px] overflow-hidden rounded-3xl bg-[#dcebf4]">
    <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "linear-gradient(#8eb9d4 1px,transparent 1px),linear-gradient(90deg,#8eb9d4 1px,transparent 1px)", backgroundSize: "32px 32px" }}/>
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand text-2xl text-white shadow-xl">●</span>
      <strong className="mt-4 block text-lg text-ink">{config?.company_name || "Cửu Long STA"}</strong>
      <p className="mt-1 text-xs text-slate-500">{config?.addresses?.[0] || "Địa chỉ đang được cập nhật"}</p>
    </div>
  </div>;
}
