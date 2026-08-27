export interface PageConfigSocials {
  facebook?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  zalo?: string | null;
  [platform: string]: string | null | undefined;
}

export interface PageConfig {
  id: number;
  company_name?: string | null;
  slogan?: string | null;
  description?: string | null;
  addresses?: string[] | null;
  hotline?: string | null;
  email?: string | null;
  working_hour?: string | null;
  map_url?: string | null;
  socials?: PageConfigSocials | null;
  favicon_path?: string | null;
  logo_path?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PageConfigResponse {
  status_code: number;
  message: string;
  data: PageConfig;
}
