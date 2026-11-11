/**
 * Kisan Suvidha Universal API Client
 * Connects frontend to the Python Django REST Framework backend.
 * Provides automatic token injection, timeout handling, and graceful offline fallback.
 */

// Default backend API URL. Can be overridden in .env via VITE_API_URL
export const API_BASE_URL = 
  (import.meta as any).env?.VITE_API_URL || 
  'http://127.0.0.1:8000/api';

const TOKEN_STORAGE_KEY = 'kisan_django_token';

export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {}
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {}
  }
};

let isBackendOnline: boolean | null = null;
let lastHealthCheckTime = 0;

/**
 * Checks whether the Django REST API server is running on localhost:8000
 */
export async function checkBackendHealth(): Promise<{ online: boolean; details?: any }> {
  const now = Date.now();
  // Cache check for 10 seconds to prevent unnecessary network polling
  if (isBackendOnline !== null && now - lastHealthCheckTime < 10000) {
    return { online: isBackendOnline };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

    const resp = await fetch(`${API_BASE_URL}/health/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (resp.ok) {
      const data = await resp.json();
      isBackendOnline = true;
      lastHealthCheckTime = now;
      return { online: true, details: data };
    }
    isBackendOnline = false;
    lastHealthCheckTime = now;
    return { online: false };
  } catch (err) {
    isBackendOnline = false;
    lastHealthCheckTime = now;
    return { online: false };
  }
}

/**
 * Executes an HTTP request to the Django backend
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; status?: number; fromBackend: boolean }> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = tokenStorage.get();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    isBackendOnline = true;
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMsg = typeof data === 'object' && data !== null
        ? (data.error || (data.errors ? JSON.stringify(data.errors) : response.statusText))
        : response.statusText;
      return {
        success: false,
        error: errorMsg,
        data: data as T,
        status: response.status,
        fromBackend: true
      };
    }

    return {
      success: true,
      data: data as T,
      status: response.status,
      fromBackend: true
    };
  } catch (err: any) {
    isBackendOnline = false;
    return {
      success: false,
      error: err.name === 'AbortError' ? 'Connection timed out' : 'Django server offline or unreachable on localhost:8000',
      fromBackend: false
    };
  }
}
