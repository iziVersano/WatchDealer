import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated, isAdmin, configureSession, register, login, googleLogin, logout, getCurrentUser } from "./auth";
import { insertWatchSchema, insertFavoriteSchema } from "@shared/schema";
import { validateRequest } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  configureSession(app);

  // Authentication routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/google", googleLogin);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", getCurrentUser);

  // Watches routes
  app.get("/api/watches", async (req, res) => {
    try {
      // Parse filters from query params
      const filters: any = {};
      
      if (req.query.brand) {
        filters.brand = Array.isArray(req.query.brand) 
          ? req.query.brand as string[]
          : [req.query.brand as string];
      }
      
      if (req.query.size) {
        filters.size = Array.isArray(req.query.size)
          ? (req.query.size as string[]).map(Number)
          : [Number(req.query.size as string)];
      }
      
      if (req.query.material) {
        filters.material = Array.isArray(req.query.material)
          ? req.query.material as string[]
          : [req.query.material as string];
      }
      
      if (req.query.priceMin || req.query.priceMax) {
        filters.priceMin = req.query.priceMin ? Number(req.query.priceMin) : 0;
        filters.priceMax = req.query.priceMax ? Number(req.query.priceMax) : Number.MAX_SAFE_INTEGER;
      }
      
      // Get watches with filters (or all if no filters)
      const watches = Object.keys(filters).length > 0
        ? await storage.getWatchesByFilter(filters)
        : await storage.getAllWatches();
      
      res.status(200).json(watches);
    } catch (error) {
      console.error("Error fetching watches:", error);
      res.status(500).json({ message: "Failed to fetch watches" });
    }
  });
  
  app.get("/api/watches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid watch ID" });
      }
      
      const watch = await storage.getWatch(id);
      if (!watch) {
        return res.status(404).json({ message: "Watch not found" });
      }
      
      res.status(200).json(watch);
    } catch (error) {
      console.error("Error fetching watch:", error);
      res.status(500).json({ message: "Failed to fetch watch" });
    }
  });
  
  // Watch creation route (will also be used by admin)
  app.post("/api/watches", isAuthenticated, async (req, res) => {
    try {
      const watchData = validateRequest(insertWatchSchema, req, res);
      if (!watchData) return;
      
      const newWatch = await storage.createWatch(watchData);
      res.status(201).json(newWatch);
    } catch (error) {
      console.error("Error creating watch:", error);
      res.status(500).json({ message: "Failed to create watch" });
    }
  });
  
  app.put("/api/watches/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid watch ID" });
      }
      
      // Partial validation for update
      const watchData = req.body;
      const existingWatch = await storage.getWatch(id);
      
      if (!existingWatch) {
        return res.status(404).json({ message: "Watch not found" });
      }
      
      const updatedWatch = await storage.updateWatch(id, watchData);
      if (!updatedWatch) {
        return res.status(404).json({ message: "Failed to update watch" });
      }
      
      res.status(200).json(updatedWatch);
    } catch (error) {
      console.error("Error updating watch:", error);
      res.status(500).json({ message: "Failed to update watch" });
    }
  });
  
  app.delete("/api/watches/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid watch ID" });
      }
      
      const success = await storage.deleteWatch(id);
      if (!success) {
        return res.status(404).json({ message: "Watch not found or already deleted" });
      }
      
      res.status(200).json({ message: "Watch deleted successfully" });
    } catch (error) {
      console.error("Error deleting watch:", error);
      res.status(500).json({ message: "Failed to delete watch" });
    }
  });
  
  // Favorites routes
  app.get("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const favoriteWatches = await storage.getFavoritesByUser(userId);
      res.status(200).json(favoriteWatches);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });
  
  app.post("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { watchId } = req.body;
      
      if (!watchId || typeof watchId !== 'number') {
        return res.status(400).json({ message: "Invalid watch ID" });
      }
      
      // Verify watch exists
      const watch = await storage.getWatch(watchId);
      if (!watch) {
        return res.status(404).json({ message: "Watch not found" });
      }
      
      const favorite = await storage.addFavorite({ userId, watchId });
      res.status(201).json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });
  
  app.delete("/api/favorites/:watchId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const watchId = parseInt(req.params.watchId);
      
      if (isNaN(watchId)) {
        return res.status(400).json({ message: "Invalid watch ID" });
      }
      
      const success = await storage.removeFavorite(userId, watchId);
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });
  
  // Check if a watch is favorited by the current user
  app.get("/api/favorites/:watchId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const watchId = parseInt(req.params.watchId);
      
      if (isNaN(watchId)) {
        return res.status(400).json({ message: "Invalid watch ID" });
      }
      
      const isFavorite = await storage.isFavorite(userId, watchId);
      res.status(200).json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
