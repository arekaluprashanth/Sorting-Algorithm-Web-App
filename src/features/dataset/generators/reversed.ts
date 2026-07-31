/**
 * Reversed dataset generator — fully descending order.
 *
 * Creates the worst-case input for algorithms like Bubble Sort, Insertion Sort,
 * and some Quick Sort implementations. Elements are evenly spaced in descending order.
 */

export function generateReversed(
  size: number,
  min: number,
  max: number,
): number[] {
  const arr = new Array<number>(size);

  for (let i = 0; i < size; i++) {
    // Descending: max at index 0, min at index size-1
    arr[i] = Math.floor(max - (i / (size - 1 || 1)) * (max - min));
  }

  return arr;
}
