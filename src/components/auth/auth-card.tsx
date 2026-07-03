"use client";

import { api } from "../../../convex/_generated/api";
import { useSession } from "@/components/auth/session-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type AuthMode = "login" | "signup";

export function AuthCard({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const { setSessionToken } = useSession();
  const login = useMutation(api.auth.login);
  const signup = useMutation(api.auth.signup);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const content = useMemo(
    () =>
      mode === "login"
        ? {
            title: "Welcome back",
            subtitle: "Sign in to manage your private HTML workspace.",
            cta: "Log In",
            altText: "Need an account?",
            altHref: "/signup",
            altCta: "Create one",
          }
        : {
            title: "Create your account",
            subtitle: "Get your own secure HTML dashboard in seconds.",
            cta: "Sign Up",
            altText: "Already have an account?",
            altHref: "/login",
            altCta: "Log in",
          },
    [mode],
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const response =
        mode === "login"
          ? await login({ username, password })
          : await signup({ username, password });
      setSessionToken(response.token);
      router.push("/dashboard");
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Authentication failed. Please try again.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="premium-grid flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">{content.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{content.subtitle}</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-600" htmlFor="username">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="john_doe"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-600" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
            />
          </div>

          {error ? (
            <p className="rounded-md border border-red-700 bg-red-950/50 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <Button className="w-full" type="submit" disabled={isSaving}>
            {isSaving ? "Please wait..." : content.cta}
          </Button>
        </form>

        <p className="mt-5 text-sm text-slate-500">
          {content.altText}{" "}
          <a className="text-violet-300 hover:text-violet-200" href={content.altHref}>
            {content.altCta}
          </a>
        </p>
      </Card>
    </div>
  );
}
