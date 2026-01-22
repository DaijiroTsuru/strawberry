import { RouterProvider } from '@tanstack/react-router';
import { CartProvider } from '@/app/contexts/CartContext';
import { router } from '@/app/router';

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}