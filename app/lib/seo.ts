const DEFAULT_SITE_URL = "https://nhuacuulongsta.com";

export function getSiteUrl(): string {
  const configuredUrl = process.env.DOMAIN_DEFAULT?.trim() || DEFAULT_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(configuredUrl)
    ? configuredUrl
    : `https://${configuredUrl}`;

  return withProtocol.replace(/\/$/, "");
}

export function createBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
