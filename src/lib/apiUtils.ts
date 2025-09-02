// lib/utils.ts
import { getItem } from './localStorageControl';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiOptions {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

const BASE_URL = 'http://ecom-backend.thepublicpoints.com/api/v1'

export async function apiCall<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    params
  } = options;

  // Build query params if present
  const queryString = params
    ? '?' + new URLSearchParams(params).toString()
    : '';

  const url = `${BASE_URL}${endpoint}${queryString}`;

  const accessToken = getItem('accessToken');

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${res.status}`);
  }

  return res.json();
}
