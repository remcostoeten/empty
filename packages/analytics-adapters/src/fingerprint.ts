import { createHash, randomBytes } from "crypto";

export interface FingerprintInput {
  headers: Headers | Record<string, string | undefined>;
  projectId: string;
  secret: string;
  /**
   * Rotate fingerprints automatically by epoch window (in minutes).
   * Defaults to 7 days to align with privacy expectations.
   */
  rotationMinutes?: number;
}

function readHeader(headers: Headers | Record<string, string | undefined>, key: string) {
  if (headers instanceof Headers) {
    return headers.get(key) ?? undefined;
  }
  const found = Object.entries(headers).find(
    ([candidate]) => candidate.toLowerCase() === key.toLowerCase()
  );
  return found?.[1];
}

function clientIp(headers: Headers | Record<string, string | undefined>) {
  const forwarded = readHeader(headers, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  const realIp =
    readHeader(headers, "x-real-ip") ??
    readHeader(headers, "cf-connecting-ip") ??
    readHeader(headers, "fly-client-ip");
  return realIp ?? undefined;
}

export function deriveFingerprint(input: FingerprintInput): string {
  const { projectId, secret } = input;
  const rotationMinutes = input.rotationMinutes ?? 60 * 24 * 7;
  const window = Math.floor(Date.now() / (rotationMinutes * 60 * 1000));

  const ua = readHeader(input.headers, "user-agent") ?? "unknown";
  const accept = readHeader(input.headers, "accept") ?? "*/*";
  const language = readHeader(input.headers, "accept-language") ?? "und";
  const ip = clientIp(input.headers) ?? randomBytes(8).toString("hex");

  const hash = createHash("sha256");
  hash.update(secret);
  hash.update(projectId);
  hash.update(String(window));
  hash.update(ua);
  hash.update(accept);
  hash.update(language);
  hash.update(ip);

  return hash.digest("hex").slice(0, 32);
}
