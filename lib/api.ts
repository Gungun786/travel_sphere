export interface OptimizeTraveler {
  budget_max: number;
  date_start: number;
  date_end: number;
  interests: string[];
}

export interface OptimizeDestination {
  cost: number;
  avail_start: number;
  avail_end: number;
  tags: string[];
}

export interface OptimizeRequest {
  travelers: Record<string, OptimizeTraveler>;
  destinations?: Record<string, OptimizeDestination>;
}

interface OptimizeErrorDetail {
  loc?: unknown;
  msg?: string;
}

export interface OptimizeResult {
  chosen: string | null;
  cost: number | null;
  match_score: number | null;
  reason: string | null;
  explanation: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

let backendToken: { value: string; expiresAt: number } | null = null;

async function getBackendToken(): Promise<string> {
  if (backendToken && backendToken.expiresAt > Date.now() + 30_000) {
    return backendToken.value;
  }

  const response = await fetch('/api/backend-token');
  if (response.status === 401) {
    window.location.assign('/login');
    throw new Error('Authentication required.');
  }

  if (!response.ok) {
    throw new Error(`Backend token request failed with HTTP ${response.status}.`);
  }

  const body = (await response.json()) as { token?: string; expiresIn?: number };
  if (!body.token) {
    throw new Error('Backend token response was invalid.');
  }

  backendToken = {
    value: body.token,
    expiresAt: Date.now() + (body.expiresIn ?? 300) * 1000,
  };
  return body.token;
}

export async function optimizeTrip(
  payload?: OptimizeRequest
): Promise<OptimizeResult> {
  const token = await getBackendToken();
  const response = await fetch(`${API_URL}/api/optimize`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(payload ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  });

  let body: OptimizeResult | {
    detail?: string | OptimizeErrorDetail[];
  };

  try {
    body = (await response.json()) as OptimizeResult | {
      detail?: string | OptimizeErrorDetail[];
    };
  } catch {
    throw new Error(
      `Backend request failed with HTTP ${response.status}.`
    );
  }

  if (!response.ok) {
    const rawDetail = 'detail' in body ? body.detail : undefined;
    const detail = Array.isArray(rawDetail)
      ? rawDetail
          .map((item) => {
            const location = Array.isArray(item.loc)
              ? item.loc.join('.')
              : String(item.loc ?? 'error');
            return `${location}: ${item.msg ?? 'Request validation failed'}`;
          })
          .join('; ')
      : rawDetail || `Backend request failed with HTTP ${response.status}.`;

    throw new Error(detail);
  }

  return body as OptimizeResult;
}

export function optimizeStoredTrip(): Promise<OptimizeResult> {
  return optimizeTrip();
}