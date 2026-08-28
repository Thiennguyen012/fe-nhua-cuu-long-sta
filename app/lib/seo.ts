const DEFAULT_SITE_URL = "https://nhuacuulongsta.com";

export function getSiteUrl(): string {
  const configuredUrl = process.env.DOMAIN_DEFAULT?.trim() || DEFAULT_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(configuredUrl)
    ? configuredUrl
    : `https://${configuredUrl}`;

  return withProtocol.replace(/\/$/, "");
}
