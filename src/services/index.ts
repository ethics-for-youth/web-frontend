// Central API Services Export
export { eventsApi } from './eventsApi';
export { competitionsApi } from './competitionsApi';
export { volunteersApi } from './volunteersApi';
export { suggestionsApi } from './suggestionsApi';
export { registrationsApi } from './registrationsApi';

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