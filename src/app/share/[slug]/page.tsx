"use client";

import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

export default function SharePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const file = useQuery(api.htmlFiles.getPublishedFileBySlug, { slug });

  if (file === undefined) {
    return (
      <div className="premium-grid flex min-h-screen items-center justify-center p-6">
        <p className="text-slate-600">Loading shared page...</p>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="premium-grid flex min-h-screen items-center justify-center p-6">
        <div className="glass-panel max-w-md rounded-2xl p-6 text-center">
          <h1 className="text-xl font-semibold">Link is invalid</h1>
          <p className="mt-2 text-sm text-slate-600">
            This page is unpublished or no longer available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <iframe
        title={file.title}
        srcDoc={file.content}
        className="h-screen w-full border-0"
        sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
      />
    </div>
  );
}
