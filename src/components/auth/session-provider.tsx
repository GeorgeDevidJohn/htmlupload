"use client";

import { api } from "../../../convex/_generated/api";
import {
  clearStoredSessionToken,
  readStoredSessionToken,
  writeStoredSessionToken,
} from "@/lib/session";
import { useMutation, useQuery } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type SessionUser = {
  id: string;
  username: string;
  role: "admin" | "user";
  token: string;
} | null;

type SessionContextValue = {
  user: SessionUser;
  token: string | null;
  isHydrated: boolean;
  isLoadingUser: boolean;
  setSessionToken: (token: string | null) => void;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const logoutMutation = useMutation(api.auth.logout);

  useEffect(() => {
    // Reading localStorage has to happen after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(readStoredSessionToken());
    setIsHydrated(true);
  }, []);

  const userResult = useQuery(
    api.auth.getSessionUser,
    token ? { token } : "skip",
  );

  useEffect(() => {
    if (!isHydrated || !token) {
      return;
    }
    if (userResult === null) {
      clearStoredSessionToken();
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
        router.replace("/login");
      }
    }
  }, [isHydrated, pathname, router, token, userResult]);

  const setSessionToken = (nextToken: string | null) => {
    if (!nextToken) {
      clearStoredSessionToken();
      setToken(null);
      return;
    }
    writeStoredSessionToken(nextToken);
    setToken(nextToken);
  };

  const logout = async () => {
    if (token) {
      await logoutMutation({ token });
    }
    setSessionToken(null);
    router.push("/login");
  };

  const value: SessionContextValue = {
    user: userResult ?? null,
    token,
    isHydrated,
    isLoadingUser: Boolean(token) && userResult === undefined,
    setSessionToken,
    logout,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider.");
  }
  return context;
}
