/**
 * GA4に送るページパスを正規化する。
 *
 * GitHub Pages は /strawberries/ を配信し、TanStack Router は /strawberries を
 * 積むため、正規化しないと同一ページが2行に分裂して計上される。
 */
export function normalizePath(pathname: string): string {
  if (!pathname) return '/';

  let path = pathname.startsWith('/') ? pathname : `/${pathname}`;

  if (path.endsWith('/index.html')) {
    path = path.slice(0, -'index.html'.length);
  }

  path = path.replace(/\/{2,}/g, '/');

  if (path.length > 1) {
    path = path.replace(/\/+$/, '');
  }

  return path || '/';
}
