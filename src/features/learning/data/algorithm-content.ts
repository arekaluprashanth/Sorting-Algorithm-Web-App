import type { AlgorithmMetadata } from '../types';

export const ALGORITHM_CONTENT: Record<string, AlgorithmMetadata> = {
  'bubble-sort': {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    inventor: 'Unknown (Described by Iverson)',
    year: '1962',
    category: 'comparison',
    isStable: true,
    isInPlace: true,
    isRecursive: false,
    description: 'Bubble Sort is a simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. The algorithm gets its name because smaller elements "bubble" to the top of the list.',
    useCases: ['Educational purposes', 'Small datasets', 'Nearly sorted datasets (with early exit)'],
    advantages: ['Simple to understand and implement', 'In-place sorting', 'Stable sorting'],
    disadvantages: ['Extremely inefficient for large datasets', 'O(n^2) time complexity in worst and average cases'],
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    pseudoCode: `procedure bubbleSort( A : list of sortable items )
  n = length(A)
  repeat
    swapped = false
    for i = 1 to n-1 inclusive do
      /* if this pair is out of order */
      if A[i-1] > A[i] then
        /* swap them and remember something changed */
        swap( A[i-1], A[i] )
        swapped = true
      end if
    end for
  until not swapped
end procedure`
  },
  'quick-sort': {
    id: 'quick-sort',
    name: 'Quick Sort',
    inventor: 'Tony Hoare',
    year: '1959',
    category: 'comparison',
    isStable: false,
    isInPlace: true,
    isRecursive: true,
    description: 'Quicksort is an efficient, general-purpose sorting algorithm. It uses a divide-and-conquer strategy: it picks an element as a "pivot" and partitions the given array around the picked pivot by placing it in its correct position in the sorted array, putting all smaller elements before it, and all greater elements after it.',
    useCases: ['General purpose sorting', 'Commercial applications', 'Language standard libraries (often modified)'],
    advantages: ['Very fast in practice (O(n log n) average)', 'In-place sorting', 'Good cache locality'],
    disadvantages: ['Worst-case O(n²) time complexity if poorly partitioned', 'Not stable', 'Recursive overhead'],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)'
    },
    pseudoCode: `algorithm quicksort(A, lo, hi) is
  if lo < hi then
    p := partition(A, lo, hi)
    quicksort(A, lo, p - 1)
    quicksort(A, p + 1, hi)

algorithm partition(A, lo, hi) is
  pivot := A[hi]
  i := lo
  for j := lo to hi - 1 do
    if A[j] < pivot then
      swap A[i] with A[j]
      i := i + 1
  swap A[i] with A[hi]
  return i`
  },
  'merge-sort': {
    id: 'merge-sort',
    name: 'Merge Sort',
    inventor: 'John von Neumann',
    year: '1945',
    category: 'comparison',
    isStable: true,
    isInPlace: false,
    isRecursive: true,
    description: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves. The merge() function is used for merging two halves.',
    useCases: ['Sorting linked lists', 'External sorting (large datasets that do not fit in RAM)', 'When stability is required'],
    advantages: ['Guaranteed O(n log n) time complexity', 'Stable sorting', 'Highly parallelizable'],
    disadvantages: ['Requires O(n) extra space', 'Slower than Quick Sort in practice for arrays due to memory allocations'],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)'
    },
    pseudoCode: `function merge_sort(list m)
  // Base case
  if length of m ≤ 1 then
    return m

  // Recursive case
  var left := empty list
  var right := empty list
  for each x with index i in m do
    if i < (length of m)/2 then
      add x to left
    else
      add x to right

  left := merge_sort(left)
  right := merge_sort(right)

  return merge(left, right)`
  },
  'insertion-sort': {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    inventor: 'Unknown',
    year: 'Pre-1950s',
    category: 'comparison',
    isStable: true,
    isInPlace: true,
    isRecursive: false,
    description: 'Insertion sort iterates, consuming one input element each repetition, and growing a sorted output list. At each iteration, insertion sort removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there.',
    useCases: ['Small arrays', 'Nearly sorted arrays', 'As a subroutine in more complex algorithms (e.g. TimSort)'],
    advantages: ['Simple implementation', 'Efficient for small data sets', 'Adaptive (O(n) time when nearly sorted)', 'Stable and In-place'],
    disadvantages: ['Inefficient for large datasets', 'O(n²) worst-case time complexity'],
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)'
    },
    pseudoCode: `i ← 1
while i < length(A)
  j ← i
  while j > 0 and A[j-1] > A[j]
    swap A[j] and A[j-1]
    j ← j - 1
  end while
  i ← i + 1
end while`
  },
  'heap-sort': {
    id: 'heap-sort',
    name: 'Heap Sort',
    inventor: 'J. W. J. Williams',
    year: '1964',
    category: 'comparison',
    isStable: false,
    isInPlace: true,
    isRecursive: false,
    description: 'Heapsort divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element and moving that to the sorted region. It uses a heap data structure rather than a linear-time search to find the maximum.',
    useCases: ['Embedded systems', 'When guaranteed worst-case O(n log n) is strictly required without extra space'],
    advantages: ['Guaranteed O(n log n) time complexity', 'In-place sorting (O(1) extra space)'],
    disadvantages: ['Not stable', 'Slower in practice than Quicksort due to poor cache locality'],
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)'
    },
    pseudoCode: `procedure heapsort(a, count) is
  input: an unordered array a of length count

  heapify(a, count)

  end := count - 1
  while end > 0 do
    swap(a[end], a[0])
    end := end - 1
    siftDown(a, 0, end)`
  }
};
