/**
 * StorageAdapter — abstract interface for key-value persistence.
 *
 * All history storage flows through this contract so that the backing
 * store can be swapped (LocalStorage → IndexedDB → REST API) without
 * touching any business logic or UI code.
 */
export interface StorageAdapter {
  /** Retrieve a value by key. Returns null if the key does not exist. */
  getItem(key: string): string | null;

  /** Persist a value under the given key. Throws on quota exceeded. */
  setItem(key: string, value: string): void;

  /** Remove a single key. No-op if the key does not exist. */
  removeItem(key: string): void;

  /** Remove all keys managed by this adapter. */
  clear(): void;

  /** Return all keys managed by this adapter. */
  keys(): string[];

  /** Estimate the total bytes used by this adapter's data. */
  getUsedBytes(): number;
}
