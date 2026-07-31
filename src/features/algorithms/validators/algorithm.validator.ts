/**
 * Input validators for sorting algorithm execution.
 */

export interface AlgorithmValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates basic array inputs for sorting.
 */
export function validateArrayInput(data: number[]): AlgorithmValidationResult {
  if (!Array.isArray(data)) {
    return { isValid: false, error: 'Input must be an array.' };
  }
  return { isValid: true };
}

/**
 * Validates that all elements in array are integers (required by Counting and Radix Sort).
 */
export function validateIntegerArray(data: number[]): AlgorithmValidationResult {
  for (let i = 0; i < data.length; i++) {
    if (!Number.isInteger(data[i])) {
      return {
        isValid: false,
        error: `Non-integer element detected at index ${i}: ${data[i]}. Counting and Radix sort require integer inputs.`,
      };
    }
  }
  return { isValid: true };
}

/**
 * Validates that all elements in array are non-negative integers (required by standard Radix Sort).
 */
export function validateNonNegativeIntegerArray(data: number[]): AlgorithmValidationResult {
  for (let i = 0; i < data.length; i++) {
    const val = data[i]!;
    if (!Number.isInteger(val) || val < 0) {
      return {
        isValid: false,
        error: `Invalid element detected at index ${i}: ${val}. Standard Radix Sort requires non-negative integers.`,
      };
    }
  }
  return { isValid: true };
}
