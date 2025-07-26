import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  mobile: text("mobile").notNull(),
  address: text("address"),
  userType: text("user_type").notNull(), // "vendor" or "wholesaler"
  documentType: text("document_type"), // "aadhaar", "ration", "voter"
  documentNumber: text("document_number"),
  documentVerified: boolean("document_verified").default(false),
  preferredLanguage: text("preferred_language").default("hi"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  nameTe: text("name_te"),
  category: text("category").notNull(), // "vegetables", "fruits", "grains", "spices"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // "kg", "bunch", "piece"
  wholesalerId: varchar("wholesaler_id").references(() => users.id),
  imageUrl: text("image_url"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  inStock: boolean("in_stock").default(true),
  minQuantity: integer("min_quantity").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").references(() => users.id).notNull(),
  wholesalerId: varchar("wholesaler_id").references(() => users.id).notNull(),
  items: jsonb("items").notNull(), // array of {productId, quantity, price}
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"), // "pending", "confirmed", "ready", "completed"
  orderMethod: text("order_method").default("manual"), // "manual", "voice"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  orders: many(orders),
  cartItems: many(cartItems),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  wholesaler: one(users, {
    fields: [products.wholesalerId],
    references: [users.id],
  }),
  cartItems: many(cartItems),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  vendor: one(users, {
    fields: [orders.vendorId],
    references: [users.id],
  }),
  wholesaler: one(users, {
    fields: [orders.wholesalerId],
    references: [users.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  mobile: true,
  address: true,
  userType: true,
  documentType: true,
  documentNumber: true,
  preferredLanguage: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
