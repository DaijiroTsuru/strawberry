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
      // ここではtry/catchで囲まない: @tanstack/router-coreのRouter#emitは
      // 購読者ごとにtry/catchで包んで呼び出すため、このリスナー内で例外が
      // 発生してもemit自体はもみ消し、他の購読者やアプリ全体には伝播しない。
      // ルーターの内部実装への依存であり将来のバージョンアップで変わり得るため、
      // 変更時はここも再確認すること。
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