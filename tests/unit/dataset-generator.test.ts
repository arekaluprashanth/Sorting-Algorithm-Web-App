import { describe, it, expect } from 'vitest';
import { generateDataset } from '../../src/features/dataset';
import type { DatasetConfig } from '../../src/features/dataset';

describe('Dataset Generator Module', () => {
  it('should generate random dataset of specified size', () => {
    const config: DatasetConfig = { size: 100, type: 'random', min: 1, max: 500 };
    const data = generateDataset(config);

    expect(data).toHaveLength(100);
    data.forEach((val) => {
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(500);
    });
  });

  it('should generate sorted dataset', () => {
    const config: DatasetConfig = { size: 50, type: 'sorted', min: 1, max: 100 };
    const data = generateDataset(config);

    expect(data).toHaveLength(50);
    for (let i = 1; i < data.length; i++) {
      expect(data[i]!).toBeGreaterThanOrEqual(data[i - 1]!);
    }
  });

  it('should generate reversed dataset', () => {
    const config: DatasetConfig = { size: 50, type: 'reversed', min: 1, max: 100 };
    const data = generateDataset(config);

    expect(data).toHaveLength(50);
    for (let i = 1; i < data.length; i++) {
      expect(data[i]!).toBeLessThanOrEqual(data[i - 1]!);
    }
  });

  it('should generate nearly sorted dataset', () => {
    const config: DatasetConfig = { size: 50, type: 'nearly-sorted', min: 1, max: 100 };
    const data = generateDataset(config);

    expect(data).toHaveLength(50);
  });

  it('should generate few unique values dataset', () => {
    const config: DatasetConfig = { size: 50, type: 'few-unique', min: 1, max: 100 };
    const data = generateDataset(config);

    const uniqueValues = new Set(data);
    expect(uniqueValues.size).toBeLessThanOrEqual(10);
  });
});
