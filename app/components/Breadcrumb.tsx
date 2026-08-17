import Link from "next/link";

type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({ items, light = false }: { items: BreadcrumbItem[]; light?: boolean }) {
  return <nav aria-label="Đường dẫn" className={`flex flex-wrap items-center gap-2 text-xs ${light ? "text-white/55" : "text-slate-500"}`}>{items.map((item, index) => <span key={`${item.label}-${index}`} className="flex items-center gap-2">{index > 0 && <span aria-hidden className={light ? "text-white/30" : "text-slate-300"}>/</span>}{item.href ? <Link href={item.href} className={`transition ${light ? "hover:text-white" : "hover:text-brand"}`}>{item.label}</Link> : <span aria-current="page" className={light ? "text-sky-300" : "text-brand"}>{item.label}</span>}</span>)}</nav>;
}

export function BreadcrumbBar({ items }: { items: BreadcrumbItem[] }) {
  return <div className="h-14 border-b border-slate-100 bg-white"><div className="mx-auto flex h-full max-w-[1240px] items-center px-5 lg:px-8"><Breadcrumb items={items}/></div></div>;
}
