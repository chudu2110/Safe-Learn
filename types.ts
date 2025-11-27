// FIX: Import React to fix "Cannot find namespace 'React'" error for React.ReactNode type.
import React from 'react';

export enum UserRole {
  STUDENT_MS = 'Học sinh THCS', // Middle School
  STUDENT_HS = 'Học sinh THPT', // High School
  PARENT = 'Phụ huynh',
  ADMIN = 'Quản trị viên',
}

export enum View {
  STUDENT_DASHBOARD,
  PARENT_DASHBOARD,
  ADMIN_DASHBOARD,
  MAP,
  QA,
  SCENARIOS,
  AUTH,
  HOME,
  MOODTRACKER,
  PARENT_ARTICLES,
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
}

export interface QASubmission {
  id: number;
  question: string;
  answer: string;
  isPopular: boolean;
}

export enum MapServiceType {
  GYNECOLOGY = 'Phụ khoa',
  ANDROLOGY = 'Nam khoa',
  COUNSELING = 'Tư vấn',
  HOTLINE = 'Hotline',
}

export interface ServicePoint {
  id: number;
  name: string;
  type: MapServiceType;
  address: string;
  friendly: 'teen' | 'all';
  position: { top: string; left: string };
}

// Gamification Types
export interface RoadmapItem {
  id: number;
  type: 'lesson' | 'badge';
  title: string;
  status: 'completed' | 'current' | 'locked';
  position: { top: string; left: string; };
}

export interface LeaderboardUser {
    id: number;
    name: string;
    xp: number;
    avatar: string;
    isCurrentUser?: boolean;
}

// New type for Interactive Scenarios
export interface Scenario {
  title: string;
  situation: string;
  options: {
    text: string;
    feedback: string;
  }[];
}

// Admin Dashboard Types
export interface AdminStats {
  totalStudents: { value: number; change: number };
  totalParents: { value: number; change: number };
  completionRate: { value: number; change: number };
  engagementRate: { value: number; change: number };
}

export interface ModuleCompletion {
    id: string;
    title: string;
    completion: number;
}

export interface UserDistribution {
    role: UserRole;
    count: number;
}
