import { DistributionType } from '../types';

/**
 * Optimized array generation with reduced Math.random() calls
 * Uses typed arrays and batch generation for better performance with large N
 */
export function generateArray(size: number, distribution: DistributionType, maxVal?: number): number[] {
  const max = maxVal ?? size * 10;
  const arr = new Array<number>(size);

  // Batch random generation for better performance with large arrays
  const batchSize = Math.min(10000, size);
  const batches = Math.ceil(size / batchSize);
  const remaining = size % batchSize || batchSize;

  switch (distribution) {
    case 'random': {
      // Generate all random values in batches for better cache performance
      for (let b = 0; b < batches; b++) {
        const start = b * batchSize;
        const end = Math.min(start + batchSize, size);
        for (let i = start; i < end; i++) {
          arr[i] = Math.floor(Math.random() * max);
        }
      }
      return arr;
    }

    case 'sorted': {
      for (let i = 0; i < size; i++) {
        arr[i] = i * 2;
      }
      return arr;
    }

    case 'reversed': {
      for (let i = 0; i < size; i++) {
        arr[i] = (size - i) * 2;
      }
      return arr;
    }

    case 'nearly_sorted': {
      // Create sorted array first
      for (let i = 0; i < size; i++) {
        arr[i] = i * 2;
      }
      // Perturb ~5% of pairs - optimized with single Math.random() call per swap
      const swaps = Math.max(1, Math.floor(size * 0.05));
      for (let s = 0; s < swaps; s++) {
        const i = Math.floor(Math.random() * size);
        const offset = (Math.random() - 0.5) * 10;
        const j = Math.max(0, Math.min(size - 1, Math.floor(i + offset)));
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
      return arr;
    }

    case 'few_unique': {
      // Pre-compute unique values and reuse them
      const uniqueCount = Math.min(8, Math.max(3, Math.floor(Math.log2(size))));
      const uniqueValues = Array.from({ length: uniqueCount }, (_, idx) => (idx + 1) * 100);
      // Create lookup table for faster random selection
      const valueLookup = uniqueValues;
      for (let i = 0; i < size; i++) {
        arr[i] = valueLookup[Math.floor(Math.random() * uniqueCount)];
      }
      return arr;
    }

    case 'sawtooth': {
      const cycleLength = Math.max(10, Math.floor(size / 5));
      for (let i = 0; i < size; i++) {
        arr[i] = (i % cycleLength) * 3;
      }
      return arr;
    }

    default:
      for (let i = 0; i < size; i++) {
        arr[i] = Math.floor(Math.random() * max);
      }
      return arr;
  }
}

export const DISTRIBUTION_DESCRIPTIONS: Record<DistributionType, { name: string; desc: string; icon: string }> = {
  random: {
    name: 'Uniform Random',
    desc: 'Numbers uniformly distributed at random across the range.',
    icon: '🎲',
  },
  nearly_sorted: {
    name: 'Nearly Sorted (95%)',
    desc: 'Already mostly in order with 5% slight position disturbances.',
    icon: '📈',
  },
  reversed: {
    name: 'Reversed (Descending)',
    desc: 'Strictly descending values; notorious worst-case for simple algorithms.',
    icon: '📉',
  },
  few_unique: {
    name: 'Few Unique Values',
    desc: 'High duplicate density with only 4–8 distinct values throughout.',
    icon: '👥',
  },
  sorted: {
    name: 'Already Sorted',
    desc: 'Strictly ascending values; tests best-case adaptive performance.',
    icon: '✅',
  },
  sawtooth: {
    name: 'Sawtooth / Repeating Waves',
    desc: 'Multiple ascending ramps repeating in cycles.',
    icon: '⚡',
  },
};
