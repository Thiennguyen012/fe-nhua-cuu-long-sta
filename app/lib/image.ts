const DIRECT_IMAGE_HOSTS = new Set([
  "admin.nhuacuulongsta.com",
  "localhost",
  "127.0.0.1",
]);

export function shouldBypassImageOptimization(source: string): boolean {
  try {
    return DIRECT_IMAGE_HOSTS.has(new URL(source).hostname);
  } catch {
    return false;
  }
}
