/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PromptState } from '../components/ActivePrompt';
import type { Moment } from '../components/RecentMoments';
import type { LeaderboardStats } from '../components/FlockLeaderboard';

// Mock avatars for peers
const AVATARS = [
  'https://i.pravatar.cc/150?u=a042581f4e29026704a',
  'https://i.pravatar.cc/150?u=a042581f4e29026704b',
  'https://i.pravatar.cc/150?u=a042581f4e29026704c',
  'https://i.pravatar.cc/150?u=a042581f4e29026704d',
];

export class SyncService {
  private listeners: { [event: string]: ((data: any) => void)[] } = {};

  // Simulated initial state
  private activePrompt: PromptState | null = null;
  private moments: Moment[] = [
    {
      id: 'm1',
      user: 'Sarah',
      avatar: AVATARS[0],
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop',
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      expiresAt: Date.now() + 20 * 60 * 60 * 1000, // expires in 20 hours
      reactions: 3
    },
    {
      id: 'm2',
      user: 'Alex',
      avatar: AVATARS[1],
      image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop',
      timestamp: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
      expiresAt: Date.now() + 17 * 60 * 60 * 1000, // expires in 17 hours
      reactions: 1
    }
  ];

  private leaderboardStats: LeaderboardStats = {
    rank: 12,
    rankChange: 3,
    flockName: 'Night Owls',
    memberCount: 4,
    percentile: 5,
    weeklyXp: 12400,
    streak: 14,
    energyPercent: 85,
    members: AVATARS.map((a, i) => ({ id: `mem${i}`, avatar: a }))
  };

  constructor() {
    this.startSimulationLoop();
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  public getInitialState() {
    return {
      activePrompt: this.activePrompt,
      moments: this.moments,
      leaderboardStats: this.leaderboardStats
    };
  }

  public shareMoment(image: string, _caption: string, shareGlobally: boolean) {
    // 1. Optimistic update (Local-first)
    const newMoment: Moment = {
      id: `m_${Date.now()}`,
      user: 'You',
      avatar: AVATARS[3], // You
      image,
      timestamp: Date.now(),
      expiresAt: Date.now() + 22 * 60 * 60 * 1000, // 22 hour expiry
      reactions: 0
    };

    this.moments = [newMoment, ...this.moments];
    this.emit('moments_updated', this.moments);

    // 2. Update active prompt state if we responded
    if (this.activePrompt) {
      this.activePrompt = {
        ...this.activePrompt,
        postedMembers: [...this.activePrompt.postedMembers, { id: 'you', avatar: AVATARS[3] }],
        missedMembers: this.activePrompt.missedMembers.filter(m => m.id !== 'you')
      };
      this.emit('prompt_updated', this.activePrompt);
    }

    // Calculate Privacy XP
    const earnedXp = this.activePrompt ? this.calculatePrivacyXP(this.activePrompt.expiresAt - (3 * 60 * 1000), Date.now()) : 10;
    console.log(`[XP] Earned ${earnedXp} Privacy XP for this moment!`);

    // Update local leaderboard optimistically
    this.leaderboardStats = {
      ...this.leaderboardStats,
      weeklyXp: this.leaderboardStats.weeklyXp + earnedXp
    };
    this.emit('leaderboard_updated', this.leaderboardStats);

    // 3. Simulate WebRTC peer transfer
    console.log(`[WebRTC] Sending moment to peers (Globally: ${shareGlobally})`);

    // Simulate peers reacting/viewing
    setTimeout(() => {
      this.moments[0].reactions += 1;
      this.emit('moments_updated', [...this.moments]);
    }, 5000);
  }


  private calculatePrivacyXP(promptCreatedAt: number, responseTimestamp: number): number {
    let xp = 50; // Base consistency XP

    // 1. Response speed (faster = more XP, max 50 bonus)
    const timeToRespond = responseTimestamp - promptCreatedAt;
    if (timeToRespond < 30 * 1000) xp += 50;
    else if (timeToRespond < 60 * 1000) xp += 30;
    else if (timeToRespond < 120 * 1000) xp += 10;

    // 2. Night activity bonus (between 10 PM and 4 AM)
    const hours = new Date(responseTimestamp).getHours();
    if (hours >= 22 || hours <= 4) xp += 25;

    // 3. Weekend streaks (Sat/Sun)
    const day = new Date(responseTimestamp).getDay();
    if (day === 0 || day === 6) xp += 25;

    // 4. Streak Multiplier (mocking 14 day streak -> 1.4x)
    const streak = this.leaderboardStats.streak || 1;
    const multiplier = Math.min(2.0, 1.0 + (streak * 0.05));

    return Math.floor(xp * multiplier);
  }

  private startSimulationLoop() {
    // Simulate incoming synchronized prompt
    setTimeout(() => {
      console.log('[Supabase] Received live sync notification for new prompt');
      this.activePrompt = {
        id: `p_${Date.now()}`,
        text: 'What are you up to right now?',
        expiresAt: Date.now() + 3 * 60 * 1000, // 3 minutes from now
        totalMembers: 4,
        postedMembers: [{ id: 'p1', avatar: AVATARS[0] }],
        uploadingMembers: [{ id: 'p2' }],
        missedMembers: [
          { id: 'p3', avatar: AVATARS[1] },
          { id: 'you', avatar: AVATARS[3] }
        ],
        flockName: 'Night Owls'
      };
      this.emit('prompt_updated', this.activePrompt);
    }, 3000);

    // Simulate peer state changes during prompt
    setTimeout(() => {
      if (this.activePrompt) {
        this.activePrompt = {
          ...this.activePrompt,
          postedMembers: [...this.activePrompt.postedMembers, { id: 'p2', avatar: AVATARS[1] }],
          uploadingMembers: [],
          missedMembers: [{ id: 'you', avatar: AVATARS[3] }]
        };
        this.emit('prompt_updated', this.activePrompt);
      }
    }, 8000);

    // Simulate prompt expiry
    setInterval(() => {
       if (this.activePrompt && Date.now() > this.activePrompt.expiresAt) {
          this.activePrompt = null;
          this.emit('prompt_updated', null);
       }
    }, 1000);

    // Simulate expired moments cleanup loop
    setInterval(() => {
       const now = Date.now();
       const prevLength = this.moments.length;
       this.moments = this.moments.filter(m => m.expiresAt > now);
       if (this.moments.length !== prevLength) {
           console.log('[Cleanup] Removed expired moments from local grid');
           this.emit('moments_updated', this.moments);
       }
    }, 60000);
  }
}

// Singleton instance
export const syncService = new SyncService();
