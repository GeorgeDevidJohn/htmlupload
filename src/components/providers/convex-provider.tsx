"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function AppConvexProvider({ children }: { children: ReactNode }) {
  const configuredUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const hasValidUrl =
    /^https:\/\/[a-z0-9-]+\.convex\.(cloud|site)$/.test(configuredUrl ?? "");

  const convex = useMemo(() => {
    if (!hasValidUrl || !configuredUrl) {
      return null;
    }
    return new ConvexReactClient(configuredUrl);
  }, [configuredUrl, hasValidUrl]);

  if (!convex) {
    return (
      <div className="premium-grid flex min-h-screen items-center justify-center p-6">
        <div className="glass-panel max-w-xl rounded-2xl p-6 text-slate-700">
          <h1 className="text-xl font-semibold">Convex environment not configured</h1>
          <p className="mt-2 text-sm text-slate-600">
            Set <code>NEXT_PUBLIC_CONVEX_URL</code> to your real Convex deployment
            URL (for example: <code>https://your-deployment.convex.cloud</code>), then
            restart the app.
          </p>
        </div>
      </div>
    );
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
