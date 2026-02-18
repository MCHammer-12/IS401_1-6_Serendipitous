import { integer, serial, text, timestamp, varchar, boolean, real, date } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  userId: serial("user_id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age"),
  university: varchar("university", { length: 255 }),
  major: varchar("major", { length: 255 }),
  hometown: varchar("hometown", { length: 255 }),
  quote: text("quote"),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  interestThreshold: integer("interest_threshold").default(1),
  joinDate: date("join_date").defaultNow(),
  profilePhoto: varchar("profile_photo", { length: 255 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const interests = pgTable("interest", {
  interestId: serial("interest_id").primaryKey(),
  interestName: varchar("interest_name", { length: 100 }).notNull(),
});

export const userInterests = pgTable("user_interest", {
  userInterestId: serial("user_interest_id").primaryKey(),
  userId: integer("user_id").references(() => users.userId, { onDelete: "cascade" }),
  interestId: integer("interest_id").references(() => interests.interestId, { onDelete: "cascade" }),
});

export const locationPings = pgTable("location_ping", {
  pingId: serial("ping_id").primaryKey(),
  userId: integer("user_id").references(() => users.userId, { onDelete: "cascade" }),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  shareLocation: boolean("share_location").default(true),
});

export const connections = pgTable("connection", {
  connectionId: serial("connection_id").primaryKey(),
  user1Id: integer("user_1_id").references(() => users.userId, { onDelete: "cascade" }),
  user2Id: integer("user_2_id").references(() => users.userId, { onDelete: "cascade" }),
  status: varchar("status", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("message", {
  messageId: serial("message_id").primaryKey(),
  senderId: integer("sender_id").references(() => users.userId, { onDelete: "cascade" }),
  receiverId: integer("receiver_id").references(() => users.userId, { onDelete: "cascade" }),
  connectionId: integer("connection_id").references(() => connections.connectionId, { onDelete: "cascade" }),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});
