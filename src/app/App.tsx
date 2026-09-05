import { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { CartProvider } from '@/app/contexts/CartContext';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { router } from '@/app/router';
import { trackPageView } from '@/utils/analytics';
import { normalizePath } from '@/utils/analytics/paths';

export default function App() {
  useEffect(() => {
    // TanStack Router の 'onResolved' は初回表示のルート解決でも発火するため、
    // ここで別途初回分を送信すると page_view が2重に計上される。
    // このイベント購読だけで初回表示・ルート遷移の両方をカバーする。
    //
    // 'onResolved' はハッシュリンク（例: /#about）のクリックでも発火するが、
    // パス自体は変わっていないため、直前に送信したパスと同じ場合は送信しない。
    let lastTrackedPath: string | null = null;

    const unsubscribe = router.subscribe('onResolved', () => {
      window.scrollTo(0, 0);

      const currentPath = normalizePath(window.location.pathname);
      if (currentPath === lastTrackedPath) return;
      lastTrackedPath = currentPath;
      trackPageView(currentPath);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}