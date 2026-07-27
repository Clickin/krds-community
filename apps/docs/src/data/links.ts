/**
 * Build an internal docs URL without dropping Astro's configured base path.
 * `path` may be `/components/` or `components/`; the result always has one
 * leading base and one trailing slash where the input represents a directory.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}${normalizedPath}`;
}
