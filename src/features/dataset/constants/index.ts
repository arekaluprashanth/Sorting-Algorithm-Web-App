import type { DatasetOptions, DatasetTypeDescriptor } from '../types';

/** Presets for dataset sizes required by Step 6 specs. */
export const DATASET_SIZE_PRESETS = [
  100, 500, 1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000,
] as const;

/** Minimum & maximum supported array bounds. */
export const DATASET_LIMITS = {
  MIN_SIZE: 10,
  MAX_SIZE: 1000000,
  MIN_VAL: -1000000,
  MAX_VAL: 1000000,
} as const;

/** Default dataset generation options. */
export const DEFAULT_DATASET_OPTIONS: DatasetOptions = {
  type: 'random',
  size: 1000,
  min: 1,
  max: 10000,
  seed: 12345,
  nearlySortedPercentage: 5,
  duplicateRatio: 0.1,
  customInput: '42, 17, 89, 3, 56, 12, 94, 28, 65, 33',
};

/** Metadata for available dataset distribution types. */
export const DATASET_TYPE_DESCRIPTORS: DatasetTypeDescriptor[] = [
  {
    id: 'random',
    name: 'Random',
    description: 'Uniformly distributed random values across the given range',
    iconName: 'Shuffle',
  },
  {
    id: 'sorted',
    name: 'Sorted (Ascending)',
    description: 'Elements strictly arranged in ascending order',
    iconName: 'TrendingUp',
  },
  {
    id: 'reverse-sorted',
    name: 'Reverse Sorted',
    description: 'Elements in descending order (worst-case scenario for many algorithms)',
    iconName: 'TrendingDown',
  },
  {
    id: 'nearly-sorted',
    name: 'Nearly Sorted',
    description: 'Sorted array with a configurable percentage of random displacements',
    iconName: 'ListOrdered',
    defaultNearlySortedPct: 5,
  },
  {
    id: 'few-unique',
    name: 'Few Unique',
    description: 'Only √n distinct values with many repeated elements',
    iconName: 'Copy',
  },
  {
    id: 'many-duplicates',
    name: 'Duplicate Heavy',
    description: 'Array with high density of duplicated values (configurable ratio)',
    iconName: 'Layers',
    defaultDuplicateRatio: 0.1,
  },
  {
    id: 'custom',
    name: 'Custom Input',
    description: 'User-entered numbers parsed from comma, space, or newline text',
    iconName: 'Edit3',
  },
];

/** Backward compatibility alias */
export const DATASET_TYPES = DATASET_TYPE_DESCRIPTORS;
