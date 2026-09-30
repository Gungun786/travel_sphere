export interface OptimizeResult {
  chosen: string | null;
  cost: number | null;
  match_score: number | null;
  reason: string | null;
  explanation: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export async function optimizeStoredTrip(): Promise<OptimizeResult> {
  const response = await fetch(`${API_URL}/api/optimize`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  const body = (await response.json()) as
    | OptimizeResult
    | { detail?: string };

  if (!response.ok) {
    const detail =
      'detail' in body && body.detail
        ? body.detail
        : `Backend request failed with HTTP ${response.status}.`;

    throw new Error(detail);
  }

  return body as OptimizeResult;
}