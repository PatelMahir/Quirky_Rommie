import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const flats = pgTable("flats", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  flatId: integer("flat_id").references(() => flats.id),
  karma: integer("karma").default(0),
  isBestFlatmate: boolean("is_best_flatmate").default(false),
});

export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "Noise", "Cleanliness", "Bills", "Pets", "Other"
  severity: text("severity").notNull(), // "Mild", "Annoying", "Major", "Nuclear"
  userId: integer("user_id").references(() => users.id),
  flatId: integer("flat_id").references(() => flats.id),
  isResolved: boolean("is_resolved").default(false),
  isArchived: boolean("is_archived").default(false),
  isProblemOfWeek: boolean("is_problem_of_week").default(false),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  punishment: text("punishment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  complaintId: integer("complaint_id").references(() => complaints.id),
  voteType: text("vote_type").notNull(), // "upvote" or "downvote"
});

export const insertFlatSchema = createInsertSchema(flats).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  karma: true,
  isBestFlatmate: true,
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  isResolved: true,
  isArchived: true,
  isProblemOfWeek: true,
  upvotes: true,
  downvotes: true,
  punishment: true,
  createdAt: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  flatCode: z.string().min(1),
});

export type InsertFlat = z.infer<typeof insertFlatSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

export type Flat = typeof flats.$inferSelect;
export type User = typeof users.$inferSelect;
export type Complaint = typeof complaints.$inferSelect;
export type Vote = typeof votes.$inferSelect;

export type ComplaintWithUser = Complaint & {
  user: User;
};

export type UserWithFlat = User & {
  flat: Flat;
};
