import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, registerSchema, insertComplaintSchema, insertVoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, flatCode } = registerSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Find or create flat
      let flat = await storage.getFlatByCode(flatCode);
      if (!flat) {
        flat = await storage.createFlat({ code: flatCode, name: `Flat ${flatCode}` });
      }
      
      // Create user
      const user = await storage.createUser({
        username,
        password, // In production, hash this
        flatId: flat.id
      });
      
      res.json({ user: { id: user.id, username: user.username, flatId: user.flatId, karma: user.karma } });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const flat = await storage.getFlat(user.flatId!);
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          flatId: user.flatId, 
          karma: user.karma,
          flatCode: flat?.code
        } 
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Login failed" });
    }
  });

  // Complaint routes
  app.get("/api/complaints", async (req, res) => {
    try {
      const flatId = parseInt(req.query.flatId as string);
      if (!flatId) {
        return res.status(400).json({ message: "flatId is required" });
      }
      
      const complaints = await storage.getComplaintsInFlat(flatId);
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch complaints" });
    }
  });

  app.post("/api/complaints", async (req, res) => {
    try {
      const complaintData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint(complaintData);
      res.json(complaint);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create complaint" });
    }
  });

  app.put("/api/complaints/:id/resolve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { userId } = req.body;
      
      await storage.updateComplaint(id, { isResolved: true });
      
      // Award karma points
      const user = await storage.getUser(userId);
      if (user) {
        await storage.updateUserKarma(userId, (user.karma || 0) + 50);
      }
      
      res.json({ message: "Complaint resolved" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to resolve complaint" });
    }
  });

  // Voting routes
  app.post("/api/complaints/:id/vote", async (req, res) => {
    try {
      const complaintId = parseInt(req.params.id);
      const { userId, voteType } = req.body;
      
      if (!['upvote', 'downvote'].includes(voteType)) {
        return res.status(400).json({ message: "Invalid vote type" });
      }
      
      const existingVote = await storage.getVote(userId, complaintId);
      
      if (existingVote) {
        if (existingVote.voteType === voteType) {
          // Remove vote if same type
          await storage.deleteVote(userId, complaintId);
        } else {
          // Update vote type
          await storage.updateVote(userId, complaintId, voteType);
        }
      } else {
        // Create new vote
        await storage.createVote({
          userId,
          complaintId,
          voteType
        });
      }
      
      // Update problem of the week
      const complaint = await storage.getComplaint(complaintId);
      if (complaint) {
        await storage.updateProblemOfWeek(complaint.flatId!);
      }
      
      res.json({ message: "Vote recorded" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to record vote" });
    }
  });

  // Leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const flatId = parseInt(req.query.flatId as string);
      if (!flatId) {
        return res.status(400).json({ message: "flatId is required" });
      }
      
      const leaderboard = await storage.getLeaderboard(flatId);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch leaderboard" });
    }
  });

  // Stats
  app.get("/api/stats", async (req, res) => {
    try {
      const flatId = parseInt(req.query.flatId as string);
      if (!flatId) {
        return res.status(400).json({ message: "flatId is required" });
      }
      
      const stats = await storage.getComplaintStats(flatId);
      const complaints = await storage.getComplaintsInFlat(flatId);
      const users = await storage.getUsersInFlat(flatId);
      
      const activeComplaints = complaints.filter(c => !c.isResolved).length;
      const resolvedComplaints = complaints.filter(c => c.isResolved).length;
      const problemOfWeek = complaints.find(c => c.isProblemOfWeek);
      
      res.json({
        complaintTypes: stats,
        activeComplaints,
        resolvedComplaints,
        totalFlatmates: users.length,
        problemOfWeek
      });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch stats" });
    }
  });

  // Archive old complaints (should be called periodically)
  app.post("/api/complaints/archive", async (req, res) => {
    try {
      await storage.archiveOldDownvotedComplaints();
      res.json({ message: "Old complaints archived" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to archive complaints" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
