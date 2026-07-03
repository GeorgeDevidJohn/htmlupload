import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    createdAt: v.number(),
  }).index("by_username", ["username"]),

  sessions: defineTable({
    token: v.string(),
    userId: v.id("users"),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_token", ["token"]),

  htmlFiles: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    isPublished: v.optional(v.boolean()),
    shareSlug: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_shareSlug", ["shareSlug"]),
});
