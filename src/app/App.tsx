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
    // 'onResolved' はハッシュリンク（例: /#about）のクリックや、パスは同じで
    // クエリだけが変わるナビゲーション（例: /mypage?tab=profile への
    // タブ切り替え）でも発火する。ガードはパス単体ではなく「パス+検索文字列」
    // をキーにする: ハッシュのみの変化は抑止しつつ、クエリのみの変化は
    // 新しいページビューとして正しく計上するため。
    let lastTrackedKey: string | null = null;

    const unsubscribe = router.subscribe('onResolved', () => {
      window.scrollTo(0, 0);

      // ここで正規化したパスをガードのキー生成とtrackPageView呼び出しの
      // 両方に使う。trackPageView内部でも同じパスを再度正規化するが、
      // normalizePathは冪等なので二重呼び出しは無害（意図的な設計）。
      const currentPath = normalizePath(window.location.pathname);
      const currentKey = currentPath + window.location.search;
      if (currentKey === lastTrackedKey) return;
      lastTrackedKey = currentKey;
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