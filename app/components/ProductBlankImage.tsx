"use client";

export function ProductBlankImage() {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#eaf6fd_0%,#d7edf9_52%,#c8e4f4_100%)] text-brand">
      <div className="absolute -right-10 -top-12 size-36 rounded-full border-[20px] border-white/35" />
      <div className="absolute -bottom-14 -left-10 size-40 rounded-full border-[24px] border-white/30" />
      <span className="relative grid size-14 place-items-center rounded-2xl bg-white/85 shadow-[0_10px_25px_rgba(8,117,189,.12)] backdrop-blur transition duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-7 fill-none stroke-current"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </span>
    </div>
  );
}
