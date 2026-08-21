"use client";

import { useEffect, useState } from "react";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 200);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return <button
    type="button"
    aria-label="Cuộn lên đầu trang"
    title="Lên đầu trang"
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className={`fixed bottom-5 right-5 z-[150] grid size-10 place-items-center rounded-full border-[3px] border-[#173f5b] bg-transparent text-[#173f5b] transition duration-200 hover:-translate-y-0.5 hover:bg-[#173f5b] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 ${visible ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0"}`}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 10 6-6 6 6"/>
      <path d="M12 4v16"/>
    </svg>
  </button>;
}
