// Utility functions to transform DynamoDB response data to normal JavaScript objects

export interface DynamoDBValue {
  S?: string;
  N?: string;
  BOOL?: boolean;
  L?: DynamoDBValue[];
  M?: Record<string, DynamoDBValue>;
}

// Helper function to safely extract string values from potentially DynamoDB objects
export const safeString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  } else if (value && typeof value === 'object' && value !== null && 'S' in value) {
    return (value as { S: string }).S || '';
  } else if (value && typeof value === 'object' && value !== null && 'N' in value) {
    return (value as { N: string }).N || '';
  } else if (value && typeof value === 'object' && value !== null && 'BOOL' in value) {
    return (value as { BOOL: boolean }).BOOL ? 'true' : 'false';
  } else {
    return String(value || '');
  }
};

// Helper function to safely extract number values from potentially DynamoDB objects
export const safeNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return value;
  } else if (typeof value === 'string') {
    return parseInt(value, 10) || 0;
  } else if (value && typeof value === 'object' && value !== null && 'N' in value) {
    return parseInt((value as { N: string }).N, 10) || 0;
  } else {
    return 0;
  }
};

// Helper function to safely extract boolean values from potentially DynamoDB objects
export const safeBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  } else if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  } else if (value && typeof value === 'object' && value !== null && 'BOOL' in value) {
    return (value as { BOOL: boolean }).BOOL || false;
  } else {
    return false;
  }
};

// Recursively transform an object that may contain DynamoDB formatted values
export const transformDynamoDBObject = <T extends Record<string, any>>(obj: T): T => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const transformed: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && value !== null) {
      // Check if this is a DynamoDB formatted value
      if ('S' in value || 'N' in value || 'BOOL' in value) {
        // It's a DynamoDB value, extract the actual value
        if ('S' in value) {
          transformed[key] = value.S;
        } else if ('N' in value) {
          transformed[key] = parseInt(value.N, 10) || 0;
        } else if ('BOOL' in value) {
          transformed[key] = value.BOOL;
        }
      } else if (Array.isArray(value)) {
        // Handle arrays
        transformed[key] = value.map(item => transformDynamoDBObject(item));
      } else {
        // Recursively transform nested objects
        transformed[key] = transformDynamoDBObject(value);
      }
    } else {
      // Regular value, keep as is
      transformed[key] = value;
    }
  }

  return transformed as T;
};

// Transform an array of objects that may contain DynamoDB formatted values
export const transformDynamoDBArray = <T extends Record<string, any>>(array: T[]): T[] => {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.map(item => transformDynamoDBObject(item));
};

// Check if an object contains DynamoDB formatted values
export const isDynamoDBFormatted = (obj: any): boolean => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object' && value !== null) {
      if ('S' in value || 'N' in value || 'BOOL' in value) {
        return true;
      }
      // Recursively check nested objects
      if (isDynamoDBFormatted(value)) {
        return true;
      }
    }
  }

  return false;
}; 