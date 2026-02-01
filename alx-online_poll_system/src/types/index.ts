//definitions for the polling platform

export type PollStatus = 'active' | 'closed' | 'draft';
export type PollVisibility = 'public' | 'private';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  creatorId: string;
  creatorName: string;
  status: PollStatus;
  visibility: PollVisibility;
  oneVotePerUser: boolean;
  duration?: number; // in hours
  createdAt: Date;
  expiresAt?: Date;
  totalVotes: number;
  votedUsers?: string[]; // User IDs who voted
}

export interface User {
  id: string;
  name: string;
  email: string;
  isGuest?: boolean;
}

export interface Vote {
  userId: string;
  pollId: string;
  optionId: string;
  timestamp: Date;
}

export interface AppState {
  user: User | null;
  polls: Poll[];
  userVotes: Map<string, string>; // pollId -> optionId
}

export type Page = | 'home'| 'login' | 'signup' | 'create' | 'vote' | 'results' | 'dashboard' | 'share';
