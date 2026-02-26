
//export const BASE_URL = 'http://localhost:3001/api/v1';
export const BASE_URL = 'http://localhost:3001/api/v1';

export class ApiError extends Error {
  readonly status: number;
  readonly body?: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  isFormData?: boolean;
}

export async function apiClient<T = unknown>(
  path: string,
  { body, isFormData = false, ...init }: RequestOptions = {},
): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = new Headers(init.headers);

  if (token) headers.set('Authorization', `Bearer ${token}`);

  let serializedBody: BodyInit | undefined;
  if (body !== undefined) {
    if (isFormData && body instanceof FormData) {
      serializedBody = body;
    } else {
      headers.set('Content-Type', 'application/json');
      serializedBody = JSON.stringify(body);
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    body: serializedBody,
  });

  if (response.status === 204) return {} as T;

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    const message = String(
      (json as Record<string, unknown>)?.message ||
      (json as Record<string, unknown>)?.error ||
      `Erro ${response.status}: ${response.statusText}`
    );
    throw new ApiError(response.status, message, json);
  }

  return json as T;
}