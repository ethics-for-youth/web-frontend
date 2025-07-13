// Data models for Ethics For Youth

export interface Event {
  id: string;
  title: string;
  date: string; // ISO date string
  time: string;
  location: string;
  speaker: string;
  description: string;
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