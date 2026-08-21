export interface PageFile {
  id: number;
  title?: string | null;
  file_name?: string | null;
  disk?: string | null;
  path?: string | null;
  external_url?: string | null;
  mime_type?: string | null;
  size?: number | null;
  type?: string | null;
  sort_order?: number;
  created_at?: string | null;
}

export interface PageSectionItem {
  id: number;
  page_section_id: number;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  sort_order: number;
  files?: PageFile[];
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PageSection {
  id: number;
  page_content_id: number;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  sort_order: number;
  files?: PageFile[];
  items?: PageSectionItem[];
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PageContent {
  id: number;
  slug: string;
  title: string;
  sections: PageSection[];
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PageContentResponse {
  status_code: number;
  message: string;
  data: PageContent;
}
