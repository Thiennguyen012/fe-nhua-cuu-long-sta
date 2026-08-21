export interface PageConfigSocials {
  facebook?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  zalo?: string | null;
  [platform: string]: string | null | undefined;
}

export interface PageConfig {
  id: number;
  company_name: string;
  slogan: string | null;
  description: string | null;
  addresses: string[];
  hotline: string;
  email?: string | null;
  working_hour: string;
  map_url?: string | null;
  socials: PageConfigSocials;
  favicon_path: string | null;
  logo_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageConfigResponse {
  status_code: number;
  message: string;
  data: PageConfig;
}
