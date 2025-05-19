import { users, watches, favorites, type User, type InsertUser, type Watch, type InsertWatch, type Favorite, type InsertFavorite } from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray } from "drizzle-orm";

// Define the storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Watch operations
  getWatch(id: number): Promise<Watch | undefined>;
  getAllWatches(): Promise<Watch[]>;
  getWatchesByFilter(filters: {
    brand?: string[],
    size?: number[],
    material?: string[],
    priceMin?: number,
    priceMax?: number
  }): Promise<Watch[]>;
  createWatch(watch: InsertWatch): Promise<Watch>;
  updateWatch(id: number, watch: Partial<InsertWatch>): Promise<Watch | undefined>;
  deleteWatch(id: number): Promise<boolean>;
  
  // Favorite operations
  getFavoritesByUser(userId: number): Promise<Watch[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, watchId: number): Promise<boolean>;
  isFavorite(userId: number, watchId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Watch operations
  async getWatch(id: number): Promise<Watch | undefined> {
    const [watch] = await db.select().from(watches).where(eq(watches.id, id));
    return watch;
  }

  async getAllWatches(): Promise<Watch[]> {
    return db.select().from(watches);
  }

  async getWatchesByFilter(filters: {
    brand?: string[],
    size?: number[],
    material?: string[],
    priceMin?: number,
    priceMax?: number
  }): Promise<Watch[]> {
    let query = db.select().from(watches);
    
    // Apply filters
    const conditions = [];
    
    if (filters.brand && filters.brand.length > 0) {
      conditions.push(inArray(watches.brand, filters.brand));
    }
    
    if (filters.size && filters.size.length > 0) {
      conditions.push(inArray(watches.size, filters.size));
    }
    
    if (filters.material && filters.material.length > 0) {
      conditions.push(inArray(watches.material, filters.material));
    }
    
    if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
      conditions.push(and(
        // Price is stored in cents in the database
        filters.priceMin * 100 <= watches.price,
        watches.price <= filters.priceMax * 100
      ));
    }
    
    if (conditions.length > 0) {
      for (const condition of conditions) {
        query = query.where(condition);
      }
    }
    
    return query;
  }

  async createWatch(watch: InsertWatch): Promise<Watch> {
    const [newWatch] = await db.insert(watches).values(watch).returning();
    return newWatch;
  }

  async updateWatch(id: number, watchData: Partial<InsertWatch>): Promise<Watch | undefined> {
    const [updatedWatch] = await db
      .update(watches)
      .set({ ...watchData, updatedAt: new Date() })
      .where(eq(watches.id, id))
      .returning();
    return updatedWatch;
  }

  async deleteWatch(id: number): Promise<boolean> {
    const deletedRows = await db.delete(watches).where(eq(watches.id, id));
    return deletedRows.count > 0;
  }
  
  // Favorite operations
  async getFavoritesByUser(userId: number): Promise<Watch[]> {
    const userFavorites = await db
      .select({ watch: watches })
      .from(favorites)
      .innerJoin(watches, eq(favorites.watchId, watches.id))
      .where(eq(favorites.userId, userId));
    
    return userFavorites.map(row => row.watch);
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    // Check if already exists
    const [existingFavorite] = await db
      .select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, favorite.userId),
        eq(favorites.watchId, favorite.watchId)
      ));
    
    if (existingFavorite) {
      return existingFavorite;
    }
    
    const [newFavorite] = await db.insert(favorites).values(favorite).returning();
    return newFavorite;
  }

  async removeFavorite(userId: number, watchId: number): Promise<boolean> {
    const deletedRows = await db
      .delete(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.watchId, watchId)
      ));
    
    return deletedRows.count > 0;
  }

  async isFavorite(userId: number, watchId: number): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.watchId, watchId)
      ));
    
    return !!favorite;
  }
}

export const storage = new DatabaseStorage();
