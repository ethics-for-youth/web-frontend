// src/utils/dateUtils.ts

import { DynamoDBValue } from './dynamoDbTransform';

// Helper function to safely parse dates from various formats
export const parseDate = (dateValue: unknown): Date | null => {
  try {
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? null : date;
    } else if (dateValue && typeof dateValue === 'object' && dateValue !== null && 'S' in dateValue) {
      // Handle AWS DynamoDB format: {S: '2024-06-10T08:00:00Z'}
      const dateObj = dateValue as { S: string };
      const dateString = dateObj.S;
      if (typeof dateString === 'string') {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
      }
    }
    return null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

// Helper function to format date for display
export const formatDateForDisplay = (dateValue: unknown): string => {
  const date = parseDate(dateValue);
  if (!date) {
    return 'Date not available';
  }

  try {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return 'Date not available';
  }
};

// Helper function to format time for display
export const formatTimeForDisplay = (dateValue: unknown): string => {
  const date = parseDate(dateValue);
  if (!date) {
    return 'Time not available';
  }

  try {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting time for display:', error);
    return 'Time not available';
  }
};

// Helper function to format date for datetime-local input
export const formatDateForInput = (dateValue: unknown): string => {
  const date = parseDate(dateValue);
  if (!date) {
    return '';
  }

  try {
    // Format as YYYY-MM-DDTHH:MM (datetime-local format)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

// Helper function to check if a date is in the future
export const isDateInFuture = (dateValue: unknown): boolean => {
  const date = parseDate(dateValue);
  if (!date) {
    return false;
  }
  return date > new Date();
};

// Helper function to get ISO string from date value
export const getISOString = (dateValue: unknown): string => {
  const date = parseDate(dateValue);
  if (!date) {
    return '';
  }
  return date.toISOString();
};

// Helper function to validate if a date value is valid
export const isValidDate = (dateValue: unknown): boolean => {
  return parseDate(dateValue) !== null;
}; 