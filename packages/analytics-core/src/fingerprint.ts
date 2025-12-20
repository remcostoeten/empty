import { nanoid } from "nanoid";

/**
 * Lightweight, privacy aware fingerprint placeholder.
 * In production apps this value should be generated on the server so that
 * IP addresses are hashed and never reach the client bundle. The client keeps
 * the hook so that analytics-core can accept the value and forward it.
 */
export function getClientFingerprint(projectId: string): string {
  if (typeof crypto === "undefined" || typeof navigator === "undefined") {
    return nanoid(10);
  }

  const ua = navigator.userAgent || "unknown";
  const language = navigator.language || "und";
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const seed = `${projectId}:${ua}:${language}:${timeZone}`;

  return compactHash(seed);
}

function compactHash(value: string): string {
  if (typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }

  if (typeof crypto?.getRandomValues === "function") {
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  return nanoid(16);
}
