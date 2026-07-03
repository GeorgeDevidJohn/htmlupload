"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function AppConvexProvider({ children }: { children: ReactNode }) {
  const configuredUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const fallbackUrl = "https://placeholder.convex.cloud";
  const convexUrl = configuredUrl || fallbackUrl;

  const convex = useMemo(() => {
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
