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
  vetoedDestinations?: string[];
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

export interface CreateTripMember {
  name: string;
  budget_per_person: number;
  interests: string[];
}

export interface CreateTripRequest {
  name: string;
  destination: string | null;
  decide_later: boolean;
  date_start: string;
  date_end: string;
  budget_total: number;
  optimizer_result: OptimizeResult | null;
  members: CreateTripMember[];
}

export interface UpdateTripRequest {
  optimizer_result: OptimizeResult | null;
}

export interface ApiTripMember extends CreateTripMember {
  id: number;
}

export interface ApiTrip {
  id: number;
  name: string;
  destination: string | null;
  decide_later: boolean;
  date_start: string;
  date_end: string;
  budget_total: number;
  optimizer_result: OptimizeResult | null;
  created_at: string;
  members: ApiTripMember[];
}

export interface ApiTopPlace {
  name: string;
  note: string;
}

export interface ApiPlace {
  id: number;
  name: string;
  category: string;
  description: string;
  avg_hours: number;
  entry_cost: number;
  lat: number | null;
  lon: number | null;
  source_note: string | null;
  verified: boolean;
}

export interface ApiDestination {
  name: string;
  slug: string | null;
  state: string | null;
  description: string | null;
  best_season: string | null;
  top_places: ApiTopPlace[];
  daily_budget_min: number | null;
  daily_budget_max: number | null;
  image_url: string | null;
  best_months: number[];
  avoid_months: number[];
  aliases: string[];
  lat: number | null;
  lon: number | null;
  verified: boolean;
  source_note: string | null;
  places: ApiPlace[];
  cost: number;
  avail_start: number;
  avail_end: number;
  tags: string[];
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

async function backendRequest(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = await getBackendToken();
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(`${API_URL}${path}`, { ...init, headers });
}

async function readBackendBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new Error(`Backend request failed with HTTP ${response.status}.`);
  }
}

function getBackendError(
  body: unknown,
  status: number
): string {
  const rawDetail =
    typeof body === 'object' && body !== null && 'detail' in body
      ? body.detail
      : undefined;
  if (Array.isArray(rawDetail)) {
    return rawDetail
      .map((item) => {
        const detail = item as OptimizeErrorDetail;
        const location = Array.isArray(detail.loc)
          ? detail.loc.join('.')
          : String(detail.loc ?? 'error');
        return `${location}: ${detail.msg ?? 'Request validation failed'}`;
      })
      .join('; ');
  }
  return typeof rawDetail === 'string'
    ? rawDetail
    : `Backend request failed with HTTP ${status}.`;
}

export async function optimizeTrip(
  payload?: OptimizeRequest
): Promise<OptimizeResult> {
  const requestPayload = payload
    ? {
        ...payload,
        ...(payload.vetoedDestinations
          ? { vetoed_destinations: payload.vetoedDestinations }
          : {}),
      }
    : undefined;
  const response = await backendRequest('/api/optimize', {
    method: 'POST',
    ...(requestPayload ? { body: JSON.stringify(requestPayload) } : {}),
  });

  const body = (await readBackendBody(response)) as OptimizeResult;

  if (!response.ok) {
    throw new Error(getBackendError(body, response.status));
  }

  return body as OptimizeResult;
}

export function optimizeStoredTrip(): Promise<OptimizeResult> {
  return optimizeTrip();
}

export async function createTrip(
  payload: CreateTripRequest
): Promise<ApiTrip> {
  const response = await backendRequest('/api/trips', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const body = await readBackendBody(response);
  if (!response.ok) {
    throw new Error(getBackendError(body, response.status));
  }
  return body as ApiTrip;
}

export async function listTrips(): Promise<ApiTrip[]> {
  const response = await backendRequest('/api/trips');
  const body = await readBackendBody(response);
  if (!response.ok) {
    throw new Error(getBackendError(body, response.status));
  }
  return body as ApiTrip[];
}

export async function listDestinations(): Promise<ApiDestination[]> {
  const response = await backendRequest('/api/destinations');
  const body = await readBackendBody(response);
  if (!response.ok) {
    throw new Error(getBackendError(body, response.status));
  }
  return body as ApiDestination[];
}

export async function getDestination(slug: string): Promise<ApiDestination> {
  const response = await backendRequest(`/api/destinations/${encodeURIComponent(slug)}`);
  const body = await readBackendBody(response);
  if (!response.ok) {
    throw new Error(getBackendError(body, response.status));
  }
  return body as ApiDestination;
}

export async function getTrip(tripId: string): Promise<ApiTrip> {
  const response = await backendRequest(`/api/trips/${encodeURIComponent(tripId)}`);
  const body = await readBackendBody(response);
  if (!response.ok) {
    const error = new Error(getBackendError(body, response.status));
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }
  return body as ApiTrip;
}

export async function updateTrip(
  tripId: string,
  payload: UpdateTripRequest
): Promise<ApiTrip> {
  const response = await backendRequest(`/api/trips/${encodeURIComponent(tripId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  const body = await readBackendBody(response);
  if (!response.ok) {
    throw new Error(getBackendError(body, response.status));
  }
  return body as ApiTrip;
}