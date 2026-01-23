import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createCart,
  addToCart as addToCartAPI,
  updateCartLine,
  removeFromCart as removeFromCartAPI,
  getCart,
  ShopifyCart,
} from '@/utils/shopify';

interface CartContextType {
  cart: ShopifyCart | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (merchandiseId: string, quantity?: number) => Promise<void>;
  buyNow: (merchandiseId: string, quantity?: number) => Promise<string>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ローカルストレージからカートIDを取得
  useEffect(() => {
    const loadCart = async () => {
      const cartId = localStorage.getItem('shopify_cart_id');
      if (cartId) {
        try {
          const cartData = await getCart(cartId);
          setCart(cartData);
        } catch (err) {
          console.error('Failed to load cart:', err);
          localStorage.removeItem('shopify_cart_id');
        }
      }
    };
    loadCart();
  }, []);

  const addToCart = async (merchandiseId: string, quantity: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      let cartId = cart?.id;

      // カートがない場合は新規作成
      if (!cartId) {
        const newCart = await createCart();
        cartId = newCart.id;
        if (cartId) {
          localStorage.setItem('shopify_cart_id', cartId);
        }
      }

      if (!cartId) {
        throw new Error('カートの作成に失敗しました');
      }

      // カートに商品を追加
      const updatedCart = await addToCartAPI(cartId, merchandiseId, quantity);
      setCart(updatedCart);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'カートへの追加に失敗しました';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const buyNow = async (merchandiseId: string, quantity: number = 1): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // 新しいカートを作成
      const newCart = await createCart();
      const cartId = newCart.id;
      
      if (!cartId) {
        throw new Error('カートの作成に失敗しました');
      }

      // 商品を追加
      const updatedCart = await addToCartAPI(cartId, merchandiseId, quantity);
      
      // カートIDを保存（途中離脱対応）
      localStorage.setItem('shopify_cart_id', cartId);
      setCart(updatedCart);

      // チェックアウトURLを返す
      return updatedCart.checkoutUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '購入処理に失敗しました';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedCart = await updateCartLine(cart.id, lineId, quantity);
      setCart(updatedCart);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '数量の更新に失敗しました';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cart) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedCart = await removeFromCartAPI(cart.id, [lineId]);
      setCart(updatedCart);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '商品の削除に失敗しました';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addToCart,
        buyNow,
        updateQuantity,
        removeItem,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
