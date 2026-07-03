import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

type SessionUser = {
  userId: Id<"users">;
  username: string;
  role: "admin" | "user";
  sessionToken: string;
};

async function hashPassword(password: string) {
  const input = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

function validateCredentials(username: string, password: string) {
  const trimmed = username.trim();
  if (trimmed.length < 3 || trimmed.length > 30) {
    throw new ConvexError("Username must be between 3 and 30 characters.");
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    throw new ConvexError(
      "Username can only contain letters, numbers, and underscores.",
    );
  }
  if (password.length < 8 || password.length > 128) {
    throw new ConvexError("Password must be between 8 and 128 characters.");
  }
}

export async function getUserFromToken(
  ctx: QueryCtx | MutationCtx,
  token: string,
): Promise<SessionUser | null> {
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    return null;
  }

  const user = await ctx.db.get(session.userId);
  if (!user) {
    return null;
  }

  return {
    userId: user._id,
    username: user.username,
    role: user.role,
    sessionToken: session.token,
  };
}

export async function requireUserFromToken(ctx: MutationCtx, token: string) {
  const user = await getUserFromToken(ctx, token);
  if (!user) {
    throw new ConvexError("Invalid or expired session.");
  }
  return user;
}

async function requireAdminFromToken(ctx: MutationCtx, token: string) {
  const user = await requireUserFromToken(ctx, token);
  if (user.role !== "admin") {
    throw new ConvexError("Only admins can perform this action.");
  }
  return user;
}

export const signup = mutation({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    validateCredentials(args.username, args.password);
    const username = args.username.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .first();
    if (existing) {
      throw new ConvexError("Username is already taken.");
    }

    const firstUser = await ctx.db.query("users").first();
    const role = firstUser ? "user" : "admin";
    const userId = await ctx.db.insert("users", {
      username,
      passwordHash: await hashPassword(args.password),
      role,
      createdAt: Date.now(),
    });

    const token = `${crypto.randomUUID()}-${Date.now()}`;
    await ctx.db.insert("sessions", {
      token,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    });

    return { token, user: { id: userId, username, role } };
  },
});

export const login = mutation({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const username = args.username.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .first();
    if (!user) {
      throw new ConvexError("Invalid username or password.");
    }

    const passwordHash = await hashPassword(args.password);
    if (passwordHash !== user.passwordHash) {
      throw new ConvexError("Invalid username or password.");
    }

    const token = `${crypto.randomUUID()}-${Date.now()}`;
    await ctx.db.insert("sessions", {
      token,
      userId: user._id,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    });

    return {
      token,
      user: { id: user._id, username: user.username, role: user.role },
    };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (session) {
      await ctx.db.delete(session._id);
    }
    return { success: true };
  },
});

export const getSessionUser = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) {
      return null;
    }
    const user = await getUserFromToken(ctx, args.token);
    if (!user) {
      return null;
    }

    return {
      id: user.userId,
      username: user.username,
      role: user.role,
      token: user.sessionToken,
    };
  },
});

export const listUsers = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const caller = await getUserFromToken(ctx, args.token);
    if (!caller || caller.role !== "admin") {
      throw new ConvexError("Only admins can view users.");
    }

    const users = await ctx.db.query("users").collect();
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const files = await ctx.db
          .query("htmlFiles")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .collect();
        return {
          id: user._id,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          fileCount: files.length,
        };
      }),
    );

    return usersWithStats.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const setUserRole = mutation({
  args: {
    token: v.string(),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdminFromToken(ctx, args.token);
    if (admin.userId === args.userId && args.role !== "admin") {
      throw new ConvexError("You cannot remove your own admin role.");
    }

    await ctx.db.patch(args.userId, { role: args.role });
    return { success: true };
  },
});

export const deleteUser = mutation({
  args: { token: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
    const admin = await requireAdminFromToken(ctx, args.token);
    if (admin.userId === args.userId) {
      throw new ConvexError("You cannot delete your own account.");
    }

    const files = await ctx.db
      .query("htmlFiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    for (const file of files) {
      await ctx.db.delete(file._id);
    }

    const sessions = await ctx.db.query("sessions").collect();
    for (const session of sessions) {
      if (session.userId === args.userId) {
        await ctx.db.delete(session._id);
      }
    }

    await ctx.db.delete(args.userId);
    return { success: true };
  },
});
