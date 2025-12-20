"use client";
import { useEffect, useMemo, useRef } from "react";
import { getClientFingerprint } from "./fingerprint";
import { EventBatcher } from "./transport";
import {
  AnalyticsConfig,
  AnalyticsEvent,
  BatcherOptions,
  NavigationType,
} from "./types";
import { getVisitId } from "./visit";

interface AnalyticsProps extends AnalyticsConfig {
  fingerprint?: string;
  batching?: BatcherOptions;
}

function getScreenBucket(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const width = window.innerWidth;
  if (width < 640) return "xs";
  if (width < 1024) return "md";
  if (width < 1440) return "lg";
  return "xl";
}

function getPathname(): string {
  if (typeof window === "undefined") return "/";
  try {
    return window.location.pathname || "/";
  } catch {
    return "/";
  }
}

function buildEvent(
  pathname: string,
  visitId: string,
  navigationType: NavigationType,
  fingerprint: string | undefined
): AnalyticsEvent {
  return {
    type: "page_view",
    pathname,
    referrer: typeof document !== "undefined" ? document.referrer : undefined,
    locale: typeof navigator !== "undefined" ? navigator.language : undefined,
    timezone:
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : undefined,
    screenBucket: getScreenBucket(),
    visitId,
    fingerprint,
    navigationType,
    timestamp: Date.now(),
  };
}

function attachNavigationListener(onChange: (pathname: string) => void) {
  if (typeof window === "undefined") return () => {};

  const history = window.history;
  const originalPush = history.pushState.bind(history);
  const originalReplace = history.replaceState.bind(history);

  const emit = () => onChange(getPathname());

  history.pushState = ((...args: Parameters<History["pushState"]>) => {
    const result = originalPush(...args);
    window.dispatchEvent(new Event("analytics:history-change"));
    return result;
  }) as History["pushState"];

  history.replaceState = ((...args: Parameters<History["replaceState"]>) => {
    const result = originalReplace(...args);
    window.dispatchEvent(new Event("analytics:history-change"));
    return result;
  }) as History["replaceState"];

  window.addEventListener("popstate", emit);
  window.addEventListener("hashchange", emit);
  window.addEventListener("analytics:history-change", emit);

  return () => {
    history.pushState = originalPush;
    history.replaceState = originalReplace;
    window.removeEventListener("popstate", emit);
    window.removeEventListener("hashchange", emit);
    window.removeEventListener("analytics:history-change", emit);
  };
}

export function Analytics(props: AnalyticsProps) {
  const visitId = useMemo(() => getVisitId(), []);
  const projectScope = useMemo(() => {
    if (props.mode === "remote") return props.projectId;
    if (props.mode === "hybrid") return props.remote.projectId;
    return "local";
  }, [props]);

  const fingerprint = useMemo(
    () => props.fingerprint ?? getClientFingerprint(projectScope),
    [props.fingerprint, projectScope]
  );

  const batcher = useMemo(() => new EventBatcher(props, props.batching), [props]);
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const pathname = getPathname();
    lastPathRef.current = pathname;
    batcher.push(buildEvent(pathname, visitId, "initial", fingerprint));

    const handleVisibility = () => {
      const currentPath = getPathname();
      batcher.push(buildEvent(currentPath, visitId, "visibility_flush", fingerprint));
      batcher.flush();
    };

    const detachNavigation = attachNavigationListener((newPath) => {
      if (lastPathRef.current === newPath) return;
      lastPathRef.current = newPath;
      batcher.push(buildEvent(newPath, visitId, "route_change", fingerprint));
    });

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handleVisibility);

    return () => {
      detachNavigation();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handleVisibility);
      batcher.flush();
      batcher.stop();
    };
  }, [batcher, fingerprint, visitId]);

  return null;
}
