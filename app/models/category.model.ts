export interface Category {
  id: number;
  category_name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CategoryListResponse {
  status_code: number;
  message: string;
  data: Category[];
  meta: PaginationMeta;
}
