import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User-Agent relationship tracking (trust levels)
export const userAgentRelationships = pgTable("user_agent_relationships", {
  id: serial("id").primaryKey(),
  deviceId: varchar("device_id").notNull(),
  agentType: varchar("agent_type", { length: 4 }).notNull(),
  agentGender: varchar("agent_gender", { length: 10 }).notNull(),
  trustLevel: integer("trust_level").notNull().default(1),
  affectionXp: integer("affection_xp").notNull().default(0),
  messageCount: integer("message_count").notNull().default(0),
  lastInteractionAt: timestamp("last_interaction_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertUserAgentRelationshipSchema = createInsertSchema(userAgentRelationships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UserAgentRelationship = typeof userAgentRelationships.$inferSelect;
export type InsertUserAgentRelationship = z.infer<typeof insertUserAgentRelationshipSchema>;

// User memories (details the AI remembers about the user)
export const userMemories = pgTable("user_memories", {
  id: serial("id").primaryKey(),
  deviceId: varchar("device_id").notNull(),
  agentType: varchar("agent_type", { length: 4 }).notNull(),
  memoryType: varchar("memory_type", { length: 50 }).notNull(),
  memoryContent: text("memory_content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertUserMemorySchema = createInsertSchema(userMemories).omit({
  id: true,
  createdAt: true,
});

export type UserMemory = typeof userMemories.$inferSelect;
export type InsertUserMemory = z.infer<typeof insertUserMemorySchema>;

// Conversation history
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  deviceId: varchar("device_id").notNull(),
  agentType: varchar("agent_type", { length: 4 }).notNull(),
  agentGender: varchar("agent_gender", { length: 10 }).notNull(),
  isGroupChat: integer("is_group_chat").notNull().default(0),
  groupAgents: jsonb("group_agents"),
  title: text("title"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

// Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  agentType: varchar("agent_type", { length: 4 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Companion mood tracking
export const companionMoods = pgTable("companion_moods", {
  id: serial("id").primaryKey(),
  deviceId: varchar("device_id").notNull(),
  agentType: varchar("agent_type", { length: 4 }).notNull(),
  agentGender: varchar("agent_gender", { length: 10 }).notNull(),
  moodValue: integer("mood_value").notNull().default(0), // -100 to 100
  energy: integer("energy").notNull().default(50), // 0 to 100
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertCompanionMoodSchema = createInsertSchema(companionMoods).omit({
  id: true,
  updatedAt: true,
});

export type CompanionMood = typeof companionMoods.$inferSelect;
export type InsertCompanionMood = z.infer<typeof insertCompanionMoodSchema>;

// Emotional memories (things that had strong impact)
export const emotionalMemories = pgTable("emotional_memories", {
  id: serial("id").primaryKey(),
  deviceId: varchar("device_id").notNull(),
  agentType: varchar("agent_type", { length: 4 }).notNull(),
  content: text("content").notNull(),
  impact: varchar("impact", { length: 10 }).notNull(), // 'positive' or 'negative'
  intensity: integer("intensity").notNull().default(1), // 1-5
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertEmotionalMemorySchema = createInsertSchema(emotionalMemories).omit({
  id: true,
  createdAt: true,
});

export type EmotionalMemory = typeof emotionalMemories.$inferSelect;
// Weekly Challenge tracking
export const weeklyChallenges = pgTable("weekly_challenges", {
  id: serial("id").primaryKey(),
  deviceId: varchar("device_id").notNull(),
  weekStart: timestamp("week_start").notNull(), // Monday 00:00:00
  uniqueAgentsChatted: jsonb("unique_agents_chatted").notNull().default([]), // Array of MBTI types
  isClaimed: integer("is_claimed").notNull().default(0), // 0 or 1
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertWeeklyChallengeSchema = createInsertSchema(weeklyChallenges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type WeeklyChallenge = typeof weeklyChallenges.$inferSelect;
export type InsertWeeklyChallenge = z.infer<typeof insertWeeklyChallengeSchema>;
