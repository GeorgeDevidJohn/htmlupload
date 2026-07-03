"use client";

import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useSession } from "@/components/auth/session-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery } from "convex/react";
import { Shield, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const { user, token, isHydrated, isLoadingUser } = useSession();
  const users = useQuery(
    api.auth.listUsers,
    token && user?.role === "admin" ? { token } : "skip",
  );
  const setUserRole = useMutation(api.auth.setUserRole);
  const deleteUser = useMutation(api.auth.deleteUser);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!isHydrated || isLoadingUser) {
      return;
    }
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isHydrated, isLoadingUser, router, user]);

  async function onToggleRole(userId: Id<"users">, role: "admin" | "user") {
    if (!token) {
      return;
    }
    setError(null);
    setIsBusy(true);
    try {
      await setUserRole({ token, userId, role });
    } catch (roleError) {
      setError(roleError instanceof Error ? roleError.message : "Role update failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onDeleteUser(userId: Id<"users">) {
    if (!token) {
      return;
    }
    setError(null);
    setIsBusy(true);
    try {
      await deleteUser({ token, userId });
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "User delete failed.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  if (!isHydrated || isLoadingUser || !user || user.role !== "admin") {
    return (
      <div className="premium-grid flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Loading admin area...</p>
      </div>
    );
  }

  return (
    <div className="premium-grid min-h-screen p-6">
      <div className="mx-auto w-full max-w-6xl">
        <Card>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Admin</p>
              <h1 className="text-2xl font-semibold">User Management</h1>
            </div>
            <a
              href="/dashboard"
              className="rounded-md border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 hover:bg-white"
            >
              Back to Dashboard
            </a>
          </div>

          <div className="hidden rounded-xl border border-slate-200 bg-white/55 md:block">
            <div className="grid grid-cols-[1.2fr_auto_auto_auto] gap-4 border-b border-slate-200 px-4 py-3 text-xs uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Username
              </span>
              <span>Role</span>
              <span>Files</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-200">
              {(users ?? []).map((entry) => {
                const targetRole = entry.role === "admin" ? "user" : "admin";
                return (
                  <div
                    key={entry.id}
                    className="grid grid-cols-[1.2fr_auto_auto_auto] items-center gap-4 px-4 py-3 text-sm"
                  >
                    <span>{entry.username}</span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white/70 px-2 py-1 text-xs">
                      <Shield className="h-3.5 w-3.5" />
                      {entry.role}
                    </span>
                    <span>{entry.fileCount}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => onToggleRole(entry.id, targetRole)}
                      >
                        Make {targetRole}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => onDeleteUser(entry.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {(users ?? []).map((entry) => {
              const targetRole = entry.role === "admin" ? "user" : "admin";
              return (
                <div
                  key={entry.id}
                  className="rounded-xl border border-slate-200 bg-white/60 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium">{entry.username}</p>
                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white/70 px-2 py-1 text-xs">
                      <Shield className="h-3.5 w-3.5" />
                      {entry.role}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-slate-600">Files: {entry.fileCount}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => onToggleRole(entry.id, targetRole)}
                    >
                      Make {targetRole}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => onDeleteUser(entry.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {error ? (
            <p className="mt-4 rounded-md border border-red-700 bg-red-950/50 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
