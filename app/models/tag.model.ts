export interface ProductTagGroupSummary {
  id: number;
  name: string;
  code: string;
}

export interface ProductTag {
  id: number;
  tag_group_id: number;
  tag_group_name: string;
  name: string;
  slug: string;
  tag_group?: ProductTagGroupSummary;
  created_at: string;
  updated_at: string;
}

export interface ProductTagGroup {
  id: number;
  name: string;
  code: string;
  sort_order: number;
  tags: ProductTag[];
  created_at: string;
  updated_at: string;
}

export interface ProductTagGroupListResponse {
  status_code: number;
  message: string;
  data: ProductTagGroup[];
}
