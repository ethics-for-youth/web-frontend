// API Request and Response Types for Ethics For Youth Platform

import { Event, Competition, Volunteer, Suggestion, Registration } from './index';

// Generic API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Paginated response for list endpoints
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
}

// Events API Types
export interface GetEventsResponse extends ApiResponse<Event[]> {}
export interface GetEventResponse extends ApiResponse<Event> {}
export interface CreateEventRequest extends Omit<Event, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateEventRequest extends Partial<CreateEventRequest> {}
export interface CreateEventResponse extends ApiResponse<Event> {}

// Competitions API Types
export interface GetCompetitionsResponse extends ApiResponse<Competition[]> {}
export interface GetCompetitionResponse extends ApiResponse<Competition> {}
export interface CompetitionRegistrationRequest {
  participantName: string;
  email: string;
  phone: string;
  age: number;
}
export interface CompetitionRegistrationResponse extends ApiResponse<{ registrationId: string }> {}
export interface GetCompetitionResultsResponse extends ApiResponse<{
  competition: Competition;
  results: Array<{
    rank: number;
    participantName: string;
    score: number;
  }>;
}> {}

// Volunteers API Types
export interface VolunteerJoinRequest extends Omit<Volunteer, 'id' | 'appliedAt' | 'updatedAt'> {}
export interface VolunteerJoinResponse extends ApiResponse<{ applicationId: string }> {}
export interface GetVolunteersResponse extends ApiResponse<Volunteer[]> {}

// Suggestions API Types
export interface CreateSuggestionRequest extends Omit<Suggestion, 'id' | 'votes' | 'submittedAt' | 'updatedAt'> {}
export interface CreateSuggestionResponse extends ApiResponse<{ suggestionId: string }> {}
export interface GetSuggestionsResponse extends ApiResponse<Suggestion[]> {}

// Registration API Types (for events/courses)
export interface CreateRegistrationRequest extends Omit<Registration, 'id' | 'createdAt' | 'reviewed'> {}
export interface CreateRegistrationResponse extends ApiResponse<{ registrationId: string }> {}

// Error response type
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Query parameters for list endpoints
export interface ListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}