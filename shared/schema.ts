import { pgTable, text, serial, integer, boolean, jsonb, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  googleId: text("google_id").unique(),
  role: text("role").notNull().default("dealer"), // dealer or admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Watches table
export const watches = pgTable("watches", {
  id: serial("id").primaryKey(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  reference: text("reference").notNull(),
  size: doublePrecision("size").notNull(), // in mm
  material: text("material").notNull(),
  price: integer("price").notNull(), // in cents
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Favorites table - junction table for users and their favorite watches
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  watchId: integer("watch_id").notNull().references(() => watches.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
}));

export const watchesRelations = relations(watches, ({ many }) => ({
  favoritedBy: many(favorites),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  watch: one(watches, {
    fields: [favorites.watchId],
    references: [watches.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertWatchSchema = createInsertSchema(watches)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertFavoriteSchema = createInsertSchema(favorites)
  .omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Watch = typeof watches.$inferSelect;
export type InsertWatch = z.infer<typeof insertWatchSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

// Login schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// Google login schema
export const googleLoginSchema = z.object({
  token: z.string(),
  email: z.string().email(),
});

export type GoogleLoginCredentials = z.infer<typeof googleLoginSchema>;
