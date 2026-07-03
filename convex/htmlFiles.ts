import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserFromToken, requireUserFromToken } from "./auth";

function normalizeTitle(title: string) {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new ConvexError("Title is required.");
  }
  if (trimmed.length > 120) {
    throw new ConvexError("Title must be 120 characters or fewer.");
  }
  return trimmed;
}

export const listMyFiles = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserFromToken(ctx, args.token);
    if (!user) {
      throw new ConvexError("Invalid or expired session.");
    }
    const files = await ctx.db
      .query("htmlFiles")
      .withIndex("by_userId", (q) => q.eq("userId", user.userId))
      .collect();

    return files
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((file) => ({
        ...file,
        isPublished: file.isPublished ?? false,
      }));
  },
});

export const getMyFile = query({
  args: { token: v.string(), fileId: v.id("htmlFiles") },
  handler: async (ctx, args) => {
    const user = await getUserFromToken(ctx, args.token);
    if (!user) {
      throw new ConvexError("Invalid or expired session.");
    }

    const file = await ctx.db.get(args.fileId);
    if (!file || file.userId !== user.userId) {
      throw new ConvexError("File not found.");
    }
    return {
      ...file,
      isPublished: file.isPublished ?? false,
    };
  },
});

export const createFile = mutation({
  args: { token: v.string(), title: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    const user = await requireUserFromToken(ctx, args.token);
    const now = Date.now();
    const fileId = await ctx.db.insert("htmlFiles", {
      userId: user.userId,
      title: normalizeTitle(args.title),
      content: args.content,
      isPublished: false,
      shareSlug: undefined,
      createdAt: now,
      updatedAt: now,
    });

    return { id: fileId };
  },
});

export const updateFile = mutation({
  args: {
    token: v.string(),
    fileId: v.id("htmlFiles"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUserFromToken(ctx, args.token);
    const file = await ctx.db.get(args.fileId);
    if (!file || file.userId !== user.userId) {
      throw new ConvexError("File not found.");
    }

    await ctx.db.patch(args.fileId, {
      title: normalizeTitle(args.title),
      content: args.content,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const deleteFile = mutation({
  args: { token: v.string(), fileId: v.id("htmlFiles") },
  handler: async (ctx, args) => {
    const user = await requireUserFromToken(ctx, args.token);
    const file = await ctx.db.get(args.fileId);
    if (!file || file.userId !== user.userId) {
      throw new ConvexError("File not found.");
    }

    await ctx.db.delete(args.fileId);
    return { success: true };
  },
});

export const togglePublish = mutation({
  args: {
    token: v.string(),
    fileId: v.id("htmlFiles"),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireUserFromToken(ctx, args.token);
    const file = await ctx.db.get(args.fileId);
    if (!file || file.userId !== user.userId) {
      throw new ConvexError("File not found.");
    }

    const shareSlug = args.isPublished
      ? file.shareSlug ?? `${crypto.randomUUID().replaceAll("-", "")}`
      : undefined;

    await ctx.db.patch(args.fileId, {
      isPublished: args.isPublished,
      shareSlug,
      updatedAt: Date.now(),
    });

    return { isPublished: args.isPublished, shareSlug };
  },
});

export const getPublishedFileBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const file = await ctx.db
      .query("htmlFiles")
      .withIndex("by_shareSlug", (q) => q.eq("shareSlug", args.slug))
      .first();

    if (!file || file.isPublished !== true) {
      return null;
    }

    return {
      id: file._id,
      title: file.title,
      content: file.content,
      updatedAt: file.updatedAt,
    };
  },
});
