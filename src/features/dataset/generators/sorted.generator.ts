export function generateSortedArray(
  size: number,
  min: number,
  max: number
): number[] {
  const arr = new Array<number>(size);
  const step = (max - min) / Math.max(1, size - 1);

  for (let i = 0; i < size; i++) {
    arr[i] = Math.floor(min + i * step);
  }

  return arr;
}
