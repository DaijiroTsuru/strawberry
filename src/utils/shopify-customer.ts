/// <reference types="../vite-env" />

// Shopify Customer Account API (OAuth 2.0 + PKCE)

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CLIENT_ID;

// --- 型定義 ---

export interface OAuthTokens {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
}

export interface StoredTokens {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_at: number;
}

export interface ShopifyAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
}

export interface AddressInput {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
  phone?: string;
}

export interface ShopifyOrderLineItem {
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
    price: {
      amount: string;
      currencyCode: string;
    };
  } | null;
}

export interface ShopifyOrder {
  id: string;
  number: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  statusPageUrl: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: ShopifyOrderLineItem;
    }>;
  };
}

export interface ShopifyCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  defaultAddress: ShopifyAddress | null;
  addresses: {
    edges: Array<{
      node: ShopifyAddress;
    }>;
  };
  orders: {
    edges: Array<{
      node: ShopifyOrder;
    }>;
  };
}

// --- PKCE ヘルパー関数 ---

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function generateCodeVerifier(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return base64UrlEncode(bytes.buffer);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
}

export function generateState(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return base64UrlEncode(bytes.buffer);
}

export function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return base64UrlEncode(bytes.buffer);
}

// --- OAuth フロー ---

function getShopId(): string {
  if (!SHOPIFY_DOMAIN) throw new Error('VITE_SHOPIFY_STORE_DOMAIN is not set');
  // shop domain: xxx.myshopify.com → shop id: xxx
  return SHOPIFY_DOMAIN.replace('.myshopify.com', '');
}

function getAuthorizationEndpoint(): string {
  const shopId = getShopId();
  return `https://shopify.com/${shopId}/auth/oauth/authorize`;
}

function getTokenEndpoint(): string {
  const shopId = getShopId();
  return `https://shopify.com/${shopId}/auth/oauth/token`;
}

function getLogoutEndpoint(): string {
  const shopId = getShopId();
  return `https://shopify.com/${shopId}/auth/logout`;
}

function getCustomerAccountApiEndpoint(): string {
  const shopId = getShopId();
  return `https://shopify.com/${shopId}/account/customer/api/2025-01/graphql`;
}

export function buildAuthorizationUrl({
  redirectUri,
  state,
  nonce,
  codeChallenge,
}: {
  redirectUri: string;
  state: string;
  nonce: string;
  codeChallenge: string;
}): string {
  if (!CLIENT_ID) throw new Error('VITE_SHOPIFY_CLIENT_ID is not set');

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'openid email customer-account-api:full',
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return `${getAuthorizationEndpoint()}?${params.toString()}`;
}

export async function exchangeCodeForTokens({
  code,
  redirectUri,
  codeVerifier,
}: {
  code: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<OAuthTokens> {
  if (!CLIENT_ID) throw new Error('VITE_SHOPIFY_CLIENT_ID is not set');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    code,
    code_verifier: codeVerifier,
  });

  const response = await fetch(getTokenEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${errorBody}`);
  }

  return response.json();
}

export async function refreshAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<OAuthTokens> {
  if (!CLIENT_ID) throw new Error('VITE_SHOPIFY_CLIENT_ID is not set');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  const response = await fetch(getTokenEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${errorBody}`);
  }

  return response.json();
}

export function buildLogoutUrl({ idToken, postLogoutRedirectUri }: { idToken: string; postLogoutRedirectUri: string }): string {
  const params = new URLSearchParams({
    id_token_hint: idToken,
    post_logout_redirect_uri: postLogoutRedirectUri,
  });
  return `${getLogoutEndpoint()}?${params.toString()}`;
}

// --- Customer Account API GraphQL ---

async function customerAccountFetch<T = any>({
  query,
  variables = {},
  accessToken,
}: {
  query: string;
  variables?: Record<string, any>;
  accessToken: string;
}): Promise<T> {
  const endpoint = getCustomerAccountApiEndpoint();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    throw new Error(`Customer Account API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
}

// 顧客情報取得
export async function fetchCustomerAccount(accessToken: string): Promise<ShopifyCustomer> {
  const query = `
    query {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
        defaultAddress {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          zip
          country
          phoneNumber
        }
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              company
              address1
              address2
              city
              province
              zip
              country
              phoneNumber
            }
          }
        }
        orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              number
              processedAt
              financialStatus
              fulfillmentStatus
              statusPageUrl
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      id
                      title
                      image {
                        url
                        altText
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await customerAccountFetch<{ customer: any }>({ query, accessToken });

  if (!data.customer) {
    throw new Error('顧客情報の取得に失敗しました。再度ログインしてください。');
  }

  // Customer Account API のレスポンスを内部型にマッピング
  const raw = data.customer;
  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.emailAddress?.emailAddress || '',
    phone: raw.phoneNumber?.phoneNumber || null,
    defaultAddress: raw.defaultAddress ? mapAddress(raw.defaultAddress) : null,
    addresses: {
      edges: raw.addresses.edges.map((e: any) => ({
        node: mapAddress(e.node),
      })),
    },
    orders: {
      edges: raw.orders.edges.map((e: any) => ({
        node: mapOrder(e.node),
      })),
    },
  };
}

