// React Query hooks for Courses API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi, Course, CreateCourseRequest, UpdateCourseRequest } from '@/services';
import { toast } from '@/hooks/use-toast';

// Query keys for courses
export const coursesQueryKeys = {
  all: ['courses'] as const,
  lists: () => [...coursesQueryKeys.all, 'list'] as const,
  list: () => [...coursesQueryKeys.lists()] as const,
  details: () => [...coursesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...coursesQueryKeys.details(), id] as const,
};

// Hook to fetch all courses
export const useCourses = () => {
  return useQuery({
    queryKey: coursesQueryKeys.list(),
    queryFn: () => coursesApi.getCourses(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook to fetch single course
export const useCourse = (id: string) => {
  return useQuery({
    queryKey: coursesQueryKeys.detail(id),
    queryFn: () => coursesApi.getCourse(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook to create new course (admin only)
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData: CreateCourseRequest) => coursesApi.createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.lists() });
      toast({
        title: "Course Created",
        description: "The course has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Creating Course",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to update course (admin only)
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, courseData }: { id: string; courseData: UpdateCourseRequest }) => 
      coursesApi.updateCourse(id, courseData),
    onSuccess: (updatedCourse) => {
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.detail(updatedCourse.id) });
      toast({
        title: "Course Updated",
        description: "The course has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Updating Course",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to delete course (admin only)
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coursesApi.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesQueryKeys.lists() });
      toast({
        title: "Course Deleted",
        description: "The course has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Deleting Course",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};