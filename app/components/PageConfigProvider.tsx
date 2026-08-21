"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PageConfig } from "../models/page-config.model";
import type { Category } from "../models/category.model";

const PageConfigContext = createContext<PageConfig | null>(null);
const CategoriesContext = createContext<Category[]>([]);

export function PageConfigProvider({ config, categories, children }: { config: PageConfig | null; categories: Category[]; children: ReactNode }) {
  return <PageConfigContext.Provider value={config}><CategoriesContext.Provider value={categories}>{children}</CategoriesContext.Provider></PageConfigContext.Provider>;
}

export function usePageConfig() {
  return useContext(PageConfigContext);
}

export function useCategories() {
  return useContext(CategoriesContext);
}