function mapAddress(raw: any): ShopifyAddress {
  return {
    id: raw.id,
    firstName: raw.firstName || null,
    lastName: raw.lastName || null,
    company: raw.company || null,
    address1: raw.address1 || null,
    address2: raw.address2 || null,
    city: raw.city || null,
    province: raw.province || null,
    zip: raw.zip || null,
    country: raw.country || null,
    phone: raw.phoneNumber || null,
  };
}

function mapOrder(raw: any): ShopifyOrder {
  return {
    id: raw.id,
    number: raw.number,
    processedAt: raw.processedAt,
    financialStatus: raw.financialStatus,
    fulfillmentStatus: raw.fulfillmentStatus,
    statusPageUrl: raw.statusPageUrl,
    totalPrice: raw.totalPrice,
    lineItems: {
      edges: raw.lineItems.edges.map((e: any) => ({
        node: {
          title: e.node.title,
          quantity: e.node.quantity,
          variant: e.node.variant
            ? {
                id: e.node.variant.id,
                title: e.node.variant.title,
                image: e.node.variant.image,
                price: e.node.variant.price,
              }
            : null,
        },
      })),
    },
  };
}

// プロフィール更新
export async function updateCustomerProfile(
  accessToken: string,
  input: { firstName?: string; lastName?: string; email?: string; phone?: string }
): Promise<void> {
  const query = `
    mutation customerUpdate($input: CustomerUpdateInput!) {
      customerUpdate(input: $input) {
        customer {
          id
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

  const customerInput: Record<string, any> = {};
  if (input.firstName !== undefined) customerInput.firstName = input.firstName;
  if (input.lastName !== undefined) customerInput.lastName = input.lastName;

  const data = await customerAccountFetch<{ customerUpdate: any }>({
    query,
    variables: { input: customerInput },
    accessToken,
  });

  const result = data.customerUpdate;
  if (result.userErrors && result.userErrors.length > 0) {
    throw new Error(result.userErrors[0].message);
  }
}

// 住所作成
export async function createCustomerAddress(
  accessToken: string,
  address: AddressInput
): Promise<void> {
  const query = `
    mutation customerAddressCreate($address: CustomerAddressInput!) {
      customerAddressCreate(address: $address) {
        customerAddress {
          id
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

  const data = await customerAccountFetch<{ customerAddressCreate: any }>({
    query,
    variables: { address: mapAddressInput(address) },
    accessToken,
  });

  const result = data.customerAddressCreate;
  if (result.userErrors && result.userErrors.length > 0) {
    throw new Error(result.userErrors[0].message);
  }
}

// 住所更新
export async function updateCustomerAddress(
  accessToken: string,
  addressId: string,
  address: AddressInput
): Promise<void> {
  const query = `
    mutation customerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!) {
      customerAddressUpdate(addressId: $addressId, address: $address) {
        customerAddress {
          id
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

  const data = await customerAccountFetch<{ customerAddressUpdate: any }>({
    query,
    variables: { addressId, address: mapAddressInput(address) },
    accessToken,
  });

  const result = data.customerAddressUpdate;
  if (result.userErrors && result.userErrors.length > 0) {
    throw new Error(result.userErrors[0].message);
  }
}

// 住所削除
export async function deleteCustomerAddress(
  accessToken: string,
  addressId: string
): Promise<void> {
  const query = `
    mutation customerAddressDelete($addressId: ID!) {
      customerAddressDelete(addressId: $addressId) {
        deletedAddressId
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

  const data = await customerAccountFetch<{ customerAddressDelete: any }>({
    query,
    variables: { addressId },
    accessToken,
  });

  const result = data.customerAddressDelete;
  if (result.userErrors && result.userErrors.length > 0) {
    throw new Error(result.userErrors[0].message);
  }
}

// デフォルト住所設定
export async function setDefaultAddress(
  accessToken: string,
  addressId: string
): Promise<void> {
  const query = `
    mutation customerDefaultAddressUpdate($addressId: ID!) {
      customerDefaultAddressUpdate(addressId: $addressId) {
        customer {
          id
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

  const data = await customerAccountFetch<{ customerDefaultAddressUpdate: any }>({
    query,
    variables: { addressId },
    accessToken,
  });

  const result = data.customerDefaultAddressUpdate;
  if (result.userErrors && result.userErrors.length > 0) {
    throw new Error(result.userErrors[0].message);
  }
}

function mapAddressInput(input: AddressInput): Record<string, any> {
  const mapped: Record<string, any> = {};
  if (input.firstName !== undefined) mapped.firstName = input.firstName;
  if (input.lastName !== undefined) mapped.lastName = input.lastName;
  if (input.company !== undefined) mapped.company = input.company;
  if (input.address1 !== undefined) mapped.address1 = input.address1;
  if (input.address2 !== undefined) mapped.address2 = input.address2;
  if (input.city !== undefined) mapped.city = input.city;
  if (input.province !== undefined) mapped.province = input.province;
  if (input.zip !== undefined) mapped.zip = input.zip;
  if (input.country !== undefined) mapped.country = input.country;
  if (input.phone !== undefined) mapped.phoneNumber = input.phone;
  return mapped;
}
