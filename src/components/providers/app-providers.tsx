"use client";

import { ReactNode } from "react";
import { SessionProvider } from "@/components/auth/session-provider";
import { AppConvexProvider } from "@/components/providers/convex-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppConvexProvider>
      <SessionProvider>{children}</SessionProvider>
    </AppConvexProvider>
  );
}
