import { flats, users, complaints, votes, type Flat, type User, type Complaint, type Vote, type InsertFlat, type InsertUser, type InsertComplaint, type InsertVote, type ComplaintWithUser, type UserWithFlat } from "@shared/schema";

const punishments = [
  "Didn't clean the dishes? You're making chai for everyone for a week.",
  "Blasted loud music at 2 AM? You owe everyone samosas.",
  "Forgot to pay the bills? You're treating everyone to pizza this weekend!",
  "Left a mess in the bathroom? You're cleaning the entire house this weekend.",
  "Didn't take out the trash? You're on garbage duty for a month.",
  "Hogged the common area? You're buying snacks for the next movie night.",
  "Made noise during exam time? You're providing study snacks for everyone.",
  "Didn't contribute to groceries? You're cooking dinner for everyone this week.",
];

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserKarma(userId: number, karma: number): Promise<void>;
  getUsersInFlat(flatId: number): Promise<User[]>;
  
  // Flats
  getFlat(id: number): Promise<Flat | undefined>;
  getFlatByCode(code: string): Promise<Flat | undefined>;
  createFlat(flat: InsertFlat): Promise<Flat>;
  
  // Complaints
  getComplaint(id: number): Promise<Complaint | undefined>;
  getComplaintsInFlat(flatId: number): Promise<ComplaintWithUser[]>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  updateComplaint(id: number, updates: Partial<Complaint>): Promise<void>;
  archiveOldDownvotedComplaints(): Promise<void>;
  updateProblemOfWeek(flatId: number): Promise<void>;
  
  // Votes
  getVote(userId: number, complaintId: number): Promise<Vote | undefined>;
  createVote(vote: InsertVote): Promise<Vote>;
  updateVote(userId: number, complaintId: number, voteType: string): Promise<void>;
  deleteVote(userId: number, complaintId: number): Promise<void>;
  
  // Stats
  getComplaintStats(flatId: number): Promise<{[key: string]: number}>;
  getLeaderboard(flatId: number): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private flats: Map<number, Flat>;
  private users: Map<number, User>;
  private complaints: Map<number, Complaint>;
  private votes: Map<string, Vote>;
  private currentFlatId: number;
  private currentUserId: number;
  private currentComplaintId: number;
  private currentVoteId: number;

  constructor() {
    this.flats = new Map();
    this.users = new Map();
    this.complaints = new Map();
    this.votes = new Map();
    this.currentFlatId = 1;
    this.currentUserId = 1;
    this.currentComplaintId = 1;
    this.currentVoteId = 1;
    
    // Create default flat
    this.createFlat({ code: "ABC123", name: "Default Flat" });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      flatId: insertUser.flatId || null,
      karma: 0,
      isBestFlatmate: false
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserKarma(userId: number, karma: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.karma = karma;
      this.users.set(userId, user);
    }
  }

  async getUsersInFlat(flatId: number): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.flatId === flatId);
  }

  // Flats
  async getFlat(id: number): Promise<Flat | undefined> {
    return this.flats.get(id);
  }

  async getFlatByCode(code: string): Promise<Flat | undefined> {
    return Array.from(this.flats.values()).find(flat => flat.code === code);
  }

  async createFlat(insertFlat: InsertFlat): Promise<Flat> {
    const id = this.currentFlatId++;
    const flat: Flat = { ...insertFlat, id };
    this.flats.set(id, flat);
    return flat;
  }

  // Complaints
  async getComplaint(id: number): Promise<Complaint | undefined> {
    return this.complaints.get(id);
  }

  async getComplaintsInFlat(flatId: number): Promise<ComplaintWithUser[]> {
    const flatComplaints = Array.from(this.complaints.values())
      .filter(complaint => complaint.flatId === flatId && !complaint.isArchived)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    return flatComplaints.map(complaint => ({
      ...complaint,
      user: this.users.get(complaint.userId!)!
    }));
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const id = this.currentComplaintId++;
    const complaint: Complaint = { 
      ...insertComplaint, 
      id,
      flatId: insertComplaint.flatId || null,
      userId: insertComplaint.userId || null,
      isResolved: false,
      isArchived: false,
      isProblemOfWeek: false,
      upvotes: 0,
      downvotes: 0,
      punishment: null,
      createdAt: new Date()
    };
    this.complaints.set(id, complaint);
    return complaint;
  }

  async updateComplaint(id: number, updates: Partial<Complaint>): Promise<void> {
    const complaint = this.complaints.get(id);
    if (complaint) {
      Object.assign(complaint, updates);
      this.complaints.set(id, complaint);
      
      // Generate punishment if complaint reaches 10+ upvotes
      if (updates.upvotes && updates.upvotes >= 10 && !complaint.punishment) {
        const randomPunishment = punishments[Math.floor(Math.random() * punishments.length)];
        complaint.punishment = randomPunishment;
        this.complaints.set(id, complaint);
      }
    }
  }

  async archiveOldDownvotedComplaints(): Promise<void> {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const entries = Array.from(this.complaints.entries());
    for (const [id, complaint] of entries) {
      if (complaint.downvotes! > complaint.upvotes! && 
          complaint.createdAt! < threeDaysAgo && 
          !complaint.isArchived) {
        complaint.isArchived = true;
        this.complaints.set(id, complaint);
      }
    }
  }

  async updateProblemOfWeek(flatId: number): Promise<void> {
    const flatComplaints = Array.from(this.complaints.values())
      .filter(complaint => complaint.flatId === flatId && !complaint.isArchived);
    
    // Reset all problem of week flags
    flatComplaints.forEach(complaint => {
      complaint.isProblemOfWeek = false;
      this.complaints.set(complaint.id, complaint);
    });
    
    // Find complaint with most upvotes
    const topComplaint = flatComplaints.reduce((max, complaint) => 
      (complaint.upvotes! > max.upvotes!) ? complaint : max
    );
    
    if (topComplaint && topComplaint.upvotes! > 0) {
      topComplaint.isProblemOfWeek = true;
      this.complaints.set(topComplaint.id, topComplaint);
    }
  }

  // Votes
  async getVote(userId: number, complaintId: number): Promise<Vote | undefined> {
    return this.votes.get(`${userId}-${complaintId}`);
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.currentVoteId++;
    const vote: Vote = { 
      ...insertVote, 
      id,
      userId: insertVote.userId || null,
      complaintId: insertVote.complaintId || null
    };
    this.votes.set(`${vote.userId}-${vote.complaintId}`, vote);
    
    // Update complaint vote counts
    await this.updateComplaintVotes(vote.complaintId!);
    
    return vote;
  }

  async updateVote(userId: number, complaintId: number, voteType: string): Promise<void> {
    const key = `${userId}-${complaintId}`;
    const vote = this.votes.get(key);
    if (vote) {
      vote.voteType = voteType;
      this.votes.set(key, vote);
      await this.updateComplaintVotes(complaintId);
    }
  }

  async deleteVote(userId: number, complaintId: number): Promise<void> {
    const key = `${userId}-${complaintId}`;
    this.votes.delete(key);
    await this.updateComplaintVotes(complaintId);
  }

  private async updateComplaintVotes(complaintId: number): Promise<void> {
    const complaintVotes = Array.from(this.votes.values())
      .filter(vote => vote.complaintId === complaintId);
    
    const upvotes = complaintVotes.filter(vote => vote.voteType === 'upvote').length;
    const downvotes = complaintVotes.filter(vote => vote.voteType === 'downvote').length;
    
    await this.updateComplaint(complaintId, { upvotes, downvotes });
  }

  // Stats
  async getComplaintStats(flatId: number): Promise<{[key: string]: number}> {
    const flatComplaints = Array.from(this.complaints.values())
      .filter(complaint => complaint.flatId === flatId);
    
    const stats: {[key: string]: number} = {};
    
    flatComplaints.forEach(complaint => {
      stats[complaint.type] = (stats[complaint.type] || 0) + 1;
    });
    
    return stats;
  }

  async getLeaderboard(flatId: number): Promise<User[]> {
    const flatUsers = await this.getUsersInFlat(flatId);
    return flatUsers.sort((a, b) => (b.karma || 0) - (a.karma || 0));
  }
}

export const storage = new MemStorage();
