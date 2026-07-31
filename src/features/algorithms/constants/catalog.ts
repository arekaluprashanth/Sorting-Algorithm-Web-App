import type { AlgorithmId, AlgorithmInformation } from '../types';

/**
 * Theoretical metadata catalog for all 9 supported sorting algorithms.
 * Every algorithm includes exact time & space complexities, stability, in-place behavior,
 * advantages, disadvantages, and target dataset recommendations.
 */
export const ALGORITHM_CATALOG: Record<AlgorithmId, AlgorithmInformation> = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    description:
      'Simple comparison algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    category: 'comparison',
    isStable: true,
    isInPlace: true,
    isRecursive: false,
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    suitableDatasetSizes: 'Small datasets (n ≤ 1,000)',
    advantages: [
      'Extremely simple to implement and understand',
      'Stable sort preserving relative order of duplicate items',
      'Detects already-sorted arrays in O(n) time with early exit',
      'In-place sorting requiring O(1) extra space',
    ],
    disadvantages: [
      'Inefficient O(n²) average and worst-case time complexity',
      'Performs an excessive number of swaps compared to Selection Sort',
      'Not suitable for production or large datasets',
    ],
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    description:
      'In-place comparison sort that divides the array into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region.',
    category: 'comparison',
    isStable: false,
    isInPlace: true,
    isRecursive: false,
    complexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    suitableDatasetSizes: 'Small datasets (n ≤ 1,000)',
    advantages: [
      'Performs at most O(n) swaps, making it ideal when memory write operations are expensive',
      'Simple in-place implementation requiring O(1) auxiliary space',
      'Performance is predictable regardless of initial array order',
    ],
    disadvantages: [
      'Unstable algorithm that may alter relative order of duplicate elements',
      'Always executes O(n²) comparisons even on already sorted input',
      'Poor performance on large datasets',
    ],
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    description:
      'Builds the final sorted array one item at a time by repeatedly taking the next element and inserting it into its correct position among previously sorted elements.',
    category: 'comparison',
    isStable: true,
    isInPlace: true,
    isRecursive: false,
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    suitableDatasetSizes: 'Small datasets (n ≤ 1,000) or nearly sorted datasets',
    advantages: [
      'Highly efficient for small array sizes and nearly sorted data (O(n) best case)',
      'Stable and in-place algorithm',
      'Adaptive: speed scales directly with how sorted the input dataset is',
      'Used as base-case cutoff in hybrid algorithms (Timsort, IntroSort)',
    ],
    disadvantages: [
      'O(n²) time complexity on reverse-sorted or randomly ordered large inputs',
      'Requires many element shift writes',
    ],
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    description:
      'Divide-and-conquer algorithm that recursively divides the input array into halves, sorts each half, and merges the sorted halves back together.',
    category: 'comparison',
    isStable: true,
    isInPlace: false,
    isRecursive: true,
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)',
    },
    suitableDatasetSizes: 'Medium to Large datasets (n up to 1,000,000+)',
    advantages: [
      'Guaranteed O(n log n) worst-case time complexity',
      'Stable sort preserving relative duplicate order',
      'Well-suited for linked lists and external storage sorting',
      'Highly parallelizable divide-and-conquer structure',
    ],
    disadvantages: [
      'Requires O(n) auxiliary memory space for temporary array buffers',
      'Higher constant factors for small array sizes compared to Quick Sort',
    ],
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    description:
      'Divide-and-conquer algorithm that partitions an array around a pivot element such that smaller elements move left and larger elements move right.',
    category: 'comparison',
    isStable: false,
    isInPlace: true,
    isRecursive: true,
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)',
    },
    suitableDatasetSizes: 'Large datasets (n up to 1,000,000+)',
    advantages: [
      'Extremely fast in practice with low cache-friendly constant factors',
      'In-place sorting requiring only O(log n) call stack space',
      'Widely used standard in production libraries (qsort, std::sort)',
    ],
    disadvantages: [
      'Unstable algorithm',
      'Worst-case O(n²) time when poor pivots are selected on sorted data (mitigated by median-of-three)',
    ],
  },
  heap: {
    id: 'heap',
    name: 'Heap Sort',
    description:
      'Comparison-based algorithm that constructs a binary max-heap out of the input data and repeatedly extracts the maximum element.',
    category: 'comparison',
    isStable: false,
    isInPlace: true,
    isRecursive: false,
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)',
    },
    suitableDatasetSizes: 'Medium to Large datasets (n up to 1,000,000+)',
    advantages: [
      'Guaranteed O(n log n) worst-case time complexity',
      'Strictly in-place sorting using O(1) auxiliary memory',
      'Optimal memory choice for memory-constrained embedded systems',
    ],
    disadvantages: [
      'Unstable algorithm',
      'Poor locality of reference resulting in sub-optimal CPU cache performance compared to Quick Sort',
    ],
  },
  shell: {
    id: 'shell',
    name: 'Shell Sort',
    description:
      'Generalization of insertion sort that allows exchanges of items that are far apart using a diminishing gap sequence.',
    category: 'comparison',
    isStable: false,
    isInPlace: true,
    isRecursive: false,
    complexity: {
      best: 'O(n log n)',
      average: 'O(n^1.3)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    suitableDatasetSizes: 'Medium datasets (n ≤ 100,000)',
    advantages: [
      'Significantly faster than O(n²) simple sorts',
      'In-place algorithm requiring O(1) memory',
      'Simple implementation with no recursion overhead',
    ],
    disadvantages: [
      'Unstable algorithm',
      'Performance depends heavily on the chosen gap sequence (uses Ciura sequence)',
    ],
  },
  counting: {
    id: 'counting',
    name: 'Counting Sort',
    description:
      'Non-comparison integer sorting algorithm that counts the occurrences of each unique element and calculates their positions.',
    category: 'non-comparison',
    isStable: true,
    isInPlace: false,
    isRecursive: false,
    complexity: {
      best: 'O(n + k)',
      average: 'O(n + k)',
      worst: 'O(n + k)',
      space: 'O(k)',
    },
    suitableDatasetSizes: 'Large datasets with small integer ranges (k ≤ 100,000)',
    advantages: [
      'Linear time complexity O(n + k) when range k is proportional to n',
      'Stable non-comparison sort',
      'Bypasses lower bound O(n log n) of comparison sorts',
    ],
    disadvantages: [
      'Only applicable to integer values',
      'Requires substantial auxiliary memory O(k) when value range (max - min) is huge',
    ],
  },
  radix: {
    id: 'radix',
    name: 'Radix Sort',
    description:
      'Non-comparison algorithm that sorts numbers digit by digit starting from the least significant digit (LSD) using Counting Sort as a sub-routine.',
    category: 'non-comparison',
    isStable: true,
    isInPlace: false,
    isRecursive: false,
    complexity: {
      best: 'O(d · (n + k))',
      average: 'O(d · (n + k))',
      worst: 'O(d · (n + k))',
      space: 'O(n + k)',
    },
    suitableDatasetSizes: 'Large datasets of integers or fixed-length strings',
    advantages: [
      'Linear time scaling for fixed digit length d',
      'Stable sorting algorithm',
      'Fast performance on large integer collections',
    ],
    disadvantages: [
      'Limited to keys that can be partitioned into digits or characters',
      'Requires additional memory for bucket buffers',
    ],
  },
};
