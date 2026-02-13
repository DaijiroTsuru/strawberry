import { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { CartProvider } from '@/app/contexts/CartContext';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { router } from '@/app/router';

export default function App() {
  useEffect(() => {
    const unsubscribe = router.subscribe('onResolved', () => {
      window.scrollTo(0, 0);
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