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
  registrationFee?: number; // Event fee for payment integration
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
  // Optional fields from OpenAPI spec
  experience?: string;
  motivation?: string;
  preferredRoles?: string[];
  assignedRole?: string;
  team?: string;
  approvedAt?: string;
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
  registrationFee?: number; // Course fee for payment integration
  maxParticipants?: number;
  instructor?: string;
  level?: string;
  materials?: string;
  startDate?: string;
  endDate?: string;
  schedule?: string;
  status?: string;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  gender: 'Male' | 'Female';
  age: number;
  education: string;
  address?: string; // Made optional since API doesn't require it
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

// Payment related types
export interface PaymentUserDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface PaymentItemDetails {
  id: string;
  name: string;
  itemType: 'event' | 'competition' | 'course';
}

export interface PaymentOrderRequest {
  amount: number;
  currency: string;
  receipt: string;
  userId: string;
  itemId: string;
  itemType: 'event' | 'competition' | 'course';
  userName: string;
  userEmail: string;
  userPhone?: string;
  notes: string;
}

export interface PaymentOrderResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    amount: number;
    currency: string;
    status: string;
    receipt: string;
    notes: Record<string, string>;
    createdAt: number;
    timestamp: string;
  };
}

export interface PaymentErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  orderId: string;
  registrationId: string;
  amount: number;
  currency: string;
  status: string;
  receipt: string;
  notes: string;
  createdAt: number;
  requestId: string;
  timestamp: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: string;
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

// Global Razorpay interface
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}