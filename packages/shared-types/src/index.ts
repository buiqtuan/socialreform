// User related types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  followersCount: number;
  followingCount: number;
  postsCount: number;
  socialAccounts: SocialAccount[];
}

// Social Media Account types
export interface SocialAccount {
  id: string;
  userId: string;
  platform: SocialPlatform;
  platformUserId: string;
  platformUsername: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum SocialPlatform {
  YOUTUBE = 'youtube',
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  TWITCH = 'twitch',
}

// Content Management types
export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  mediaUrls: string[];
  scheduledAt?: Date;
  publishedAt?: Date;
  status: PostStatus;
  platforms: SocialPlatform[];
  hashtags: string[];
  mentions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
}

// Analytics types
export interface Analytics {
  id: string;
  postId: string;
  platform: SocialPlatform;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clickThroughRate: number;
  engagementRate: number;
  impressions: number;
  reach: number;
  createdAt: Date;
  updatedAt: Date;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export enum NotificationType {
  POST_PUBLISHED = 'post_published',
  POST_FAILED = 'post_failed',
  SCHEDULED_REMINDER = 'scheduled_reminder',
  ANALYTICS_REPORT = 'analytics_report',
  ACCOUNT_CONNECTED = 'account_connected',
  ACCOUNT_DISCONNECTED = 'account_disconnected',
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

// Content Calendar types
export interface CalendarEvent {
  id: string;
  postId: string;
  title: string;
  date: Date;
  platforms: SocialPlatform[];
  status: PostStatus;
  type: 'post' | 'story' | 'reel' | 'video';
}

// Media types
export interface MediaFile {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  duration?: number; // for videos
  dimensions?: {
    width: number;
    height: number;
  };
  createdAt: Date;
}

// Team/Collaboration types
export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
  permissions: TeamPermission[];
  invitedAt: Date;
  joinedAt?: Date;
  status: TeamMemberStatus;
}

export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export enum TeamPermission {
  CREATE_POST = 'create_post',
  EDIT_POST = 'edit_post',
  DELETE_POST = 'delete_post',
  PUBLISH_POST = 'publish_post',
  MANAGE_ACCOUNTS = 'manage_accounts',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_TEAM = 'manage_team',
}

export enum TeamMemberStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// Push Notification types
export interface PushNotificationPayload {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  badge?: number;
  sound?: string;
  icon?: string;
  image?: string;
}

// Settings types
export interface UserSettings {
  userId: string;
  notifications: {
    email: boolean;
    push: boolean;
    postPublished: boolean;
    postFailed: boolean;
    scheduledReminder: boolean;
    weeklyReport: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showStats: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    defaultPlatforms: SocialPlatform[];
  };
}
