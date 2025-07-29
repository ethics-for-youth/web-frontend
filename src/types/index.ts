// Data models for Ethics For Youth

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  location: string;
  category: string;
  maxParticipants: number;
  registrationDeadline: string; // ISO date string
  status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  registrationDeadline: string; // ISO date string
  rules: string[];
  prizes: string[];
  maxParticipants: number;
  status: string;
  participants: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  status: string;
  appliedAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  submitterName: string;
  submitterEmail: string;
  priority: string;
  tags: string[];
  status: string;
  votes: number;
  submittedAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Course {
  id: string;
  title: string;
  duration: string;
  description: string;
  mode: string; // e.g., "Online", "In-person", "Hybrid"
  enrollmentLink: string;
  isActive: boolean;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  gender: 'Male' | 'Female';
  age: number;
  education: string;
  address: string;
  paymentConfirmation?: File | null; // Optional for events
  joinCommunity: boolean;
  type: 'Event' | 'Course' | 'Volunteer';
  relatedEventId?: string;
  relatedCourseId?: string;
  createdAt: string;
  reviewed?: boolean; // Optional field for admin tracking
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}