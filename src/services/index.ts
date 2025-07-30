// Central API Services Export
export { eventsApi } from './eventsApi';
export { competitionsApi } from './competitionsApi';
export { volunteersApi } from './volunteersApi';
export { suggestionsApi } from './suggestionsApi';
export { registrationsApi } from './registrationsApi';
export { coursesApi } from './coursesApi';
export { messagesApi } from './messagesApi';
export { adminStatsApi } from './adminStatsApi';

// Re-export types for convenience
export type {
  GetEventsResponse,
  GetEventResponse,
  CreateEventRequest,
  UpdateEventRequest,
  GetCompetitionsResponse,
  GetCompetitionResponse,
  CompetitionRegistrationRequest,
  VolunteerJoinRequest,
  CreateSuggestionRequest,
  ListQueryParams,
} from '@/types/api';

// Re-export new service types
export type { 
  Registration, 
  CreateRegistrationRequest as NewCreateRegistrationRequest,
  UpdateRegistrationRequest,
  RegistrationFilters 
} from './registrationsApi';

export type { 
  Course, 
  CreateCourseRequest, 
  UpdateCourseRequest 
} from './coursesApi';

export type { 
  Message, 
  CreateMessageRequest, 
  MessageFilters 
} from './messagesApi';

export type { 
  AdminStats, 
  AdminStatsResponse 
} from './adminStatsApi';