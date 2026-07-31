import type { DatasetOptions, ValidationResult } from '../types';
import { DATASET_LIMITS } from '../constants';

/**
 * Validates dataset configuration options to ensure safe and plausible generation.
 * Prevents memory overflows, invalid ranges, and negative limits.
 */
export function validateDatasetOptions(options: DatasetOptions): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Size validation
  if (options.size < DATASET_LIMITS.MIN_SIZE) {
    errors.push(`Array size must be at least ${DATASET_LIMITS.MIN_SIZE} elements.`);
  } else if (options.size > DATASET_LIMITS.MAX_SIZE) {
    errors.push(`Array size cannot exceed ${DATASET_LIMITS.MAX_SIZE.toLocaleString()} elements.`);
  }

  // Custom input type check
  if (options.type === 'custom') {
    if (!options.customInput || !options.customInput.trim()) {
      errors.push('Custom input string cannot be empty.');
    } else {
      const parsed = parseCustomInputString(options.customInput);
      if (parsed.length === 0) {
        errors.push('No valid numbers could be parsed from the custom input.');
      } else if (parsed.length < DATASET_LIMITS.MIN_SIZE) {
        warnings.push(`Custom array size (${parsed.length}) is below the recommended minimum (${DATASET_LIMITS.MIN_SIZE}).`);
      }
    }
  } else {
    // Range validation
    if (options.min > options.max) {
      errors.push(`Minimum value (${options.min}) cannot be greater than Maximum value (${options.max}).`);
    }

    if (options.min < DATASET_LIMITS.MIN_VAL || options.max > DATASET_LIMITS.MAX_VAL) {
      warnings.push(`Values outside standard range [${DATASET_LIMITS.MIN_VAL}, ${DATASET_LIMITS.MAX_VAL}].`);
    }

    // Nearly sorted swap % check
    if (options.type === 'nearly-sorted') {
      const pct = options.nearlySortedPercentage ?? 5;
      if (pct < 1 || pct > 50) {
        errors.push('Nearly sorted swap percentage must be between 1% and 50%.');
      }
    }

    // Duplicate ratio check
    if (options.type === 'many-duplicates') {
      const ratio = options.duplicateRatio ?? 0.1;
      if (ratio <= 0 || ratio >= 1) {
        errors.push('Duplicate ratio must be between 0.01 and 0.99.');
      }
    }
  }

  // High size warning
  if (options.size > 250000) {
    warnings.push(`Generating ${options.size.toLocaleString()} elements may take a few seconds.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Parses user custom input text into a array of numbers.
 * Handles comma, space, semicolon, and newline separators.
 */
export function parseCustomInputString(input: string): number[] {
  if (!input) return [];
  const tokens = input.split(/[\s,;\n]+/);
  const result: number[] = [];

  for (const token of tokens) {
    const trimmed = token.trim();
    if (trimmed !== '') {
      const num = Number(trimmed);
      if (!isNaN(num)) {
        result.push(num);
      }
    }
  }

  return result;
}
