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
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
    lastPathRef.current = pathname;
    batcher.push(buildEvent(pathname, visitId, "initial", fingerprint));

    const handleVisibility = () => {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
      batcher.push(buildEvent(currentPath, visitId, "visibility_flush", fingerprint));
      batcher.flush();
    };

    const handleNavigation = () => {
      const newPath = typeof window !== "undefined" ? window.location.pathname : "/";
      if (lastPathRef.current === newPath) return;
      lastPathRef.current = newPath;
      batcher.push(buildEvent(newPath, visitId, "route_change", fingerprint));
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("hashchange", handleNavigation);
    window.addEventListener("pagehide", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("hashchange", handleNavigation);
      window.removeEventListener("pagehide", handleVisibility);
      batcher.stop();
    };
  }, [batcher, fingerprint, visitId]);

  return null;
}
