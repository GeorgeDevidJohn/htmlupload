"use client";

import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useSession } from "@/components/auth/session-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "convex/react";
import { FileCode, Link2, LogOut, Plus, Save, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isHydrated, isLoadingUser, logout } = useSession();
  const files = useQuery(
    api.htmlFiles.listMyFiles,
    token && user ? { token } : "skip",
  );
  const createFile = useMutation(api.htmlFiles.createFile);
  const updateFile = useMutation(api.htmlFiles.updateFile);
  const deleteFile = useMutation(api.htmlFiles.deleteFile);
  const togglePublish = useMutation(api.htmlFiles.togglePublish);
  const [selectedFileId, setSelectedFileId] = useState<Id<"htmlFiles"> | null>(
    null,
  );
  const [title, setTitle] = useState("landing-page.html");
  const [content, setContent] = useState(
    "<!doctype html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello from HTML Upload Studio</h1>\n  </body>\n</html>",
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const siteOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const convexPublicOrigin = process.env.NEXT_PUBLIC_CONVEX_SITE_URL ?? "";

  useEffect(() => {
    if (!isHydrated || isLoadingUser) {
      return;
    }
    if (!user) {
      router.replace("/login");
    }
  }, [isHydrated, isLoadingUser, router, user]);

  const selectedFile = useMemo(
    () => files?.find((file) => file._id === selectedFileId) ?? null,
    [files, selectedFileId],
  );

  async function onCreateFile() {
    if (!token) {
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      const nextTitle = title.trim() || "untitled.html";
      const response = await createFile({ token, title: nextTitle, content });
      setSelectedFileId(response.id);
    } catch (creationError) {
      setError(
        creationError instanceof Error
          ? creationError.message
          : "Unable to create file.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function onSaveFile() {
    if (!token) {
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      if (selectedFileId) {
        await updateFile({ token, fileId: selectedFileId, title, content });
      } else {
        const response = await createFile({ token, title, content });
        setSelectedFileId(response.id);
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function onDeleteFile(fileId: Id<"htmlFiles">) {
    if (!token) {
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      await deleteFile({ token, fileId });
      if (selectedFileId === fileId) {
        setSelectedFileId(null);
        setTitle("landing-page.html");
        setContent("<!doctype html>\n<html>\n  <body>\n    <h1>New file</h1>\n  </body>\n</html>");
      }
    } catch (deletionError) {
      setError(
        deletionError instanceof Error
          ? deletionError.message
          : "Unable to delete file.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function onUploadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const text = await file.text();
      setTitle(file.name.endsWith(".html") ? file.name : `${file.name}.html`);
      setContent(text);
      setSelectedFileId(null);
    } catch {
      setError("Could not read uploaded file.");
    } finally {
      event.target.value = "";
    }
  }

  async function onTogglePublish(fileId: Id<"htmlFiles">, isPublished: boolean) {
    if (!token) {
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      await togglePublish({ token, fileId, isPublished });
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : "Could not update publish status.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function shareUrl(slug: string | undefined) {
    if (!slug) {
      return "";
    }
    if (convexPublicOrigin) {
      return `${convexPublicOrigin}/published?slug=${encodeURIComponent(slug)}`;
    }
    if (siteOrigin) {
      return `${siteOrigin}/share/${slug}`;
    }
    return "";
  }

  if (!isHydrated || isLoadingUser || !user) {
    return (
      <div className="premium-grid flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="premium-grid min-h-screen p-4 sm:p-6">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[330px_1fr]">
        <Card className="h-fit">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-violet-300">
                Dashboard
              </p>
              <h1 className="text-xl font-semibold">Hi, {user.username}</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="mr-1 h-4 w-4" /> Logout
            </Button>
          </div>

          <Button className="mb-3 w-full" onClick={onCreateFile} disabled={isSaving}>
            <Plus className="mr-2 h-4 w-4" />
            New HTML File
          </Button>

          <label className="mb-4 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-white/65 p-3 text-sm text-slate-700 hover:bg-white">
            <Upload className="h-4 w-4" />
            Upload HTML
            <input
              type="file"
              accept=".html,text/html"
              className="hidden"
              onChange={onUploadFile}
            />
          </label>

          <div className="space-y-2">
            {(files ?? []).map((file) => (
              <div
                key={file._id}
                className={`rounded-lg border p-3 ${
                  selectedFileId === file._id
                    ? "border-indigo-300 bg-indigo-50/80"
                    : "border-slate-200 bg-white/55"
                }`}
              >
                <button
                  className="flex w-full items-center gap-2 text-left"
                  onClick={() => {
                    setSelectedFileId(file._id);
                    setTitle(file.title);
                    setContent(file.content);
                  }}
                >
                  <FileCode className="h-4 w-4 text-indigo-500" />
                  <span className="truncate text-sm">{file.title}</span>
                </button>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-xs text-slate-600">
                    <Switch
                      checked={file.isPublished}
                      disabled={isSaving}
                      onCheckedChange={(checked) =>
                        onTogglePublish(file._id, Boolean(checked))
                      }
                    />
                    <span className="font-medium">Publish</span>
                  </label>
                  {file.isPublished && file.shareSlug ? (
                    <a
                      className="inline-flex items-center gap-1 break-all text-xs text-sky-500 hover:text-sky-600"
                      href={shareUrl(file.shareSlug)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      Open URL
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500">Private</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-red-600 hover:bg-red-100 hover:text-red-700"
                  onClick={() => onDeleteFile(file._id)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            ))}
            {(files ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">No files yet. Create your first one.</p>
            ) : null}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                {selectedFile ? "Edit HTML file" : "Create HTML file"}
              </h2>
              <p className="text-sm text-slate-500">
                Changes are saved to Convex and linked to your account.
              </p>
            </div>
            {user.role === "admin" ? (
              <a
                href="/admin"
                className="rounded-md border border-slate-200 bg-white/70 px-3 py-1.5 text-sm text-slate-700 hover:bg-white"
              >
                Open Admin
              </a>
            ) : null}
          </div>

          <div className="space-y-3">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="File title"
            />
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-[420px] font-mono text-xs leading-6"
              placeholder="<html>...</html>"
            />
            {selectedFile?.isPublished && selectedFile.shareSlug ? (
              <div className="rounded-md border border-sky-300 bg-sky-50 px-3 py-2 text-sm text-slate-700">
                Public URL:{" "}
                <a
                  className="break-all text-sky-700 underline"
                  href={shareUrl(selectedFile.shareSlug)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {shareUrl(selectedFile.shareSlug)}
                </a>
              </div>
            ) : null}
            {error ? (
              <p className="rounded-md border border-red-700 bg-red-950/50 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            ) : null}
            <Button onClick={onSaveFile} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save File"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
