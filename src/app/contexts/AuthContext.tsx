import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  generateNonce,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  buildLogoutUrl,
  fetchCustomerAccount,
  updateCustomerProfile as updateProfileAPI,
  createCustomerAddress as createAddressAPI,
  updateCustomerAddress as updateAddressAPI,
  deleteCustomerAddress as deleteAddressAPI,
  setDefaultAddress as setDefaultAddressAPI,
  ShopifyCustomer,
  AddressInput,
  StoredTokens,
} from '@/utils/shopify-customer';

const TOKEN_STORAGE_KEY = 'shopify_customer_tokens';
const PKCE_STORAGE_KEY = 'shopify_pkce_params';

interface PKCEParams {
  codeVerifier: string;
  state: string;
  nonce: string;
  redirectUri: string;
}

interface AuthContextType {
  customer: ShopifyCustomer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initiateLogin: () => Promise<void>;
  handleAuthCallback: (code: string, state: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (input: { firstName?: string; lastName?: string; email?: string; phone?: string }) => Promise<void>;
  refreshCustomer: () => Promise<void>;
  createAddress: (address: AddressInput) => Promise<void>;
  updateAddress: (id: string, address: AddressInput) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredTokens(): StoredTokens | null {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }
}

function storeTokens(tokens: StoredTokens): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

function removeTokens(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function isTokenExpired(expiresAt: number): boolean {
  return expiresAt <= Date.now();
}

function shouldRefreshToken(expiresAt: number): boolean {
  // 5分前にリフレッシュ
  return expiresAt - Date.now() < 5 * 60 * 1000;
}

function getRedirectUri(): string {
  return `${window.location.origin}/auth/callback`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!customer;

  const getValidAccessToken = useCallback(async (): Promise<string> => {
    const stored = getStoredTokens();
    if (!stored) {
      throw new Error('セッションが見つかりません。再度ログインしてください。');
    }

    if (isTokenExpired(stored.expires_at)) {
      // リフレッシュを試みる
      try {
        const newTokens = await refreshAccessToken({ refreshToken: stored.refresh_token });
        const updated: StoredTokens = {
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token,
          id_token: newTokens.id_token,
          expires_at: Date.now() + newTokens.expires_in * 1000,
        };
        storeTokens(updated);
        return updated.access_token;
      } catch {
        removeTokens();
        setCustomer(null);
        throw new Error('セッションが期限切れです。再度ログインしてください。');
      }
    }

    if (shouldRefreshToken(stored.expires_at)) {
      // バックグラウンドでリフレッシュ
      refreshAccessToken({ refreshToken: stored.refresh_token })
        .then((newTokens) => {
          const updated: StoredTokens = {
            access_token: newTokens.access_token,
            refresh_token: newTokens.refresh_token,
            id_token: newTokens.id_token,
            expires_at: Date.now() + newTokens.expires_in * 1000,
          };
          storeTokens(updated);
        })
        .catch(() => {});
    }

    return stored.access_token;
  }, []);

  // マウント時: トークン読み込み → 顧客情報取得
  useEffect(() => {
    const init = async () => {
      const stored = getStoredTokens();
      if (!stored) {
        setIsLoading(false);
        return;
      }

      if (isTokenExpired(stored.expires_at)) {
        // リフレッシュを試みる
        try {
          const newTokens = await refreshAccessToken({ refreshToken: stored.refresh_token });
          const updated: StoredTokens = {
            access_token: newTokens.access_token,
            refresh_token: newTokens.refresh_token,
            id_token: newTokens.id_token,
            expires_at: Date.now() + newTokens.expires_in * 1000,
          };
          storeTokens(updated);
          const customerData = await fetchCustomerAccount(updated.access_token);
          setCustomer(customerData);
        } catch {
          removeTokens();
        }
        setIsLoading(false);
        return;
      }

      try {
        const customerData = await fetchCustomerAccount(stored.access_token);
        setCustomer(customerData);
      } catch (err) {
        // 401 なら refresh を試みる
        if (err instanceof Error && err.message === 'UNAUTHORIZED') {
          try {
            const newTokens = await refreshAccessToken({ refreshToken: stored.refresh_token });
            const updated: StoredTokens = {
              access_token: newTokens.access_token,
              refresh_token: newTokens.refresh_token,
              id_token: newTokens.id_token,
              expires_at: Date.now() + newTokens.expires_in * 1000,
            };
            storeTokens(updated);
            const customerData = await fetchCustomerAccount(updated.access_token);
            setCustomer(customerData);
          } catch {
            removeTokens();
          }
        } else {
          console.error('Failed to restore session:', err);
          removeTokens();
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const initiateLogin = useCallback(async () => {
    setError(null);
    try {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateState();
      const nonce = generateNonce();
      const redirectUri = getRedirectUri();

      // PKCE パラメータを sessionStorage に保存
      const pkceParams: PKCEParams = { codeVerifier, state, nonce, redirectUri };
      sessionStorage.setItem(PKCE_STORAGE_KEY, JSON.stringify(pkceParams));

      const authUrl = buildAuthorizationUrl({
        redirectUri,
        state,
        nonce,
        codeChallenge,
      });

      window.location.href = authUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ログインの開始に失敗しました';
      setError(message);
    }
  }, []);

  const handleAuthCallback = useCallback(async (code: string, state: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // PKCE パラメータを sessionStorage から取得
      const raw = sessionStorage.getItem(PKCE_STORAGE_KEY);
      if (!raw) {
        throw new Error('認証パラメータが見つかりません。再度ログインしてください。');
      }
      const pkceParams: PKCEParams = JSON.parse(raw);
      sessionStorage.removeItem(PKCE_STORAGE_KEY);

      // state を検証
      if (state !== pkceParams.state) {
        throw new Error('認証に失敗しました。不正なリクエストです。');
      }

      // トークン交換
      const tokens = await exchangeCodeForTokens({
        code,
        redirectUri: pkceParams.redirectUri,
        codeVerifier: pkceParams.codeVerifier,
      });

      // トークン保存
      const storedTokens: StoredTokens = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        id_token: tokens.id_token,
        expires_at: Date.now() + tokens.expires_in * 1000,
      };
      storeTokens(storedTokens);

      // 顧客情報取得
      const customerData = await fetchCustomerAccount(tokens.access_token);
      setCustomer(customerData);
    } catch (err) {
      const message = err instanceof Error ? err.message : '認証に失敗しました';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const stored = getStoredTokens();
    removeTokens();
    setCustomer(null);
    setError(null);

    if (stored?.id_token) {
      const logoutUrl = buildLogoutUrl({
        idToken: stored.id_token,
        postLogoutRedirectUri: window.location.origin,
      });
      window.location.href = logoutUrl;
    }
  }, []);

  const updateProfile = useCallback(async (input: { firstName?: string; lastName?: string; email?: string; phone?: string }) => {
    setError(null);
    try {
      const accessToken = await getValidAccessToken();
      await updateProfileAPI(accessToken, input);
      const customerData = await fetchCustomerAccount(accessToken);
      setCustomer(customerData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'プロフィールの更新に失敗しました';
      setError(message);
      throw err;
    }
  }, [getValidAccessToken]);

  const refreshCustomer = useCallback(async () => {
    try {
      const accessToken = await getValidAccessToken();
      const customerData = await fetchCustomerAccount(accessToken);
      setCustomer(customerData);
    } catch (err) {
      console.error('Failed to refresh customer:', err);
    }
  }, [getValidAccessToken]);

  const createAddress = useCallback(async (address: AddressInput) => {
    setError(null);
    try {
      const accessToken = await getValidAccessToken();
      await createAddressAPI(accessToken, address);
      const customerData = await fetchCustomerAccount(accessToken);
      setCustomer(customerData);
    } catch (err) {
      const message = err instanceof Error ? err.message : '住所の追加に失敗しました';
      setError(message);
      throw err;
    }
  }, [getValidAccessToken]);

  const updateAddress = useCallback(async (id: string, address: AddressInput) => {
    setError(null);
    try {
      const accessToken = await getValidAccessToken();
      await updateAddressAPI(accessToken, id, address);
      const customerData = await fetchCustomerAccount(accessToken);
      setCustomer(customerData);
    } catch (err) {
      const message = err instanceof Error ? err.message : '住所の更新に失敗しました';
      setError(message);
      throw err;
    }
  }, [getValidAccessToken]);

  const deleteAddress = useCallback(async (id: string) => {
    setError(null);
    try {
      const accessToken = await getValidAccessToken();
      await deleteAddressAPI(accessToken, id);
      const customerData = await fetchCustomerAccount(accessToken);
      setCustomer(customerData);
    } catch (err) {
      const message = err instanceof Error ? err.message : '住所の削除に失敗しました';
      setError(message);
      throw err;
    }
  }, [getValidAccessToken]);

  const setDefaultAddr = useCallback(async (addressId: string) => {
    setError(null);
    try {
      const accessToken = await getValidAccessToken();
      await setDefaultAddressAPI(accessToken, addressId);
      const customerData = await fetchCustomerAccount(accessToken);
      setCustomer(customerData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'デフォルト住所の設定に失敗しました';
      setError(message);
      throw err;
    }
  }, [getValidAccessToken]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        customer,
        isAuthenticated,
        isLoading,
        error,
        initiateLogin,
        handleAuthCallback,
        logout,
        updateProfile,
        refreshCustomer,
        createAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress: setDefaultAddr,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
