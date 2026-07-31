/**
 * Creates a fast, shallow clone of an array of numbers.
 * Since we are strictly dealing with primitives (numbers), a shallow clone
 * using slice() is both perfectly safe and highly performant.
 * 
 * We avoid JSON.parse(JSON.stringify()) or structuredClone() as they are
 * unnecessarily slow for large typed arrays of primitives.
 *
 * @param dataset - The original array of numbers.
 * @returns A new array containing the exact same numbers.
 */
export const cloneDataset = (dataset: number[]): number[] => {
  // slice(0) is historically highly optimized in V8/SpiderMonkey for primitive arrays.
  return dataset.slice(0);
};

/**
 * Validates whether the provided dataset is suitable for benchmarking.
 * 
 * @param dataset - The dataset to validate.
 * @returns true if valid, false if invalid or empty.
 */
export const isDatasetValid = (dataset: number[]): boolean => {
  return Array.isArray(dataset) && dataset.length > 0;
};
