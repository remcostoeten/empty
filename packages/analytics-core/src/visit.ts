import { nanoid } from "nanoid";

const VISIT_KEY = "__analytics_visit_id";
const VISIT_TTL = 30 * 60 * 1000; // 30 minutes

export function getVisitId(): string {
  if (typeof window === "undefined") return nanoid(10);

  try {
    const raw = window.localStorage.getItem(VISIT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { id: string; expires: number };
      if (parsed?.id && parsed.expires > Date.now()) {
        return parsed.id;
      }
    }

    const id = nanoid(12);
    const expires = Date.now() + VISIT_TTL;
    window.localStorage.setItem(VISIT_KEY, JSON.stringify({ id, expires }));
    return id;
  } catch (error) {
    console.warn("Unable to read visit id", error);
    return nanoid(12);
  }
}
