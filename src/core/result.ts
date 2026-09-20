export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

export function success<T>(data: T): Result<T> {
  return { ok: true, data }
}

export function failure<T = never>(
  error: string,
  fieldErrors?: Record<string, string[]>
): Result<T> {
  return { ok: false, error, fieldErrors }
}

export function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message
  return fallback
}
