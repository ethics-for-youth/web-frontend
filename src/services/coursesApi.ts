// Courses API Service
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api';
import { transformDynamoDBArray, transformDynamoDBObject, isDynamoDBFormatted } from '@/utils/dynamoDbTransform';

// Course data types based on your API spec
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;
  schedule?: string;
  materials?: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  instructor: string;
  duration: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;
  schedule?: string;
  materials?: string;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  instructor?: string;
  duration?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;
  schedule?: string;
  materials?: string;
  status?: 'active' | 'inactive' | 'completed';
}

export const coursesApi = {
  // Get all courses
  getCourses: async (): Promise<Course[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COURSES);
      
      if (API_CONFIG.enableLogging) {
        console.log('Courses API Response:', response.data);
      }
      
      let courses: Course[] = [];
      
      // According to API spec: { success: boolean, message: string, data: { courses: [], count: number } }
      if (response.data.success && response.data.data && Array.isArray(response.data.data.courses)) {
        courses = response.data.data.courses;
      } else if (Array.isArray(response.data)) {
        courses = response.data;
      } else {
        console.error('Unexpected courses API response:', response.data);
        return [];
      }

      // Transform DynamoDB data if needed
      if (courses.length > 0 && isDynamoDBFormatted(courses[0])) {
        if (API_CONFIG.enableLogging) {
          console.log('Transforming DynamoDB formatted courses data');
        }
        return transformDynamoDBArray(courses);
      }

      return courses;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get single course by ID
  getCourse: async (id: string): Promise<Course> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COURSE_DETAIL(id));
      
      // According to API spec: { success: boolean, message: string, data: { course: Course } }
      let course: Course;
      
      if (response.data.success && response.data.data && response.data.data.course) {
        course = response.data.data.course;
      } else if (response.data.course) {
        course = response.data.course;
      } else {
        course = response.data;
      }

      // Transform DynamoDB data if needed
      if (isDynamoDBFormatted(course)) {
        if (API_CONFIG.enableLogging) {
          console.log('Transforming DynamoDB formatted course data');
        }
        return transformDynamoDBObject(course);
      }

      return course;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create new course
  createCourse: async (courseData: CreateCourseRequest): Promise<Course> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.COURSES, courseData);
      
      // According to API spec: { success: boolean, message: string, data: { course: Course } }
      if (response.data.success && response.data.data && response.data.data.course) {
        const course = response.data.data.course;
        
        // Transform DynamoDB data if needed
        if (isDynamoDBFormatted(course)) {
          return transformDynamoDBObject(course);
        }
        
        return course;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update course
  updateCourse: async (id: string, courseData: UpdateCourseRequest): Promise<Course> => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.COURSE_DETAIL(id), courseData);
      
      // According to API spec: { success: boolean, message: string, data: { course: Course } }
      if (response.data.success && response.data.data && response.data.data.course) {
        const course = response.data.data.course;
        
        // Transform DynamoDB data if needed
        if (isDynamoDBFormatted(course)) {
          return transformDynamoDBObject(course);
        }
        
        return course;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete course
  deleteCourse: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(API_ENDPOINTS.COURSE_DETAIL(id));
      // No need to return anything for successful deletion
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};